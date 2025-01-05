import { appRouter } from "@/server/routers/app";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = async (request: Request) => {
  return await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    onError: (err) => {
      console.error(err);
    },
  });
};

export const GET = handler;
export const POST = handler;
