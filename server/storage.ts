import { type InventoryItem, type InsertInventoryItem, inventoryItems } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

export interface IStorage {
	getAllInventoryItems(): Promise<InventoryItem[]>;
	getInventoryItem(id: string): Promise<InventoryItem | undefined>;
	createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
	updateInventoryItem(id: string, item: InsertInventoryItem): Promise<InventoryItem | undefined>;
	deleteInventoryItem(id: string): Promise<boolean>;
	adjustStock(id: string, adjustment: number): Promise<InventoryItem | undefined>;
	connect(): Promise<void>;
}

export class MemStorage implements IStorage {
	private inventoryItems: Map<number, InventoryItem>;
	private db: ReturnType<typeof drizzle> | null;

	constructor() {
		this.inventoryItems = new Map();
		this.db 		    = null;
	}

	async connect() {
		const connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			database: process.env.DB_NAME,
			password: process.env.DB_PASS,
		});

		this.db = drizzle({ client: connection });

		// await this.db.insert(inventoryItems).values({
		//   category: "asd",
		//   name: "Another random item",
		//   quantity: 12,
		//   unit: "ml"
		// });
	}

	// private seedData() {
	// 	const sampleItems: InsertInventoryItem[] = [
	// 		{
	// 			name: "Whiskey Tennessee Jack Daniel's",
	// 			category: "Distillati",
	// 			quantity: 24,
	// 			unit: "bottiglie",
	// 			lowStockThreshold: 12,
	// 		},
	// 		{
	// 			name: "Vodka Grey Goose",
	// 			category: "Distillati",
	// 			quantity: 8,
	// 			unit: "bottiglie",
	// 			lowStockThreshold: 10,
	// 		},
	// 		{
	// 			name: "Gin Bombay Sapphire",
	// 			category: "Distillati",
	// 			quantity: 15,
	// 			unit: "bottiglie",
	// 			lowStockThreshold: 8,
	// 		},
	// 		{
	// 			name: "Rum Bacardi Superior",
	// 			category: "Distillati",
	// 			quantity: 6,
	// 			unit: "bottiglie",
	// 			lowStockThreshold: 10,
	// 		},
	// 		{
	// 			name: "Corona Extra (birra)",
	// 			category: "Birre",
	// 			quantity: 48,
	// 			unit: "bottiglie",
	// 			lowStockThreshold: 24,
	// 		},
	// 		{
	// 			name: "Guinness Draught (birra)",
	// 			category: "Birre",
	// 			quantity: 36,
	// 			unit: "bottiglie",
	// 			lowStockThreshold: 20,
	// 		},
	// 		{
	// 			name: "Cabernet Sauvignon (vino)",
	// 			category: "Vini",
	// 			quantity: 12,
	// 			unit: "bottiglie",
	// 			lowStockThreshold: 6,
	// 		},
	// 		{
	// 			name: "Sauvignon Blanc (vino)",
	// 			category: "Vini",
	// 			quantity: 10,
	// 			unit: "bottiglie",
	// 			lowStockThreshold: 6,
	// 		},
	// 		{
	// 			name: "Acqua Tonica",
	// 			category: "Mixers",
	// 			quantity: 30,
	// 			unit: "bottiglie",
	// 			lowStockThreshold: 15,
	// 		},
	// 		{
	// 			name: "Succo di Mirtillo Rosso",
	// 			category: "Mixers",
	// 			quantity: 5,
	// 			unit: "L",
	// 			lowStockThreshold: 8,
	// 		},
	// 		{
	// 			name: "Lime Freschi",
	// 			category: "Decorazioni",
	// 			quantity: 50,
	// 			unit: "unità",
	// 			lowStockThreshold: 20,
	// 		},
	// 	];
	// 	sampleItems.forEach((item, index) => {
	// 		// const id = randomUUID();
	// 		this.inventoryItems.set(index, { ...item, id: index });
	// 	});
	// }

	async getAllInventoryItems(): Promise<InventoryItem[]> {
		return await this.db!.select().from(inventoryItems);
	}

	async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
		const data = await this.db!.select().from(inventoryItems).where(eq(inventoryItems.id, parseInt(id))).limit(1);
		return data[0] ?? undefined;
	}

	async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
		const item: InventoryItem = { ...insertItem, id: this.inventoryItems.size };
		const result = await this.db!
			.insert(inventoryItems)
			.values(item);

		const data = await this.db!
			.select()
			.from(inventoryItems)
			.where(eq(inventoryItems.id, result[0].insertId)).limit(1);

		return data[0];
	}

	// async updateInventoryItem(
	// 	id: string,
	// 	updateData: InsertInventoryItem
	// ): Promise<InventoryItem | undefined> {
	// 	const _id = parseInt(id);
	// 	const existing = this.inventoryItems.get(_id);
	// 	if (!existing) {
	// 		return undefined;
	// 	}
	// 	const updated: InventoryItem = { ...updateData, id: _id };
	// 	this.inventoryItems.set(_id, updated);
	// 	return updated;
	// }

	async updateInventoryItem(id: string, updateData: InsertInventoryItem) {
		const _id = parseInt(id, 10);
		if (isNaN(_id)) {
			return undefined;
		}

		// Perform the update – Drizzle ignores undefined values automatically
		const updatedRows = await this.db!
			.update(inventoryItems)
			.set(updateData)
			.where(eq(inventoryItems.id, _id))
			.execute();

		if (updatedRows[0].affectedRows === 0)
			return undefined;

		// Fetch and return the fresh updated row
		const [updatedItem] = await this.db!
			.select()
			.from(inventoryItems)
			.where(eq(inventoryItems.id, _id))
			.limit(1);

		return updatedItem ?? undefined;
	}

	async deleteInventoryItem(id: string): Promise<boolean> {
		const _id = parseInt(id, 10);

		if (isNaN(_id)) {
			return false; 
		}

		const result = await this.db!
			.delete(inventoryItems)
			.where(eq(inventoryItems.id, _id))
			.execute();

		return result[0].affectedRows > 0;
	}

	async adjustStock(id: string, adjustment: number): Promise<InventoryItem | undefined> {
		const _id = parseInt(id, 10);

		if (isNaN(_id))
			return undefined;

		const updateResult = await this.db!
			.update(inventoryItems)
			.set({
				quantity: sql`GREATEST(0, quantity + ${adjustment})`,
			})
			.where(eq(inventoryItems.id, _id))
			.execute();

		if (updateResult[0].affectedRows === 0) {
			return undefined;
		}

		const [updatedItem] = await this.db!
			.select()
			.from(inventoryItems)
			.where(eq(inventoryItems.id, _id))
			.limit(1);

		return updatedItem ?? undefined;
	}
}

export const storage = new MemStorage();
