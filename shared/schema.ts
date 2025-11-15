import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const inventoryItems = pgTable("inventory_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull().default(0),
  unit: text("unit").notNull(),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(10),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
}).extend({
  name: z.string().min(1, "Item name is required"),
  category: z.enum(["Spirits", "Beer", "Wine", "Mixers", "Garnishes"], {
    errorMap: () => ({ message: "Please select a category" }),
  }),
  quantity: z.coerce.number().min(0, "Quantity must be at least 0"),
  unit: z.enum(["ml", "L", "bottles", "cases", "units"], {
    errorMap: () => ({ message: "Please select a unit" }),
  }),
  lowStockThreshold: z.coerce.number().min(0, "Threshold must be at least 0"),
});

export const adjustStockSchema = z.object({
  id: z.string(),
  adjustment: z.coerce.number().int("Adjustment must be a whole number"),
});

export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type AdjustStock = z.infer<typeof adjustStockSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;
