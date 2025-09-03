import { type Category, type InsertCategory, type Task, type InsertTask, type UpdateTask, type UserStats, type InsertUserStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Categories
  getCategories(userId: string): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  // Tasks
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: UpdateTask): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  reorderTasks(taskIds: string[]): Promise<void>;

  // User Stats
  getUserStats(userId: string): Promise<UserStats | undefined>;
  updateUserStats(userId: string, stats: Partial<InsertUserStats>): Promise<UserStats>;
}

export class MemStorage implements IStorage {
  private categories: Map<string, Category> = new Map();
  private tasks: Map<string, Task> = new Map();
  private userStats: Map<string, UserStats> = new Map();

  constructor() {
    // Initialize default categories for demo user
    const defaultUserId = "demo-user";
    this.initializeDefaultData(defaultUserId);
  }

  private initializeDefaultData(userId: string) {
    // Default categories
    const workCategory: Category = {
      id: randomUUID(),
      name: "Work",
      color: "blue",
      userId,
    };
    const personalCategory: Category = {
      id: randomUUID(),
      name: "Personal", 
      color: "green",
      userId,
    };
    const learningCategory: Category = {
      id: randomUUID(),
      name: "Learning",
      color: "purple",
      userId,
    };

    this.categories.set(workCategory.id, workCategory);
    this.categories.set(personalCategory.id, personalCategory);
    this.categories.set(learningCategory.id, learningCategory);

    // Default user stats
    const stats: UserStats = {
      id: randomUUID(),
      userId,
      currentStreak: 12,
      totalTasks: 0,
      completedTasks: 0,
      weeklyProgress: {
        Monday: 100,
        Tuesday: 80,
        Wednesday: 70,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
      },
      lastActiveDate: new Date(),
    };
    this.userStats.set(userId, stats);
  }

  async getCategories(userId: string): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(c => c.userId === userId);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async deleteCategory(id: string): Promise<void> {
    this.categories.delete(id);
  }

  async getTasks(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(t => t.userId === userId)
      .sort((a, b) => a.position - b.position);
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = randomUUID();
    const now = new Date();
    const newTask: Task = {
      ...task,
      id,
      description: task.description || null,
      completed: task.completed || false,
      priority: task.priority || "medium",
      categoryId: task.categoryId || null,
      progress: task.progress || 0,
      dueTime: task.dueTime || null,
      position: task.position || 0,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(id, newTask);

    // Update user stats
    await this.updateTaskStats(task.userId);
    
    return newTask;
  }

  async updateTask(id: string, updates: UpdateTask): Promise<Task> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) {
      throw new Error("Task not found");
    }

    const updatedTask: Task = {
      ...existingTask,
      ...updates,
      updatedAt: new Date(),
    };
    this.tasks.set(id, updatedTask);

    // Update user stats if completion status changed
    if (updates.completed !== undefined) {
      await this.updateTaskStats(existingTask.userId);
    }

    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    const task = this.tasks.get(id);
    if (task) {
      this.tasks.delete(id);
      await this.updateTaskStats(task.userId);
    }
  }

  async reorderTasks(taskIds: string[]): Promise<void> {
    taskIds.forEach((taskId, index) => {
      const task = this.tasks.get(taskId);
      if (task) {
        task.position = index;
        this.tasks.set(taskId, task);
      }
    });
  }

  async getUserStats(userId: string): Promise<UserStats | undefined> {
    return this.userStats.get(userId);
  }

  async updateUserStats(userId: string, stats: Partial<InsertUserStats>): Promise<UserStats> {
    const existing = this.userStats.get(userId) || {
      id: randomUUID(),
      userId,
      currentStreak: 0,
      totalTasks: 0,
      completedTasks: 0,
      weeklyProgress: {},
      lastActiveDate: null,
    };

    const updated: UserStats = { ...existing, ...stats };
    this.userStats.set(userId, updated);
    return updated;
  }

  private async updateTaskStats(userId: string): Promise<void> {
    const userTasks = await this.getTasks(userId);
    const totalTasks = userTasks.length;
    const completedTasks = userTasks.filter(t => t.completed).length;

    await this.updateUserStats(userId, {
      totalTasks,
      completedTasks,
      lastActiveDate: new Date(),
    });
  }
}

export const storage = new MemStorage();
