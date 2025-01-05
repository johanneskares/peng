import { drizzle as createDrizzle } from "drizzle-orm/neon-http";
import * as schema from "../../db/schema";

export const drizzle = createDrizzle(process.env.DATABASE_URL ?? "", {
  schema,
});
