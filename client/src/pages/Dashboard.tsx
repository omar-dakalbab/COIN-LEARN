import { useAuth } from "@/hooks/use-auth";
import { useCourses, useCourse } from "@/hooks/use-courses";
import { useProgress } from "@/hooks/use-progress";
import { CourseCard } from "@/components/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Flame, Target } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import type { Course } from "@shared/schema";
import type { ProgressResponse } from "@shared/routes";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: progress, isLoading: progressLoading } = useProgress();

  if (coursesLoading || progressLoading) {
    return (
      <div className="container mx-auto px-6 py-8 space-y-8">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-96 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  // Calculate stats mock
  const completedLessons = progress?.filter(p => p.completed).length || 0;
  const currentStreak = 3; // Mocked for now
  
  return (
    <div className="container mx-auto px-6 py-8 space-y-12">
      {/* Welcome & Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary to-emerald-600 rounded-3xl p-8 md:p-12 text-white shadow-xl shadow-primary/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Trophy className="w-64 h-64 rotate-12" />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Welcome back, {user?.firstName || 'Learner'}!
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-xl mb-8">
            You're on a roll. Keep up the momentum to reach your financial goals.
          </p>
          
          <div className="flex flex-wrap gap-4 md:gap-8">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              <div className="bg-accent p-2 rounded-lg text-white">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium uppercase tracking-wider">Level 5</p>
                <p className="text-xl font-bold">{completedLessons * 100} XP</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              <div className="bg-orange-500 p-2 rounded-lg text-white">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium uppercase tracking-wider">Streak</p>
                <p className="text-xl font-bold">{currentStreak} Days</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              <div className="bg-blue-500 p-2 rounded-lg text-white">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium uppercase tracking-wider">Lessons</p>
                <p className="text-xl font-bold">{completedLessons} Done</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Courses Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-foreground">Your Learning Path</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.sort((a, b) => a.order - b.order).map((course, idx) => {
            return (
              <CourseProgressCard key={course.id} course={course} progress={progress} idx={idx} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CourseProgressCard({ 
  course, 
  progress, 
  idx 
}: { 
  course: Course; 
  progress: ProgressResponse[] | undefined; 
  idx: number;
}) {
  const { data: courseDetails } = useCourse(course.id);
  
  // Calculate progress percentage
  let progressPercent = 0;
  if (courseDetails && progress) {
    const allLessonIds = courseDetails.modules.flatMap(module => 
      module.lessons.map(lesson => lesson.id)
    );
    const completedLessonIds = new Set(
      progress.filter(p => p.completed).map(p => p.lessonId)
    );
    const completedCount = allLessonIds.filter(id => completedLessonIds.has(id)).length;
    progressPercent = allLessonIds.length > 0 
      ? (completedCount / allLessonIds.length) * 100 
      : 0;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
    >
      <CourseCard 
        course={course} 
        progressPercent={progressPercent} 
      />
    </motion.div>
  );
}
