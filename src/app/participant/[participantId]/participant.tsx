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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trpc } from "@/utils/trpc";

export function Participant({ participantId }: { participantId: string }) {
  const { data, isPending } = trpc.getPlayerInfo.useQuery({
    id: participantId,
  });
  const utils = trpc.useUtils();

  const eliminatePlayerMutation = trpc.eliminateTarget.useMutation({
    onSuccess: () => {
      utils.getPlayerInfo.invalidate();
    },
  });

  if (isPending) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="mb-4 flex justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>

          <Skeleton className="h-10 w-full" />

          <Separator className="my-4" />

          <div className="space-y-4">
            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>

            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <div className="space-y-1">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const isWinner = data.target.id === participantId;
  const isEliminated = data.player.isDead;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Dear {data.player.name},</CardTitle>
      </CardHeader>
      <CardContent>
        {isWinner ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              🎉 Congratulations! 🎉
            </h2>
            <p className="text-xl">You are the last player standing!</p>
            <p className="mt-2">You have won the game!</p>
          </div>
        ) : isEliminated ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              💀 Game Over 💀
            </h2>
            <p className="text-xl">You have been eliminated!</p>
            <p className="mt-2">Better luck next time!</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between">
              <h2 className="">Your Target</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <p className="font-bold">{data.target.name}</p>
                  </TooltipTrigger>
                  <TooltipContent>{data.target.email}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full"
                  disabled={eliminatePlayerMutation.isPending}
                >
                  I have eliminated {data.target.name}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Elimination</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you have eliminated {data.target.name}? This
                    action cannot be undone. Only press this if you both agree.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      eliminatePlayerMutation.mutate({ id: participantId })
                    }
                    disabled={eliminatePlayerMutation.isPending}
                  >
                    Confirm Elimination
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}

        <Separator className="my-4" />

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">
              Still in Game ({data.participants.alive.length})
            </h2>
            <ul className="mt-2 space-y-1">
              {data.participants.alive.map((player) => (
                <li key={player.id}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>{player.name}</TooltipTrigger>
                      <TooltipContent>{player.email}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </li>
              ))}
            </ul>
          </div>

          {data.participants.eliminated.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold">
                Eliminated ({data.participants.eliminated.length})
              </h2>
              <ul className="mt-2 space-y-1">
                {data.participants.eliminated.map((player) => (
                  <li key={player.id} className="text-muted-foreground">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>{player.name}</TooltipTrigger>
                        <TooltipContent>{player.email}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
