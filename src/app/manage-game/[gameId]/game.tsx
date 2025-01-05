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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyToClipboard } from "@/components/ui/copy-to-clipboard";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";
import Link from "next/link";

export function Game({ gameId }: { gameId: string }) {
  const game = trpc.getGame.useQuery({ id: gameId });
  const startGameMutation = trpc.startGame.useMutation();

  if (game.isPending) {
    return (
      <>
        <CardHeader>
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-16 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </>
    );
  }

  if (game.error) {
    return (
      <>
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center text-destructive">
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-destructive">{game.error.message}</p>
        </CardContent>
      </>
    );
  }

  const participantCount = game.data?.participants.length || 0;

  return (
    <>
      <CardHeader>
        <CardTitle className="text-center">{game.data?.name}</CardTitle>
        <CardDescription className="text-center mt-2">
          Share this link with your friends and let them add themselves to the
          game. Come back to this page to start the game.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CopyToClipboard
          text={`${window.location.origin}/players/${game.data?.id}`}
        />
        <p className="text-center mt-4 text-sm text-muted-foreground">
          Current participants: {participantCount}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          variant="outline"
          asChild
          className="w-full"
          disabled={
            startGameMutation.isPending || game.data?.state === "started"
          }
        >
          <Link href={`/game/${game.data?.id}`}>Manage Participants</Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-full"
              disabled={
                startGameMutation.isPending || game.data?.state === "started"
              }
            >
              Start Game
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will start the game for all {participantCount}{" "}
                participants. Make sure all participants are added! Be careful,
                This action is irreversible and will send an email to every
                particpant.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => startGameMutation.mutate({ id: gameId })}
              >
                Start Game
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </>
  );
}
