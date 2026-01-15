import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, ShieldCheck, PiggyBank, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  const features = [
    {
      icon: PiggyBank,
      title: "Smart Budgeting",
      description: "Learn how to manage your cash flow and build a safety net for the future."
    },
    {
      icon: TrendingUp,
      title: "Strategic Investing",
      description: "Understand stocks, bonds, and compound interest to grow your wealth."
    },
    {
      icon: ShieldCheck,
      title: "Debt Management",
      description: "Master strategies to pay off debt and maintain a healthy credit score."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-xl text-primary">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-2xl font-display font-bold">FinLit</span>
        </div>
        <Link href="/login">
          <Button variant="outline" className="font-semibold">Log In</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-display font-bold leading-[1.1]"
          >
            Master your money, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
              master your life.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-lg"
          >
            Financial freedom starts with financial literacy. Join thousands of learners mastering their finances one lesson at a time.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/login">
              <Button size="lg" className="h-14 px-8 text-lg rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1">
                Start Learning Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="lg" className="h-14 px-8 text-lg rounded-2xl">
              View Curriculum
            </Button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-3xl opacity-50" />
          {/* Descriptive alt for Unsplash image */}
          {/* 3d illustration of coins and growth chart financial success */}
          <img 
            src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=80" 
            alt="Financial Growth" 
            className="relative rounded-[2.5rem] shadow-2xl border-8 border-white dark:border-slate-800 rotate-2 hover:rotate-0 transition-transform duration-500"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-muted-foreground text-lg">Our structured curriculum takes you from beginner to expert with bite-sized, interactive lessons.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card p-8 rounded-3xl border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-display mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>© 2024 FinLit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
