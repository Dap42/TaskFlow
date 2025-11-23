"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setTasks, updateTask, deleteTask } from "../store/tasksSlice";
import TaskCard from "./TaskCard";
import DraggableTaskCard from "./DraggableTaskCard";
import { useDroppable } from "@dnd-kit/core";
import { toast } from "sonner";
import TaskModal from "./TaskModal";

function DroppableColumn({
  id,
  title,
  count,
  children,
}: {
  id: string;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl min-w-[320px] flex flex-col gap-4 h-full shadow-inner"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 capitalize flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              id === "pending"
                ? "bg-yellow-500"
                : id === "in_progress"
                ? "bg-blue-500"
                : "bg-green-500"
            }`}
          ></span>
          {title.replace("_", " ")}
        </h2>
        <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 custom-scrollbar">
        {children}
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const { items: tasks, token } = useSelector((state: RootState) => {
    return {
      items: state.tasks.items || [],
      token: state.auth.token,
    };
  });
  const dispatch = useDispatch();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns = ["pending", "in_progress", "completed"];

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    const overId = over.id;

    if (!activeTask) return;

    // If dropped over a column
    if (columns.includes(overId as string)) {
      if (activeTask.status !== overId) {
        await handleStatusChange(activeTask.id, overId as string);
      }
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
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
        const updatedTask = await res.json();
        dispatch(updateTask(updatedTask));
        toast.success(`Task moved to ${status.replace("_", " ")}`);
      }
    } catch (error) {
      console.error("Failed to update task status", error);
      toast.error("Failed to move task");
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

  const handleUpdateTask = async (task: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(task),
        }
      );
      if (res.ok) {
        const data = await res.json();
        dispatch(updateTask(data));
        toast.success("Task updated successfully");
      }
    } catch (error) {
      console.error("Failed to update task");
      toast.error("Failed to update task");
      throw error;
    }
  };

  return (
    <div className="h-full overflow-x-auto pb-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 p-4 min-w-max">
          {columns.map((colId) => {
            const columnTasks = tasks.filter(
              (task) =>
                task.status === colId ||
                (colId === "pending" &&
                  !["in_progress", "completed"].includes(task.status))
            );
            return (
              <DroppableColumn
                key={colId}
                id={colId}
                title={colId}
                count={columnTasks.length}
              >
                {columnTasks.map((task) => (
                  <DraggableTaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onEdit={(task) => {
                      setEditingTask(task);
                      setShowEditModal(true);
                    }}
                    isDeleting={deletingTaskId === task.id}
                  />
                ))}
              </DroppableColumn>
            );
          })}
        </div>
        <DragOverlay>
          {activeId ? (
            <div className="opacity-80 rotate-3 scale-105 cursor-grabbing">
              <TaskCard
                task={tasks.find((t) => t.id === activeId)}
                onStatusChange={() => {}}
                onDelete={() => {}}
                onEdit={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTask(null);
        }}
        onSave={handleUpdateTask}
        initialTask={editingTask}
        title="Edit Task"
      />
    </div>
  );
}
