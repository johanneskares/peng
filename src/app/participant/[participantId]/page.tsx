import { Card } from "@/components/ui/card";
import { Participant } from "./participant";

export default async function Page({
  params,
}: {
  params: Promise<{ participantId: string }>;
}) {
  const { participantId } = await params;

  return (
    <Card className="w-full max-w-md mx-auto">
      <Participant participantId={participantId} />
    </Card>
  );
}
