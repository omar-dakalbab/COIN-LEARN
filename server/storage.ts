import { db } from "./db";
import {
  courses, modules, lessons, quizzes, userProgress,
  type Course, type Module, type Lesson, type Quiz, type UserProgress,
  type CourseWithModules, type LessonWithQuiz
} from "@shared/schema";
import { eq, and, asc } from "drizzle-orm";

export interface IStorage {
  // Courses
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<CourseWithModules | undefined>;
  
  // Lessons
  getLesson(id: number): Promise<LessonWithQuiz | undefined>;
  
  // Progress
  getUserProgress(userId: string): Promise<UserProgress[]>;
  updateUserProgress(userId: string, lessonId: number, score?: number): Promise<UserProgress>;
  
  // Seed helpers
  createCourse(course: typeof courses.$inferInsert): Promise<Course>;
  createModule(module: typeof modules.$inferInsert): Promise<Module>;
  createLesson(lesson: typeof lessons.$inferInsert): Promise<Lesson>;
  createQuiz(quiz: typeof quizzes.$inferInsert): Promise<Quiz>;
}

export class DatabaseStorage implements IStorage {
  // Courses
  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses).orderBy(asc(courses.order));
  }

  async getCourse(id: number): Promise<CourseWithModules | undefined> {
    const course = await db.query.courses.findFirst({
      where: eq(courses.id, id),
      with: {
        modules: {
          orderBy: asc(modules.order),
          with: {
            lessons: {
              orderBy: asc(lessons.order),
            },
          },
        },
      },
    });
    return course;
  }

  // Lessons
  async getLesson(id: number): Promise<LessonWithQuiz | undefined> {
    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, id),
      with: {
        quizzes: true,
      },
    });
    return lesson;
  }

  // Progress
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async updateUserProgress(userId: string, lessonId: number, score?: number): Promise<UserProgress> {
    const [progress] = await db
      .insert(userProgress)
      .values({
        userId,
        lessonId,
        completed: true,
        score,
        completedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.lessonId],
        set: {
          completed: true,
          score,
          completedAt: new Date(),
        },
      })
      .returning();
    return progress;
  }

  // Seed helpers
  async createCourse(course: typeof courses.$inferInsert): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async createModule(module: typeof modules.$inferInsert): Promise<Module> {
    const [newModule] = await db.insert(modules).values(module).returning();
    return newModule;
  }

  async createLesson(lesson: typeof lessons.$inferInsert): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
    return newLesson;
  }

  async createQuiz(quiz: typeof quizzes.$inferInsert): Promise<Quiz> {
    const [newQuiz] = await db.insert(quizzes).values(quiz).returning();
    return newQuiz;
  }
}

export const storage = new DatabaseStorage();
