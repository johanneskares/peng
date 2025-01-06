import { game } from "@/db/schema";
import { eq } from "drizzle-orm";
import { drizzle } from "../utils/drizzle";
import { resened } from "../utils/resend";

export async function sendKillNotification(killedName: string, gameId: string) {
  const gameInstance = await drizzle.query.game.findFirst({
    where: eq(game.id, gameId),
    with: {
      participants: true,
    },
  });

  if (!gameInstance) {
    throw new Error("Game not found");
  }

  await resened.batch.send(
    gameInstance.participants.map((participant) => ({
      from: "Lord of the Peng <office@penggame.com>",
      to: participant.email,
      subject: `Someone was killed in ${gameInstance.name}`,
      text: `
Dear ${participant.name},

Someone has been eliminated: ${killedName}

Lord of the Peng
`,
    })),
  );
}
