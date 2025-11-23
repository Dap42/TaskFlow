"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { Task } from "@/types";

interface AIInsight {
  type: "success" | "warning" | "info";
  title: string;
  description: string;
}

interface AIStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  highPriority: number;
  completionRate: number;
}

interface AISummaryData {
  stats: AIStats;
  insights: AIInsight[];
  actionItems: string[];
  topTasks: Task[];
}

export default function AISummary() {
  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  const [summary, setSummary] = useState<AISummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ai/summary`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch AI summary");
        }

        const data = await res.json();
        setSummary(data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSummary();
    }
  }, [isAuthenticated, router, token]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case "info":
        return <TrendingUp className="w-6 h-6 text-blue-500" />;
      default:
        return <Brain className="w-6 h-6 text-purple-500" />;
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Sparkles className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <div className="text-lg">Generating AI insights...</div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
          <div className="text-center text-red-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
            <div className="text-lg">{error}</div>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!summary) return null;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <div className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold">AI Weekly Summary</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Hero Card */}
          <Card className="mb-8 border-2 border-primary bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">
                    Your Productivity Insights
                  </h2>
                  <p className="text-muted-foreground">
                    AI-powered analysis of your task management
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-blue-600">
                    {summary.stats.total}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Tasks
                  </div>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-green-600">
                    {summary.stats.completed}
                  </div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-gray-600">
                    {summary.stats.pending}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-red-600">
                    {summary.stats.overdue}
                  </div>
                  <div className="text-sm text-muted-foreground">Overdue</div>
                </div>
                <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-purple-600">
                    {summary.stats.completionRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Completion
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Key Insights
              </h3>
              <div className="space-y-4">
                {summary.insights.map((insight, index) => (
                  <Card key={index} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">
                            {insight.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Recommended Actions
              </h3>
              <Card className="border-2 h-fit">
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    {summary.actionItems.map((action, index) => (
                      <li key={index} className="flex gap-3 items-start">
                        <div className="mt-1.5">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                        <span className="text-sm leading-relaxed">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Top Priority Tasks */}
          {summary.topTasks.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Top Priority Tasks
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {summary.topTasks.map((task) => (
                  <Link key={task.id} href={`/tasks/${task.id}`}>
                    <Card className="border-2 hover:border-primary transition-colors cursor-pointer h-full hover:shadow-md">
                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-1">
                          {task.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {task.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mt-auto">
                          <Badge className="bg-red-500 text-white hover:bg-red-600">
                            High Priority
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono">
                            {task.deadline
                              ? new Date(task.deadline).toLocaleDateString()
                              : "No Deadline"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
