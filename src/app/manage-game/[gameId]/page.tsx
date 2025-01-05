import { Card } from "@/components/ui/card";
import { Game } from "./game";

export default async function Home({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;

  return (
    <Card className="w-full max-w-md mx-auto">
      <Game gameId={gameId} />
    </Card>
  );
}
