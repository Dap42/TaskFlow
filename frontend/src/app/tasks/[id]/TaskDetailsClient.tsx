"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Button } from "../../../components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import CountdownTimer from "@/components/tasks/CountdownTimer";
import TaskInfoCard from "@/components/tasks/TaskInfoCard";
import SubtasksList from "@/components/tasks/SubtasksList";

interface Subtask {
  id: string;
  title: string;
  is_completed: boolean;
  task_id: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  deadline: string;
  subtasks?: Subtask[];
}

export default function TaskDetailsClient({
  task: initialTask,
}: {
  task: Task;
}) {
  const router = useRouter();
  const { token } = useSelector((state: RootState) => state.auth);
  const [task, setTask] = useState(initialTask);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(initialTask);

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedTask),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setTask(data);
        setEditedTask(data);
        setIsEditing(false);
        toast.success("Task updated successfully");
        router.refresh();
      } else {
        toast.error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error updating task");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        toast.success("Task deleted successfully");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Error deleting task");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Task Details</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Countdown Timer Card */}
        <CountdownTimer deadline={task.deadline} />

        {/* Main Task Card */}
        <TaskInfoCard
          task={task}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editedTask={editedTask}
          setEditedTask={setEditedTask}
          onSave={handleSave}
          onDelete={handleDelete}
        />

        {/* Subtasks Card */}
        <SubtasksList taskId={task.id} />
      </div>
    </div>
  );
}

