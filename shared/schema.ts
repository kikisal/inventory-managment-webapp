import { sql } from "drizzle-orm";
import { mysqlTable, text, varchar, int } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { PRODUCT_CATEGORIES, PRODUCT_UNITS } from "./globals";

export const inventoryItems = mysqlTable("inventory_items", {
  id: int("id").primaryKey().autoincrement().notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  quantity: int("quantity").notNull().default(0),
  unit: text("unit").notNull(),
  lowStockThreshold: int("lowStockThreshold").notNull().default(10),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
}).extend({
  name: z.string().min(1, "Item name is required"),
  category: z.enum([...PRODUCT_CATEGORIES], {
    errorMap: () => ({ message: "Please select a category" }),
  }),
  quantity: z.coerce.number().min(0, "Quantity must be at least 0"),
  unit: z.enum([...PRODUCT_UNITS], {
    errorMap: () => ({ message: "Please select a unit" }),
  }),
  lowStockThreshold: z.coerce.number().min(0, "Threshold must be at least 0"),
});

export const adjustStockSchema = z.object({
  id: z.string(),
  adjustment: z.coerce.number().int("Adjustment must be a whole number"),
});

export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type AdjustStock         = z.infer<typeof adjustStockSchema>;
export type InventoryItem       = typeof inventoryItems.$inferSelect;
