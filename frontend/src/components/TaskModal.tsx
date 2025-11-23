"use client";

import { useState, useEffect } from "react";
import { Spinner } from "./ui/spinner";

import { Task } from "../types";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => Promise<void>;
  initialTask?: Task | null;
  title: string;
}

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  initialTask,
  title,
}: TaskModalProps) {
  const [task, setTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    category: "Work",
    priority: "medium",
    deadline: "",
    status: "pending",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTask({
        ...initialTask,
        deadline: initialTask.deadline
          ? new Date(initialTask.deadline).toISOString().slice(0, 16)
          : "",
      });
    } else {
      setTask({
        id: "",
        title: "",
        description: "",
        category: "Work",
        priority: "medium",
        deadline: "",
        status: "pending",
      });
    }
  }, [initialTask, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(task);
      onClose();
    } catch (error) {
      console.error("Failed to save task", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 dark:text-white">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <textarea
            placeholder="Description"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            rows={3}
          />
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Category
              </label>
              <select
                value={task.category}
                onChange={(e) => setTask({ ...task, category: e.target.value })}
                className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Study">Study</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Priority
              </label>
              <select
                value={task.priority}
                onChange={(e) => setTask({ ...task, priority: e.target.value })}
                className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {initialTask && (
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Status
              </label>
              <select
                value={task.status}
                onChange={(e) => setTask({ ...task, status: e.target.value })}
                className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Deadline
            </label>
            <input
              type="datetime-local"
              value={task.deadline}
              onChange={(e) => setTask({ ...task, deadline: e.target.value })}
              className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isSaving ? (
                <>
                  <Spinner size={20} /> Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
