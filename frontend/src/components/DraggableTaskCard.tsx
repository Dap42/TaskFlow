import React from "react";
import { useDraggable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

interface DraggableTaskCardProps {
  task: any;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: any) => void;
  isDeleting?: boolean;
}

export default function DraggableTaskCard({
  task,
  onStatusChange,
  onDelete,
  onEdit,
  isDeleting,
}: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { task },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30"
      >
        <TaskCard
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onEdit={onEdit}
          isDeleting={isDeleting}
        />
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TaskCard
        task={task}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        onEdit={onEdit}
        isDeleting={isDeleting}
      />
    </div>
  );
}
