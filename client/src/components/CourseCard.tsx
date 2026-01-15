import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Trophy } from "lucide-react";
import { Link } from "wouter";
import type { Course } from "@shared/schema";

interface CourseCardProps {
  course: Course;
  progressPercent: number;
}

export function CourseCard({ course, progressPercent }: CourseCardProps) {
  const isCompleted = progressPercent === 100;

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 group">
      <div className="relative h-48 overflow-hidden bg-muted">
        {/* Descriptive alt for stock image */}
        {/* abstract 3d finance illustration money growth */}
        <img 
          src={course.imageUrl} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <Badge variant={isCompleted ? "default" : "secondary"} className="shadow-sm backdrop-blur-md bg-white/90 text-foreground">
            {course.difficulty}
          </Badge>
        </div>
      </div>

      <CardHeader className="flex-none pb-2">
        <CardTitle className="font-display text-xl group-hover:text-primary transition-colors">
          {course.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm line-clamp-2">
          {course.description}
        </p>
      </CardContent>

      <CardFooter className="flex-none flex flex-col gap-4 bg-muted/30 pt-4">
        <div className="w-full space-y-2">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
        
        <Link href={`/course/${course.id}`} className="w-full">
          <Button className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            {isCompleted ? (
              <>
                <Trophy className="w-4 h-4" />
                Review Course
              </>
            ) : progressPercent > 0 ? (
              <>
                Continue Learning
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Start Course
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
