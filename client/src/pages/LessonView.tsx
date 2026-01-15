import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useLesson, useCompleteLesson } from "@/hooks/use-lessons";
import { LessonContent } from "@/components/LessonContent";
import { Quiz } from "@/components/Quiz";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function LessonView() {
  const [match, params] = useRoute("/lesson/:id");
  const [, setLocation] = useLocation();
  const id = parseInt(params?.id || "0");
  
  const { data: lesson, isLoading } = useLesson(id);
  const completeMutation = useCompleteLesson();
  const { width, height } = useWindowSize();
  const { toast } = useToast();

  const [completed, setCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // If type is reading, quizPassed is true by default
  useEffect(() => {
    if (lesson && lesson.type === 'reading') {
      setQuizPassed(true);
    } else {
      setQuizPassed(false);
    }
  }, [lesson]);

  const handleComplete = async () => {
    if (!quizPassed) {
      toast({
        title: "Quiz Required",
        description: "Please complete the quiz correctly to finish this lesson.",
        variant: "destructive"
      });
      return;
    }

    try {
      await completeMutation.mutateAsync({ id, score: 100 });
      setCompleted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5s
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lesson) return <div>Lesson not found</div>;

  return (
    <div className="min-h-screen bg-background">
      {showConfetti && <ReactConfetti width={width} height={height} numberOfPieces={500} recycle={false} />}

      {/* Progress Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 max-w-md">
            <div className="flex justify-between text-xs mb-1 text-muted-foreground">
              <span>{lesson.title}</span>
              <span>{completed ? "100%" : "In Progress"}</span>
            </div>
            <Progress value={completed ? 100 : 40} className="h-1.5" />
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-24 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="space-y-2">
            <span className="text-sm font-bold text-primary tracking-wider uppercase">
              {lesson.type} Lesson
            </span>
            <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight">
              {lesson.title}
            </h1>
          </div>

          <LessonContent content={lesson.content} />

          {lesson.type === 'quiz' && lesson.quizzes && lesson.quizzes.length > 0 && (
            <Quiz 
              quiz={lesson.quizzes[0]} 
              onComplete={(isCorrect) => {
                if (isCorrect) setQuizPassed(true);
              }} 
            />
          )}

          <div className="pt-12 pb-8 border-t flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {completed ? "Lesson Completed!" : "Read through to finish"}
            </div>
            
            {completed ? (
              <Button size="lg" onClick={() => setLocation('/dashboard')} className="gap-2">
                Back to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={handleComplete} 
                disabled={!quizPassed || completeMutation.isPending}
                className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                {completeMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Complete Lesson
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
