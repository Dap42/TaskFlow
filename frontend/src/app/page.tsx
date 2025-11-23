"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useAnimation,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Sparkles,
  Target,
  Users,
  Moon,
  Sun,
  Star,
  TrendingUp,
  Shield,
  Rocket,
  ArrowRight,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useDispatch } from "react-redux";
import { login } from "@/store/authSlice";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login Logic
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              username: formData.email,
              password: formData.password,
            }),
          }
        );

        if (!res.ok) throw new Error("Login failed");

        const data = await res.json();
        dispatch(
          login({ token: data.access_token, user: { email: formData.email } })
        );
        router.push("/dashboard");
      } else {
        // Signup Logic
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              full_name: formData.name,
            }),
          }
        );

        if (!res.ok) throw new Error("Signup failed");

        // Auto login after signup or switch to login tab
        setIsLogin(true);
        alert("Account created! Please log in.");
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const stats = [
    { value: "50K+", label: "Active Users", icon: Users },
    { value: "2M+", label: "Tasks Completed", icon: CheckCircle2 },
    { value: "99.9%", label: "Uptime", icon: Rocket },
    { value: "4.9/5", label: "User Rating", icon: Star },
  ];

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Insights",
      description:
        "Get intelligent weekly summaries and productivity recommendations powered by advanced AI",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Target,
      title: "Smart Prioritization",
      description:
        "Automatically organize tasks by priority, deadline, and category for maximum efficiency",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description:
        "Track your productivity with beautiful dashboards and insightful statistics",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your data is encrypted and protected with enterprise-grade security",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-black dark:via-black dark:to-gray-950 overflow-x-hidden">
      {/* Subtle Background Gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-pink-400/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 border-b bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer">
              <CheckCircle2 className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() =>
                    document
                      .getElementById("auth-section")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <motion.div
          style={{ y, opacity }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              The Future of Task Management
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-6xl md:text-8xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Organize
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                Your World
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
            >
              Experience task management reimagined with AI-powered insights,
              <br className="hidden md:block" />
              stunning design, and unparalleled productivity.
            </motion.p>
          </motion.div>

          {/* Dashboard Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative max-w-5xl mx-auto mt-20"
          >
            <Card className="shadow-2xl border-2 overflow-hidden backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
              <div className="h-64 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="text-white/80 text-sm mb-2">
                      {/* Dashboard Preview */}
                    </div>
                    <div className="text-white text-3xl font-bold">
                      {/* Your Tasks */}
                    </div>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                  >
                    <div className="text-white/70 text-xs mb-1">Total</div>
                    <div className="text-white text-2xl font-bold">24</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                  >
                    <div className="text-white/70 text-xs mb-1">Active</div>
                    <div className="text-white text-2xl font-bold">12</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 }}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                  >
                    <div className="text-white/70 text-xs mb-1">Done</div>
                    <div className="text-white text-2xl font-bold">12</div>
                  </motion.div>
                </div>
              </div>
            </Card>

            {/* Side Task Cards */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="absolute -left-4 top-1/4 w-48 hidden lg:block"
            >
              <Card className="shadow-xl border-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-sm">Completed</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Design Sprint Meeting
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="absolute -right-4 top-1/3 w-48 hidden lg:block"
            >
              <Card className="shadow-xl border-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold text-sm">High Priority</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Q4 Report Review
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        
      </section>

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16">
              <motion.div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                <Rocket className="w-4 h-4" />
                Powerful Features
              </motion.div>
              <h2 className="text-5xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text pb-4 text-transparent">
                Everything You Need
              </h2>
              <p className="text-xl mt-8 text-muted-foreground max-w-2xl mx-auto">
                Built for teams and individuals who demand excellence
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section id="auth-section" className="py-32 relative">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Start Your Journey
                </h2>
                <p className="text-muted-foreground">
                  Join thousands of users who are already maximizing their
                  productivity
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-2xl border-2">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center">
                      Welcome to TaskFlow
                    </CardTitle>
                    <CardDescription className="text-center">
                      Sign in to manage your tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs
                      value={isLogin ? "login" : "signup"}
                      onValueChange={(v) => setIsLogin(v === "login")}
                    >
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                      </TabsList>

                      <TabsContent value="login">
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                              type="email"
                              name="email"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Password
                            </label>
                            <Input
                              type="password"
                              name="password"
                              placeholder="••••••••"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Spinner size={20} className="mr-2" /> Logging
                                in...
                              </>
                            ) : (
                              "Log In"
                            )}
                          </Button>
                        </form>
                      </TabsContent>

                      <TabsContent value="signup">
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Full Name
                            </label>
                            <Input
                              type="text"
                              name="name"
                              placeholder="John Doe"
                              value={formData.name}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                              type="email"
                              name="email"
                              placeholder="john@example.com"
                              value={formData.email}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Password
                            </label>
                            <Input
                              type="password"
                              name="password"
                              placeholder="••••••••"
                              value={formData.password}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <Spinner size={20} className="mr-2" /> Signing
                                up...
                              </>
                            ) : (
                              "Create Account"
                            )}
                          </Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </motion.div>
          <p className="text-muted-foreground mb-4">
            Built for Madeline & Co. - The Future of Task Management
          </p>
          <p className="text-sm text-muted-foreground">
            © 2025 TaskFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Stats Section Component
function StatsSection({ stats }: { stats: any[] }) {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-2 text-center shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Feature Card Component
function FeatureCard({ feature, index }: { feature: any; index: number }) {
  return (
    <ScrollReveal delay={index * 0.15}>
      <Card className="border-2 shadow-lg hover:shadow-2xl transition-all h-full hover:scale-[1.02] hover:-translate-y-1">
        <CardContent className="p-8">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 transition-transform hover:scale-110`}
          >
            <feature.icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </CardContent>
      </Card>
    </ScrollReveal>
  );
}

// Scroll Reveal Component
function ScrollReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}
