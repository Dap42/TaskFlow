"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { logout } from "@/store/authSlice";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Sparkles,
  Moon,
  Sun,
  LogOut,
  LayoutDashboard,
  Columns,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { CommandPalette } from "@/components/CommandPalette";
import { useState } from "react";
import CreateTaskDialog from "@/components/dashboard/CreateTaskDialog";
import { addTask } from "@/store/tasksSlice";
import { toast } from "sonner";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "work",
    priority: "medium",
    deadline: "",
    status: "pending",
  });

  // Don't show navbar on landing page if not authenticated
  if (pathname === "/" && !isAuthenticated) return null;

  // If on landing page but authenticated, we might want to show it or redirect.
  // Usually landing page has its own header.
  // Let's assume we only show this global navbar on app pages.
  const isAppPage =
    pathname === "/dashboard" ||
    pathname === "/kanban" ||
    pathname === "/calendar" ||
    pathname === "/ai-summary" ||
    pathname.startsWith("/tasks/");

  if (!isAppPage && pathname === "/") return null;

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(addTask(data));
        toast.success("Task created successfully");
        setNewTask({
          title: "",
          description: "",
          category: "work",
          priority: "medium",
          deadline: "",
          status: "pending",
        });
        setIsDialogOpen(false);
        // If we are on dashboard, the list updates automatically via Redux.
        // If we are on other pages, it might not matter as much, or we might want to redirect.
      }
    } catch (error) {
      console.error("Failed to create task");
      toast.error("Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="flex items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
              </Link>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-4">
                <Link href="/dashboard">
                  <Button
                    variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/kanban">
                  <Button
                    variant={pathname === "/kanban" ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Columns className="w-4 h-4" />
                    Kanban
                  </Button>
                </Link>
                <Link href="/calendar">
                  <Button
                    variant={pathname === "/calendar" ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Calendar
                  </Button>
                </Link>
                <Link href="/ai-summary">
                  <Button
                    variant={pathname === "/ai-summary" ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Summary
                  </Button>
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-2 hidden sm:flex min-w-[260px] justify-between"
                onClick={() =>
                  document.dispatchEvent(
                    new KeyboardEvent("keydown", { key: "k", metaKey: true })
                  )
                }
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Quick Actions</span>
                </div>
                <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                  Ctrl + K
                </kbd>
              </Button>

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
              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CommandPalette onCreateTask={() => setIsDialogOpen(true)} />

      <CreateTaskDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateTask={handleCreateTask}
        newTask={newTask}
        setNewTask={setNewTask}
        isLoading={isCreating}
      />
    </>
  );
}
