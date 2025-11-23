"use client";

import React, { useState } from "react";
import { Task } from "../types";
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
  useDroppable,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setTasks, updateTask, deleteTask, moveTaskOptimistic } from "../store/tasksSlice";
import TaskCard from "./TaskCard";
import DraggableTaskCard from "./DraggableTaskCard";
import { toast } from "sonner";
import EditTaskDialog from "./dashboard/EditTaskDialog";

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
      className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl min-w-[320px] flex flex-col gap-4 h-full shadow-inner overflow-x-hidden"
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
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 custom-scrollbar scrollbar-hide">
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
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    
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
        setEditingTask(null);
        setShowEditModal(false);
      }
    } catch (error) {
      console.error("Failed to update task");
      toast.error("Failed to update task");
    }
  };

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

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveId(event.active.id as string);
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.task;
    const isOverTask = over.data.current?.task;

    if (!isActiveTask) return;

    // Dropping over another task
    if (isActiveTask && isOverTask) {
      if (isActiveTask.status !== isOverTask.status) {
        dispatch(
          moveTaskOptimistic({
            id: activeId as string,
            status: isOverTask.status,
          })
        );
      }
    } else if (columns.includes(overId as string)) {
      // Dropping over a column directly
      if (isActiveTask.status !== overId) {
        dispatch(
          moveTaskOptimistic({
            id: activeId as string,
            status: overId as string,
          })
        );
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { over } = event;
    setActiveId(null);
    const currentTask = activeTask; // Capture the task state from start of drag
    setActiveTask(null);

    if (!over || !currentTask) return;

    const overId = over.id;
    let newStatus = "";

    // Determine new status
    if (columns.includes(overId as string)) {
      newStatus = overId as string;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    // Only call API if the status actually changed from the START of the drag
    if (newStatus && currentTask.status !== newStatus) {
      await handleStatusChange(currentTask.id, newStatus);
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
        toast.success(`Moved to ${status.replace("_", " ")}`, {
          duration: 1500, // Short duration
        });
      }
    } catch (error) {
      console.error("Failed to update task status", error);
      toast.error("Failed to move task");
      // Revert optimistic update on failure (optional but recommended)
      // For now, we'll just show the error
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

  return (
    <div className="h-full overflow-x-auto pb-4 scrollbar-hide">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
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
                <SortableContext
                  items={columnTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
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
                </SortableContext>
              </DroppableColumn>
            );
          })}
        </div>
        <DragOverlay>
          {activeId ? (
            <div className="opacity-80 rotate-3 scale-105 cursor-grabbing">
              <TaskCard
                task={tasks.find((t) => t.id === activeId)!}
                onStatusChange={() => {}}
                onDelete={() => {}}
                onEdit={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <EditTaskDialog
        isOpen={showEditModal}
        onOpenChange={(open) => {
          setShowEditModal(open);
          if (!open) setEditingTask(null);
        }}
        onUpdateTask={handleUpdateTask}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
      />
    </div>
  );
}
