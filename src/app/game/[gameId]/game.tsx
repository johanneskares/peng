"use client";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { trpc } from "@/utils/trpc";

export function Game({ gameId }: { gameId: string }) {
  const game = trpc.getGame.useQuery({ id: gameId });

  if (game.isLoading) {
    return <div>Loading...</div>;
  }

  if (game.error) {
    return <div>Error: {game.error.message}</div>;
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-center">
          {game.data?.name}
        </CardTitle>
        <CardDescription className="text-center mt-2">
          Share this link with your friends and let them add themselves to the
          game. Come back to this page to start the game.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <CopyToClipboard
            text={`${window.location.origin}/players/${game.data?.id}`}
          />

          <div className="my-6">
            <h3 className="text-lg font-semibold mb-2">Participants:</h3>
            {game.data?.participants.length === 0 ? (
              <p className="text-gray-500">No participants yet</p>
            ) : (
              <ul className="space-y-2">
                {game.data?.participants.map((participant) => (
                  <li
                    key={participant.id}
                    className="p-2 bg-secondary rounded-lg"
                  >
                    {participant.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </>
  );
}
