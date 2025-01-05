import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Players } from "./players";

export default async function PlayerListCard({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = await params;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Player List</CardTitle>
        <CardDescription>
          Add yourself to the game or remove individual players. The game master
          will start the game.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Players gameId={gameId} />
      </CardContent>
    </Card>
  );
}
