import ReactMarkdown from "react-markdown";

interface LessonContentProps {
  content: string;
}

export function LessonContent({ content }: LessonContentProps) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-muted-foreground prose-a:text-primary prose-img:rounded-xl">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
