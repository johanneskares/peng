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
      router.push(`/game/${data}`);
    },
  });

  const handleCreateGame = () => {
    createGame.mutate({ name: gameName });
  };

  return (
    <>
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
          className="w-full"
          onClick={handleCreateGame}
          disabled={createGame.isPending}
        >
          {createGame.isPending ? "Creating..." : "Create Game"}
        </Button>
      </CardFooter>
    </>
  );
}
