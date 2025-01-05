import { resened } from "../utils/resend";

export async function sendTargetNotification(
  participants: Array<{
    id: string;
    email: string;
    name: string;
    target: {
      name: string;
    } | null;
  }>,
) {
  await resened.batch.send(
    participants.map((participant) => ({
      from: "Lord of the Peng <office@penggame.com>",
      to: participant.email,
      subject: "You have a new target",
      text: `
Hi ${participant.name},

You have a new target: ${participant.target?.name ?? "ERROR"}

If you've eliminated the target, please mark it here: https://penggame.com/participant/${participant.id}

Good luck!

Lord of the Peng
`,
    })),
  );
}
