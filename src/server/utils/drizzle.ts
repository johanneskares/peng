import { drizzle as createDrizzle } from "drizzle-orm/neon-http";
import { drizzle as createDrizzleInteractive } from "drizzle-orm/neon-serverless";
import * as schema from "../../db/schema";

export const drizzle = createDrizzle(process.env.DATABASE_URL ?? "", {
  schema,
});

export const drizzleInteractive = createDrizzleInteractive(
  process.env.DATABASE_URL ?? "",
  {
    schema,
  },
);
