import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { game, participant } from "../../db/schema";
import { drizzle } from "../utils/drizzle";
import { procedure, router } from "../utils/trpc";

export const appRouter = router({
  createGame: procedure
    .input(
      z.object({
        name: z.string(),
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
        participants: true,
      },
    });

    if (!result) {
      throw new Error("Game not found");
    }

    return result;
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
