import { useRoute, Link } from "wouter";
import { useCourse } from "@/hooks/use-courses";
import { useProgress } from "@/hooks/use-progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle, Lock, ArrowLeft, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function CourseDetail() {
  const [match, params] = useRoute("/course/:id");
  const id = parseInt(params?.id || "0");
  const { data: course, isLoading: courseLoading } = useCourse(id);
  const { data: progress } = useProgress();

  if (courseLoading) {
    return (
      <div className="container mx-auto px-6 py-8 space-y-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!course) return <div className="p-8">Course not found</div>;

  const isLessonCompleted = (lessonId: number) => {
    return progress?.some(p => p.lessonId === lessonId && p.completed);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-6 py-12">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                {course.difficulty} Level
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground">
                {course.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                {course.description}
              </p>
            </div>
            {/* Descriptive alt for Unsplash image */}
            {/* 3d abstract shapes learning growth education */}
            <img 
              src={course.imageUrl} 
              alt={course.title} 
              className="w-full md:w-80 h-48 object-cover rounded-2xl shadow-lg border-4 border-white dark:border-card"
            />
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-8">
          {course.modules.sort((a, b) => a.order - b.order).map((module, mIdx) => (
            <motion.div 
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mIdx * 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-end gap-4 mb-2">
                <h2 className="text-2xl font-display font-bold">
                  <span className="text-muted-foreground/50 mr-3">0{mIdx + 1}</span>
                  {module.title}
                </h2>
              </div>
              
              <div className="grid gap-4">
                {module.lessons.sort((a, b) => a.order - b.order).map((lesson, lIdx) => {
                  const completed = isLessonCompleted(lesson.id);
                  // Lock logic: Simple version - lock if previous lesson in this module isn't done
                  // For MVP, let's keep it open or just visual
                  
                  return (
                    <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                      <Card className={cn(
                        "transition-all duration-200 hover:shadow-md cursor-pointer border-l-4",
                        completed ? "border-l-primary bg-primary/5" : "border-l-transparent hover:border-l-muted-foreground/30"
                      )}>
                        <CardContent className="flex items-center justify-between p-6">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                              completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}>
                              {completed ? <CheckCircle2 className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                            </div>
                            <div>
                              <h3 className={cn("font-bold text-lg", completed && "text-primary")}>
                                {lesson.title}
                              </h3>
                              <p className="text-sm text-muted-foreground capitalize">
                                {lesson.type} • 5 min
                              </p>
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <ArrowRight className="w-5 h-5" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
