import { resened } from "../utils/resend";

export async function sendTargetNotification(participant: {
  id: string;
  email: string;
  name: string;
  target: {
    name: string;
  } | null;
}) {
  await resened.emails.send({
    from: "office@penggame.com",
    to: participant.email,
    subject: "You have a new target",
    text: `
Hi ${participant.name},

You have a new target: ${participant.target?.name ?? "ERROR"}

If you've eliminated the target, please mark it here: https://penggame.com/participant/${participant.id}

Good luck!

Lord of the Peng
`,
  });

  // wait 600 ms for rate limit
  await new Promise((resolve) => setTimeout(resolve, 600));
}
