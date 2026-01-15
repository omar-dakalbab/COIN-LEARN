import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BookOpen, 
  User, 
  LogOut, 
  Menu,
  Coins
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "Profile", icon: User },
  ];

  if (!isAuthenticated) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-1.5 text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="hidden font-display text-xl font-bold sm:inline-block">
              FinLit
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                location === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <div className="h-6 w-px bg-border mx-2" />
          <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full border border-accent/20">
            <Coins className="h-4 w-4 text-accent" />
            <span className="text-sm font-bold text-accent-foreground/80">XP: 1250</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => logout()} className="text-muted-foreground hover:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>

        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80%] max-w-[300px] sm:w-[340px]">
            <div className="flex flex-col gap-8 py-4">
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <div className="rounded-lg bg-primary p-1.5 text-primary-foreground">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="font-display text-lg font-bold">
                  FinLit
                </span>
              </Link>
              
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      location === item.href 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto">
                <div className="flex items-center gap-3 px-3 py-4 mb-4 bg-muted rounded-xl">
                  {user?.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt="User" className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {user?.firstName?.[0] || 'U'}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{user?.firstName} {user?.lastName}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">{user?.email}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full justify-start text-muted-foreground" onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
