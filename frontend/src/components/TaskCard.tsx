"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Trash2,
  Edit,
  Eye,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Spinner } from "./ui/spinner";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  isDeleting?: boolean;
  isUpdatingStatus?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function TaskCard({
  task,
  onStatusChange,
  onDelete,
  onEdit,
  isDeleting = false,
  isUpdatingStatus = false,
  onClick,
  className,
}: TaskCardProps) {
  const isCompleted = task.status === "completed";
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!task.deadline) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const deadline = new Date(task.deadline).getTime();
      const distance = deadline - now;

      if (distance < 0) {
        setTimeLeft("Overdue");
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [task.deadline]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "pending":
      case "todo":
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={onClick}
    >
      <Card className={`hover:shadow-lg transition-all border-2 hover:border-primary ${className || "cursor-pointer"}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(task.status)}
                <h3
                  className={`text-lg font-semibold ${
                    isCompleted ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {task.title}
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {task.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="capitalize">
                  {task.category}
                </Badge>
                <Badge
                  className={`${getPriorityColor(
                    task.priority
                  )} text-white capitalize`}
                >
                  {task.priority}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {task.status.replace("-", " ")}
                </Badge>
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="text-sm text-muted-foreground">Deadline</div>
              <div className="font-semibold">
                {task.deadline
                  ? new Date(task.deadline).toLocaleDateString()
                  : "No deadline"}
              </div>
              {task.deadline && (
                <div
                  className={`text-xs mt-1 ${
                    timeLeft === "Overdue"
                      ? "text-red-500 font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {timeLeft}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div 
            className="flex justify-end gap-2 mt-4 pt-4 border-t"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={`/tasks/${task.id}`}>
              <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-full transition">
                <Eye size={18} />
              </button>
            </Link>
            <button
              onClick={() =>
                onStatusChange(task.id, isCompleted ? "pending" : "completed")
              }
              disabled={isUpdatingStatus}
              className={`p-2 rounded-full transition ${
                isCompleted
                  ? "text-green-600 bg-green-50 dark:bg-green-900/30"
                  : "text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30"
              } ${isUpdatingStatus ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isUpdatingStatus ? <Spinner size={18} /> : <CheckCircle2 size={18} />}
            </button>
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? <Spinner size={18} /> : <Trash2 size={18} />}
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
