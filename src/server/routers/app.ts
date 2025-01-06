import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { game, participant } from "../../db/schema";
import { drizzle, drizzleInteractive } from "../utils/drizzle";
import { procedure, router } from "../utils/trpc";
import { sendKillNotification } from "./send-kill-notification";
import { sendTargetNotification } from "./send-target-notification";

export const appRouter = router({
  createGame: procedure
    .input(
      z.object({
        name: z.string().min(3, "Game name must be at least 3 characters"),
      }),
    )
    .mutation(async (opts) => {
      const [result] = await drizzle
        .insert(game)
        .values({
          name: opts.input.name,
        })
        .returning();

      if (!result) {
        throw new Error("Failed to create game");
      }

      return result.id;
    }),

  addPlayer: procedure
    .input(
      z.object({
        gameId: z.string(),
        name: z.string(),
        email: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const [gameInstance] = await drizzle
        .select()
        .from(game)
        .where(eq(game.id, opts.input.gameId));

      if (!gameInstance) {
        throw new Error("Game not found");
      }

      if (gameInstance.state === "started") {
        throw new Error("Game is already started");
      }

      const [result] = await drizzle
        .insert(participant)
        .values({
          gameId: opts.input.gameId,
          name: opts.input.name,
          email: opts.input.email,
        })
        .returning();

      return result.id;
    }),

  removePlayer: procedure
    .input(z.object({ id: z.string(), gameId: z.string() }))
    .mutation(async (opts) => {
      const [gameInstance] = await drizzle
        .select()
        .from(game)
        .where(eq(game.id, opts.input.gameId));

      if (!gameInstance) {
        throw new Error("Game not found");
      }

      if (gameInstance.state === "started") {
        throw new Error("Game is already started");
      }

      await drizzle
        .delete(participant)
        .where(
          and(
            eq(participant.id, opts.input.id),
            eq(participant.gameId, opts.input.gameId),
          ),
        );
    }),

  getGame: procedure.input(z.object({ id: z.string() })).query(async (opts) => {
    const result = await drizzle.query.game.findFirst({
      where: eq(game.id, opts.input.id),
      with: {
        participants: {
          orderBy: (participants, { asc }) => [asc(participants.createdAt)],
        },
      },
    });

    if (!result) {
      throw new Error("Game not found");
    }

    return result;
  }),

  startGame: procedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      await drizzleInteractive.transaction(async (tx) => {
        const gameInstance = await tx.query.game.findFirst({
          where: eq(game.id, opts.input.id),
          with: {
            participants: true,
          },
        });

        if (!gameInstance) {
          throw new Error("Game not found");
        }

        if (gameInstance.state === "started") {
          throw new Error("Game is already started");
        }

        if (gameInstance.participants.length < 3) {
          throw new Error("Game needs at least 3 players to start");
        }

        await tx
          .update(game)
          .set({ state: "started" })
          .where(eq(game.id, opts.input.id));

        // Shuffle Participants
        const participants = gameInstance.participants
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);

        for (let i = 0; i < participants.length; i++) {
          const currentParticipant = participants[i];
          const targetParticipant = participants[(i + 1) % participants.length];

          await tx
            .update(participant)
            .set({ targetId: targetParticipant.id })
            .where(eq(participant.id, currentParticipant.id));
        }

        const updatedGame = await tx.query.game.findFirst({
          where: eq(game.id, opts.input.id),
          with: {
            participants: {
              with: {
                target: true,
              },
            },
          },
        });

        if (!updatedGame) {
          throw new Error("Game not found");
        }

        await sendTargetNotification(
          updatedGame.participants,
          updatedGame.name,
        );
      });
    }),

  getPlayerInfo: procedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      return getPlayerInfo(opts.input.id);
    }),

  eliminateTarget: procedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const playerInfo = await getPlayerInfo(opts.input.id);

      if (playerInfo.player.isDead) {
        throw new Error("Player is already dead");
      }

      if (!playerInfo) {
        throw new Error("Player not found");
      }

      await drizzle
        .update(participant)
        .set({
          isDead: true,
          killedBy: opts.input.id,
          eliminatedAt: new Date(),
        })
        .where(eq(participant.id, playerInfo.target.id));

      const newPlayerInfo = await getPlayerInfo(opts.input.id);

      await sendTargetNotification(
        [
          {
            ...newPlayerInfo.player,
            target: newPlayerInfo.target,
          },
        ],
        newPlayerInfo.game.name,
      );

      // wait 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await sendKillNotification(playerInfo.target.name, playerInfo.game.id);
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

async function getPlayerInfo(playerId: string) {
  const playerInstance = await drizzle.query.participant.findFirst({
    where: eq(participant.id, playerId),
    with: {
      game: {
        with: {
          participants: true,
        },
      },
    },
  });

  if (!playerInstance) {
    throw new Error("Player not found");
  }

  const gameInstance = playerInstance.game;

  // Find the next alive target recursively
  let currentTargetId = playerInstance.targetId;
  const visited = new Set<string>();

  while (currentTargetId && !visited.has(currentTargetId)) {
    visited.add(currentTargetId);
    const nextTarget = gameInstance.participants.find(
      (p) => p.id === currentTargetId,
    );

    if (!nextTarget) {
      throw new Error("Target not found");
    }

    // we found an undead target
    if (!nextTarget.isDead) {
      break;
    }

    currentTargetId = nextTarget.targetId;

    // If we've looped back to ourselves, stop
    if (currentTargetId === playerInstance.id) {
      break;
    }
  }

  const target = gameInstance.participants.find(
    (p) => p.id === currentTargetId,
  );

  if (!target) {
    throw new Error("Target not found");
  }

  return {
    game: gameInstance,
    player: {
      id: playerInstance.id,
      name: playerInstance.name,
      email: playerInstance.email,
      isDead: playerInstance.isDead,
    },
    target: {
      id: target.id,
      name: target.name,
      email: target.email,
    },
    participants: {
      alive: gameInstance.participants
        .filter((p) => !p.isDead)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map((p) => ({ id: p.id, name: p.name, email: p.email })),
      eliminated: gameInstance.participants
        .filter((p) => p.isDead)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map((p) => ({ id: p.id, name: p.name, email: p.email })),
    },
  };
}
