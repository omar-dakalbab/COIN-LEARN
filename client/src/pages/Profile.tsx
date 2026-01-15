import { useAuth } from "@/hooks/use-auth";
import { useProgress } from "@/hooks/use-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Star, Calendar } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { data: progress } = useProgress();

  const completedCount = progress?.filter(p => p.completed).length || 0;
  const totalXP = completedCount * 100;

  const achievements = [
    { title: "First Steps", description: "Complete your first lesson", icon: Star, unlocked: completedCount > 0 },
    { title: "Quick Learner", description: "Complete 5 lessons", icon: Trophy, unlocked: completedCount >= 5 },
    { title: "Quiz Master", description: "Score 100% on a quiz", icon: Medal, unlocked: true }, // Mocked
  ];

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl space-y-8">
      {/* Profile Header */}
      <Card className="border-none shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Star className="w-48 h-48 rotate-12" />
        </div>
        <CardContent className="flex flex-col md:flex-row items-center gap-8 p-12 relative z-10">
          <Avatar className="w-32 h-32 border-4 border-white/20 shadow-xl">
            <AvatarImage src={user?.profileImageUrl} />
            <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
              {user?.firstName?.[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-display font-bold">{user?.firstName} {user?.lastName}</h1>
              <p className="text-white/60">Financial Scholar</p>
            </div>
            
            <div className="flex gap-3 justify-center md:justify-start">
              <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 border-transparent text-white gap-2 py-1.5 px-3">
                <Trophy className="w-3 h-3 text-accent" />
                Level 5
              </Badge>
              <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 border-transparent text-white gap-2 py-1.5 px-3">
                <Calendar className="w-3 h-3 text-blue-400" />
                Joined 2024
              </Badge>
            </div>
          </div>
          
          <div className="md:ml-auto flex gap-8 text-center">
            <div>
              <div className="text-3xl font-bold font-display">{totalXP}</div>
              <div className="text-xs text-white/50 uppercase tracking-wider font-semibold">Total XP</div>
            </div>
            <div>
              <div className="text-3xl font-bold font-display">{completedCount}</div>
              <div className="text-xs text-white/50 uppercase tracking-wider font-semibold">Lessons</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="achievements" className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement, idx) => (
              <Card key={idx} className={achievement.unlocked ? "border-primary/50 bg-primary/5" : "opacity-60 grayscale"}>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className={`p-2 rounded-lg ${achievement.unlocked ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <achievement.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progress?.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="font-medium">Completed a lesson</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(p.completedAt || "").toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {(!progress || progress.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">No activity yet. Start learning!</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
