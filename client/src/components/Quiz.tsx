import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Quiz as QuizType } from "@shared/schema";
import { cn } from "@/lib/utils";

interface QuizProps {
  quiz: QuizType;
  onComplete: (isCorrect: boolean) => void;
}

export function Quiz({ quiz, onComplete }: QuizProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  
  // Parse options safely from JSONB
  const options = Array.isArray(quiz.options) 
    ? quiz.options.map(String) 
    : [];

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);
    const isCorrect = selectedOption === quiz.correctAnswer;
    onComplete(isCorrect);
  };

  const isCorrect = selectedOption === quiz.correctAnswer;

  return (
    <Card className="border-2 mt-8 overflow-hidden">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          Quiz Time!
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <h3 className="text-xl font-display font-semibold text-foreground">
          {quiz.question}
        </h3>

        <RadioGroup 
          onValueChange={(val) => !submitted && setSelectedOption(parseInt(val))}
          className="space-y-3"
          value={selectedOption?.toString()}
          disabled={submitted}
        >
          {options.map((option, index) => {
            let itemStateStyles = "border-border hover:bg-muted/50 hover:border-primary/50";
            
            if (submitted) {
              if (index === quiz.correctAnswer) {
                itemStateStyles = "border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300";
              } else if (selectedOption === index && index !== quiz.correctAnswer) {
                itemStateStyles = "border-destructive bg-destructive/5 text-destructive";
              } else {
                itemStateStyles = "opacity-50 grayscale";
              }
            } else if (selectedOption === index) {
              itemStateStyles = "border-primary bg-primary/5 ring-1 ring-primary";
            }

            return (
              <Label
                key={index}
                htmlFor={`option-${index}`}
                className={cn(
                  "flex items-center space-x-3 space-y-0 rounded-lg border p-4 cursor-pointer transition-all duration-200",
                  itemStateStyles
                )}
              >
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <span className="flex-1 font-medium">{option}</span>
                {submitted && index === quiz.correctAnswer && (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
                {submitted && selectedOption === index && index !== quiz.correctAnswer && (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </Label>
            );
          })}
        </RadioGroup>

        <AnimatePresence>
          {!submitted && selectedOption !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <Button onClick={handleSubmit} className="w-full" size="lg">
                Submit Answer
              </Button>
            </motion.div>
          )}

          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "p-4 rounded-lg flex items-start gap-3",
                isCorrect 
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              {isCorrect ? (
                <div>
                  <p className="font-bold">Correct!</p>
                  <p className="text-sm">Great job! You earned some XP.</p>
                </div>
              ) : (
                <div>
                  <p className="font-bold">Incorrect</p>
                  <p className="text-sm">Review the lesson material and try again.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
