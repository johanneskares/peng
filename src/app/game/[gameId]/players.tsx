"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { Heart, Skull, Trash2 } from "lucide-react";
import Link from "next/link";
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

  if (game.isPending) {
    return (
      <>
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-9 w-24" />
          </div>
          <Skeleton className="h-12 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="mt-6">
            <Skeleton className="h-6 w-32 mb-2" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </CardContent>
      </>
    );
  }

  return (
    <>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{game.data?.name}</CardTitle>
          {game.data?.state !== "started" && (
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/manage-game/${gameId}`}>Manage Game</Link>
            </Button>
          )}
        </div>
        <CardDescription>
          {game.data?.state === "started"
            ? "Check your email to find out who your target is!"
            : "Add yourself to the game or remove individual players."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {game.data?.state !== "started" && (
          <form onSubmit={addPlayer} className="space-y-4 mb-6">
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
        )}
        <div className="">
          <h3 className="font-semibold mb-2">Current Players:</h3>
          {game.data?.participants.length !== 0 ||
          addPlayerMutation.isPending ? (
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
                  <div className="ml-2">
                    <span className="font-medium">{player.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {player.email}
                    </span>
                  </div>
                  {game.data?.state === "started" ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {!player.isDead ? (
                            <Heart className="h-4 w-4 text-green-500" />
                          ) : (
                            <Skull className="h-4 w-4 text-red-500" />
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          {!player.isDead
                            ? "Player is alive"
                            : "Player is dead"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove ${player.name}`}
                          disabled={
                            removePlayerMutation.isPending &&
                            removePlayerMutation.variables?.id === player.id
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Player</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {player.name} from
                            the game?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removePlayer(player.id)}
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </li>
              ))}
              {addPlayerMutation.isPending && (
                <li className="flex justify-between items-center bg-secondary p-2 rounded">
                  <div className="opacity-50 ml-2">
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
      </CardContent>
    </>
  );
}
