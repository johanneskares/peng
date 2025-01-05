import { relations } from "drizzle-orm";
import { foreignKey, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const game = pgTable("game", {
  id: uuid().defaultRandom().primaryKey().unique(),
  name: text().notNull(),
  state: text({ enum: ["started", "created"] })
    .notNull()
    .default("created"),
});

export const participant = pgTable(
  "participant",
  {
    id: uuid().defaultRandom().primaryKey().unique(),
    gameId: uuid()
      .notNull()
      .references(() => game.id),
    name: text().notNull(),
    email: text().notNull(),
    targetId: uuid(),
  },
  (table) => [
    foreignKey({
      columns: [table.targetId],
      foreignColumns: [table.id],
    }),
  ],
);

export const participantRelations = relations(participant, ({ one }) => ({
  game: one(game, {
    fields: [participant.gameId],
    references: [game.id],
  }),
}));

export const gameRelations = relations(game, ({ many }) => ({
  participants: many(participant),
}));
