import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

// Pages
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import CourseDetail from "@/pages/CourseDetail";
import LessonView from "@/pages/LessonView";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to landing if not logged in
      setLocation("/");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return <Component />;
}

function Router() {
  const { user, isLoading } = useAuth();

  // Show nothing while checking auth state to prevent flash of landing page
  if (isLoading) return null;

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navigation />
      <main className="flex-1">
        <Switch>
          <Route path="/">
            {user ? <Dashboard /> : <Landing />}
          </Route>
          
          <Route path="/login">
            <Login />
          </Route>
          
          <Route path="/dashboard">
            <ProtectedRoute component={Dashboard} />
          </Route>
          
          <Route path="/course/:id">
            <ProtectedRoute component={CourseDetail} />
          </Route>
          
          <Route path="/lesson/:id">
            <ProtectedRoute component={LessonView} />
          </Route>
          
          <Route path="/profile">
            <ProtectedRoute component={Profile} />
          </Route>
          
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
