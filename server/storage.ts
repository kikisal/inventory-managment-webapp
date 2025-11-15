import { type InventoryItem, type InsertInventoryItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItem(id: string): Promise<InventoryItem | undefined>;
  createInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: string, item: InsertInventoryItem): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: string): Promise<boolean>;
  adjustStock(id: string, adjustment: number): Promise<InventoryItem | undefined>;
}

export class MemStorage implements IStorage {
  private inventoryItems: Map<string, InventoryItem>;

  constructor() {
    this.inventoryItems = new Map();
    this.seedData();
  }

  private seedData() {
    const sampleItems: InsertInventoryItem[] = [
      {
        name: "Jack Daniel's Tennessee Whiskey",
        category: "Spirits",
        quantity: 24,
        unit: "bottles",
        lowStockThreshold: 12,
      },
      {
        name: "Grey Goose Vodka",
        category: "Spirits",
        quantity: 8,
        unit: "bottles",
        lowStockThreshold: 10,
      },
      {
        name: "Bombay Sapphire Gin",
        category: "Spirits",
        quantity: 15,
        unit: "bottles",
        lowStockThreshold: 8,
      },
      {
        name: "Bacardi Superior Rum",
        category: "Spirits",
        quantity: 6,
        unit: "bottles",
        lowStockThreshold: 10,
      },
      {
        name: "Corona Extra",
        category: "Beer",
        quantity: 48,
        unit: "bottles",
        lowStockThreshold: 24,
      },
      {
        name: "Guinness Draught",
        category: "Beer",
        quantity: 36,
        unit: "bottles",
        lowStockThreshold: 20,
      },
      {
        name: "Cabernet Sauvignon",
        category: "Wine",
        quantity: 12,
        unit: "bottles",
        lowStockThreshold: 6,
      },
      {
        name: "Sauvignon Blanc",
        category: "Wine",
        quantity: 10,
        unit: "bottles",
        lowStockThreshold: 6,
      },
      {
        name: "Tonic Water",
        category: "Mixers",
        quantity: 30,
        unit: "bottles",
        lowStockThreshold: 15,
      },
      {
        name: "Cranberry Juice",
        category: "Mixers",
        quantity: 5,
        unit: "L",
        lowStockThreshold: 8,
      },
      {
        name: "Fresh Limes",
        category: "Garnishes",
        quantity: 50,
        unit: "units",
        lowStockThreshold: 20,
      },
      {
        name: "Fresh Mint",
        category: "Garnishes",
        quantity: 3,
        unit: "units",
        lowStockThreshold: 5,
      },
    ];

    sampleItems.forEach((item) => {
      const id = randomUUID();
      this.inventoryItems.set(id, { ...item, id });
    });
  }

  async getAllInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values());
  }

  async getInventoryItem(id: string): Promise<InventoryItem | undefined> {
    return this.inventoryItems.get(id);
  }

  async createInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const id = randomUUID();
    const item: InventoryItem = { ...insertItem, id };
    this.inventoryItems.set(id, item);
    return item;
  }

  async updateInventoryItem(
    id: string,
    updateData: InsertInventoryItem
  ): Promise<InventoryItem | undefined> {
    const existing = this.inventoryItems.get(id);
    if (!existing) {
      return undefined;
    }
    const updated: InventoryItem = { ...updateData, id };
    this.inventoryItems.set(id, updated);
    return updated;
  }

  async deleteInventoryItem(id: string): Promise<boolean> {
    return this.inventoryItems.delete(id);
  }

  async adjustStock(id: string, adjustment: number): Promise<InventoryItem | undefined> {
    const item = this.inventoryItems.get(id);
    if (!item) {
      return undefined;
    }
    const newQuantity = Math.max(0, item.quantity + adjustment);
    const updated: InventoryItem = { ...item, quantity: newQuantity };
    this.inventoryItems.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
