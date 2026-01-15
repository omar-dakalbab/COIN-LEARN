import { z } from 'zod';
import { insertCourseSchema, insertModuleSchema, insertLessonSchema, insertUserProgressSchema, courses, modules, lessons, userProgress } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  courses: {
    list: {
      method: 'GET' as const,
      path: '/api/courses',
      responses: {
        200: z.array(z.custom<typeof courses.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/courses/:id',
      responses: {
        200: z.custom<typeof courses.$inferSelect & { modules: (typeof modules.$inferSelect & { lessons: typeof lessons.$inferSelect[] })[] }>(),
        404: errorSchemas.notFound,
      },
    },
  },
  lessons: {
    get: {
      method: 'GET' as const,
      path: '/api/lessons/:id',
      responses: {
        200: z.custom<typeof lessons.$inferSelect & { quizzes: typeof import('./schema').quizzes.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
    complete: {
      method: 'POST' as const,
      path: '/api/lessons/:id/complete',
      input: z.object({
        score: z.number().optional(),
      }),
      responses: {
        200: z.custom<typeof userProgress.$inferSelect>(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  progress: {
    list: {
      method: 'GET' as const,
      path: '/api/progress',
      responses: {
        200: z.array(z.custom<typeof userProgress.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type CourseResponse = z.infer<typeof api.courses.list.responses[200]>[number];
export type CourseDetailResponse = z.infer<typeof api.courses.get.responses[200]>;
export type LessonDetailResponse = z.infer<typeof api.lessons.get.responses[200]>;
export type CompleteLessonInput = z.infer<typeof api.lessons.complete.input>;
export type ProgressResponse = z.infer<typeof api.progress.list.responses[200]>[number];
