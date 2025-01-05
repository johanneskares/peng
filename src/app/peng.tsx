"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Peng() {
  const [gameName, setGameName] = useState("");
  const router = useRouter();

  const createGame = trpc.createGame.useMutation({
    onSuccess: (data) => {
      router.push(`/manage-game/${data}`);
    },
  });

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    createGame.mutate({ name: gameName });
  };

  return (
    <>
      <form onSubmit={handleCreateGame}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="game-name">Game Name</Label>
              <p className="text-sm text-muted-foreground">
                Choose a unique name for this game.
              </p>
            </div>
            <Input
              id="game-name"
              placeholder="Enter game name"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              disabled={createGame.isPending}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={createGame.isPending || createGame.isSuccess}
          >
            {createGame.isPending ? "Creating..." : "Create Game"}
          </Button>
        </CardFooter>
      </form>
    </>
  );
}
