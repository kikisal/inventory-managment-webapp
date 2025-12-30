import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInventoryItemSchema, adjustStockSchema } from "@shared/schema";


export async function registerRoutes(app: Express): Promise<Server> {

	await storage.connect();

	app.get("/api/inventory", async (_req, res) => {
		try {
			const items = await storage.getAllInventoryItems();
			res.json(items);
		} catch (error) {
			res.status(500).json({ error: "Failed to fetch inventory items" });
		}
	});

	app.get("/api/inventory/:id", async (req, res) => {
		try {
			const item = await storage.getInventoryItem(req.params.id);
			if (!item) {
				return res.status(404).json({ error: "Item not found" });
			}
			res.json(item);
		} catch (error) {
			res.status(500).json({ error: "Failed to fetch inventory item" });
		}
	});

	app.post("/api/inventory", async (req, res) => {
		try {
			const validatedData = insertInventoryItemSchema.parse(req.body);
			const item = await storage.createInventoryItem(validatedData);
			res.status(201).json(item);
		} catch (error) {
			if (error instanceof Error && error.name === "ZodError") {
				return res.status(400).json({ error: "Invalid data", details: error });
			}
			res.status(500).json({ error: "Failed to create inventory item" });
		}
	});

	app.put("/api/inventory/:id", async (req, res) => {
		try {
			const validatedData = insertInventoryItemSchema.parse(req.body);
			const item = await storage.updateInventoryItem(req.params.id, validatedData);
			if (!item) {
				return res.status(404).json({ error: "Item not found" });
			}
			res.json(item);
		} catch (error) {
			if (error instanceof Error && error.name === "ZodError") {
				return res.status(400).json({ error: "Invalid data", details: error });
			}
			res.status(500).json({ error: "Failed to update inventory item" });
		}
	});

	app.delete("/api/inventory/:id", async (req, res) => {
		try {
			const deleted = await storage.deleteInventoryItem(req.params.id);
			if (!deleted) {
				return res.status(404).json({ error: "Item not found" });
			}
			res.status(204).send();
		} catch (error) {
			res.status(500).json({ error: "Failed to delete inventory item" });
		}
	});

	app.patch("/api/inventory/:id/adjust", async (req, res) => {
		try {
			const validatedData = adjustStockSchema.parse({
				...req.body,
				id: req.params.id,
			});
			const item = await storage.adjustStock(validatedData.id, validatedData.adjustment);
			if (!item) {
				return res.status(404).json({ error: "Item not found" });
			}
			res.json(item);
		} catch (error) {
			if (error instanceof Error && error.name === "ZodError") {
				return res.status(400).json({ error: "Invalid data", details: error });
			}
			res.status(500).json({ error: "Failed to adjust stock" });
		}
	});

	const httpServer = createServer(app);
	return httpServer;
}
