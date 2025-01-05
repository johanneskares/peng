"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function Players({ gameId }: { gameId: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const game = trpc.getGame.useQuery({ id: gameId });
  const utils = trpc.useUtils();

  const addPlayerMutation = trpc.addPlayer.useMutation({
    onSettled: async () => {
      return await utils.getGame.invalidate();
    },
  });

  const removePlayerMutation = trpc.removePlayer.useMutation({
    onSettled: async () => {
      return await utils.getGame.invalidate();
    },
  });

  const addPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      addPlayerMutation.mutate({ name, email, gameId });
      setName("");
      setEmail("");
    }
  };

  const removePlayer = (id: string) => {
    removePlayerMutation.mutate({ id, gameId });
  };

  return (
    <>
      <form onSubmit={addPlayer} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={addPlayerMutation.isPending}
        >
          Add Player
        </Button>
      </form>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Current Players:</h3>
        {game.data?.participants.length !== 0 ? (
          <ul className="space-y-2">
            {game.data?.participants.map((player) => (
              <li
                key={player.id}
                className={cn(
                  "flex justify-between items-center bg-secondary p-2 rounded",
                  removePlayerMutation.isPending &&
                    removePlayerMutation.variables?.id === player.id &&
                    "opacity-50",
                )}
              >
                <div>
                  <span className="font-medium">{player.name}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {player.email}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePlayer(player.id)}
                  aria-label={`Remove ${player.name}`}
                  disabled={
                    removePlayerMutation.isPending &&
                    removePlayerMutation.variables?.id === player.id
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
            {addPlayerMutation.isPending && (
              <li className="flex justify-between items-center bg-secondary p-2 rounded">
                <div className="opacity-50">
                  <span className="font-medium">
                    {addPlayerMutation.variables?.name}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {addPlayerMutation.variables?.email}
                  </span>
                </div>
              </li>
            )}
          </ul>
        ) : (
          <p className="text-muted-foreground">No players added yet.</p>
        )}
      </div>
    </>
  );
}
