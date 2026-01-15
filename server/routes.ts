import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth FIRST
  await setupAuth(app);
  registerAuthRoutes(app);

  // === API ROUTES ===

  // Courses
  app.get(api.courses.list.path, async (req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  });

  app.get(api.courses.get.path, async (req, res) => {
    const courseId = Number(req.params.id);
    if (isNaN(courseId)) {
       return res.status(404).json({ message: "Invalid course ID" });
    }
    const course = await storage.getCourse(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  });

  // Lessons
  app.get(api.lessons.get.path, async (req, res) => {
    const lessonId = Number(req.params.id);
     if (isNaN(lessonId)) {
       return res.status(404).json({ message: "Invalid lesson ID" });
    }
    const lesson = await storage.getLesson(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.json(lesson);
  });

  app.post(api.lessons.complete.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const lessonId = Number(req.params.id);
      const input = api.lessons.complete.input.parse(req.body);
      
      const userId = (req.user as any).claims.sub; // From Replit Auth
      const progress = await storage.updateUserProgress(userId, lessonId, input.score);
      
      res.json(progress);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Progress
  app.get(api.progress.list.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = (req.user as any).claims.sub;
    const progress = await storage.getUserProgress(userId);
    res.json(progress);
  });

  // Seed Database
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingCourses = await storage.getCourses();
  if (existingCourses.length > 0) return;

  console.log("Seeding database...");

  // Course 1: Budgeting 101
  const course1 = await storage.createCourse({
    title: "Budgeting 101",
    description: "Master the art of managing your money effectively.",
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f",
    difficulty: "Beginner",
    order: 1,
  });

  const module1 = await storage.createModule({
    courseId: course1.id,
    title: "Understanding Income & Expenses",
    description: "Learn to track what comes in and what goes out.",
    order: 1,
  });

  const lesson1 = await storage.createLesson({
    moduleId: module1.id,
    title: "What is a Budget?",
    content: `
# What is a Budget?

A budget is simply a plan for your money. It's not about restriction; it's about **freedom**.

## Why do you need one?
1. **Clarity**: Know exactly where your money goes.
2. **Control**: You decide how to spend, not your impulses.
3. **Goals**: Save for that vacation, car, or house.

## The 50/30/20 Rule
A popular way to budget is the 50/30/20 rule:
* **50% Needs**: Rent, groceries, bills.
* **30% Wants**: Dining out, hobbies, entertainment.
* **20% Savings/Debt**: Emergency fund, investments, paying off loans.
    `,
    type: "reading",
    order: 1,
  });

  const lesson2 = await storage.createLesson({
    moduleId: module1.id,
    title: "Budgeting Quiz",
    content: "Test your knowledge on budgeting basics.",
    type: "quiz",
    order: 2,
  });

  await storage.createQuiz({
    lessonId: lesson2.id,
    question: "What percentage of your income should go to 'Needs' according to the 50/30/20 rule?",
    options: ["20%", "30%", "50%", "100%"],
    correctAnswer: 2, // 50%
  });

  // Course 2: Investing Basics
  const course2 = await storage.createCourse({
    title: "Investing Basics",
    description: "Grow your wealth over time with smart investments.",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f",
    difficulty: "Intermediate",
    order: 2,
  });

  const module2 = await storage.createModule({
    courseId: course2.id,
    title: "Stocks & Bonds",
    description: "The building blocks of an investment portfolio.",
    order: 1,
  });
  
  await storage.createLesson({
    moduleId: module2.id,
    title: "What is a Stock?",
    content: `
# What is a Stock?

When you buy a stock, you are buying a small piece of ownership in a company.

## Why buy stocks?
Historically, the stock market has returned about **10% per year** on average. This helps your money grow faster than inflation.

## Risks
Stocks can go up and down in value. That's why it's important to diversify—don't put all your eggs in one basket!
    `,
    type: "reading",
    order: 1,
  });

  console.log("Database seeded successfully!");
}
