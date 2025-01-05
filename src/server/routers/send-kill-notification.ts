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

  const emails = gameInstance.participants.map(
    (participant) => participant.email,
  );

  await resened.batch.send([
    {
      from: "Lord of the Peng <office@penggame.com>",
      to: emails,
      subject: "Someone was killed",
      text: `
Dear Pengs,

Someone has been eliminated: ${killedName}


Lord of the Peng
`,
    },
  ]);
}
