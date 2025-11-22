"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setTasks, addTask, updateTask, deleteTask } from "@/store/tasksSlice";
import { logout } from "@/store/authSlice";

import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import TaskCard from "@/components/TaskCard";
import CreateTaskDialog from "@/components/dashboard/CreateTaskDialog";
import EditTaskDialog from "@/components/dashboard/EditTaskDialog";
import TaskFilters from "@/components/dashboard/TaskFilters";
import DashboardStats from "@/components/dashboard/DashboardStats";
import AISummaryCard from "@/components/dashboard/AISummaryCard";
import { Onboarding } from "@/components/Onboarding";
import { useTaskFilters } from "@/hooks/useTaskFilters";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  deadline: string;
  status: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { items: tasks } = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch();

  const {
    filteredTasks,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
  } = useTaskFilters(tasks);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summary, setSummary] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "work",
    priority: "medium",
    deadline: "",
    status: "pending",
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Check if user has seen onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Fetch tasks
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    const fetchTasks = async () => {
      setIsLoadingTasks(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          dispatch(setTasks(data));
        }
      } catch (error) {
        console.error("Failed to fetch tasks");
        toast.error("Failed to fetch tasks");
      } finally {
        setIsLoadingTasks(false);
      }
    };

    fetchTasks();
  }, [isAuthenticated, token, dispatch, router]);

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
      }
    } catch (error) {
      console.error("Failed to create task");
      toast.error("Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    setIsUpdating(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${editingTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editingTask),
        }
      );
      if (res.ok) {
        const data = await res.json();
        dispatch(updateTask(data));
        toast.success("Task updated successfully");
        setIsEditOpen(false);
        setEditingTask(null);
      }
    } catch (error) {
      console.error("Failed to update task");
      toast.error("Failed to update task");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingStatusTaskId(id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        dispatch(updateTask(data));
        toast.success("Task status updated");
      }
    } catch (error) {
      console.error("Failed to update status");
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatusTaskId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    setDeletingTaskId(id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        dispatch(deleteTask(id));
        toast.success("Task deleted");
      }
    } catch (error) {
      console.error("Failed to delete task");
      toast.error("Failed to delete task");
    } finally {
      setDeletingTaskId(null);
    }
  };

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [updatingStatusTaskId, setUpdatingStatusTaskId] = useState<string | null>(null);

  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/summary`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary);
        toast.success("AI Summary generated");
      }
    } catch (error) {
      console.error("Failed to generate summary");
      toast.error("Failed to generate summary");
    } finally {
      setIsGeneratingSummary(false);
    }
  };



  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    todo: tasks.filter((t) => t.status === "pending").length,
  }), [tasks]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {showOnboarding && (
        <Onboarding
          onComplete={() => {
            localStorage.setItem("hasSeenOnboarding", "true");
            setShowOnboarding(false);
          }}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* AI Summary Section */}
        <AISummaryCard 
            summary={summary} 
            isGenerating={isGeneratingSummary}
            onGenerate={generateSummary}
        />

        {/* Stats Cards */}
        <DashboardStats stats={stats} />

        {/* Filters and Search */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-end">
            <TaskFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
            <Button onClick={() => setIsDialogOpen(true)} className="mb-2 md:mb-0">
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
             <div className="text-sm text-muted-foreground whitespace-nowrap pb-2">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid gap-4">
          {isLoadingTasks ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border-2">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-6 w-3/4" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTasks.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-muted-foreground">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No tasks found</p>
                <p className="text-sm">
                  Try adjusting your filters or create a new task
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setIsEditOpen(true);
                  }}
                  isDeleting={deletingTaskId === task.id}
                  isUpdatingStatus={updatingStatusTaskId === task.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <CreateTaskDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateTask={handleCreateTask}
        newTask={newTask}
        setNewTask={setNewTask}
        isLoading={isCreating}
      />

      <EditTaskDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        onUpdateTask={handleUpdateTask}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        isLoading={isUpdating}
      />
    </div>
  );
}
