import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertTaskSchema, updateTaskSchema, insertCategorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const userId = "demo-user"; // In a real app, this would come from authentication

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories(userId);
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const category = insertCategorySchema.parse({ ...req.body, userId });
      const newCategory = await storage.createCategory(category);
      res.status(201).json(newCategory);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      await storage.deleteCategory(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Tasks
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const task = insertTaskSchema.parse({ ...req.body, userId });
      const newTask = await storage.createTask(task);
      res.status(201).json(newTask);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const updates = updateTaskSchema.parse(req.body);
      const updatedTask = await storage.updateTask(req.params.id, updates);
      res.json(updatedTask);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      await storage.deleteTask(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/tasks/reorder", async (req, res) => {
    try {
      const { taskIds } = z.object({ taskIds: z.array(z.string()) }).parse(req.body);
      await storage.reorderTasks(taskIds);
      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // User Stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Smart suggestions
  app.get("/api/suggestions", async (req, res) => {
    try {
      const suggestions = [
        { id: "1", text: "Review weekly goals", icon: "lightbulb" },
        { id: "2", text: "Take a break", icon: "coffee" },
        { id: "3", text: "Read documentation", icon: "book-open" },
        { id: "4", text: "Update project status", icon: "clipboard" },
        { id: "5", text: "Plan tomorrow", icon: "calendar" },
      ];
      res.json(suggestions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
