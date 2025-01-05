import { Card } from "@/components/ui/card";
import { Players } from "./players";

export default async function PlayerListCard({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;

  return (
    <Card className="w-full max-w-md mx-auto">
      <Players gameId={gameId} />
    </Card>
  );
}
