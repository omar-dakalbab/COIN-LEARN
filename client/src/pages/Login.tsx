import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Shield, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";

export default function Login() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      setLocation("/dashboard");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) return null;

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const features = [
    {
      icon: Zap,
      title: "Interactive Lessons",
      description: "Learn at your own pace with engaging content"
    },
    {
      icon: Shield,
      title: "Track Progress",
      description: "Monitor your learning journey and achievements"
    },
    {
      icon: Users,
      title: "Expert Content",
      description: "Learn from financial experts and educators"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-xl text-primary">
              <BookOpen className="w-8 h-8" />
            </div>
            <span className="text-3xl font-display font-bold">FinLit</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">FinLit</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Start your journey to financial freedom. Learn budgeting, investing, and money management skills that will last a lifetime.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="bg-primary/10 p-2 rounded-lg text-primary shrink-0">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Login Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-display">Get Started</CardTitle>
              <CardDescription>
                Sign in with your Replit account to begin learning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                onClick={handleLogin}
                size="lg"
                className="w-full h-12 text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                Continue with Replit
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Secure Authentication
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Your data is secure and private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>Free to use, no credit card required</span>
                </div>
              </div>

              <div className="pt-4 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/api/login" className="text-primary hover:underline font-medium">
                    Sign up for free
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
