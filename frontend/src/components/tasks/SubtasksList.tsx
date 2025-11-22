import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Subtask {
  id: string;
  title: string;
  is_completed: boolean;
  task_id: string;
}

interface SubtasksListProps {
  taskId: string;
}

export default function SubtasksList({ taskId }: SubtasksListProps) {
  const { token } = useSelector((state: RootState) => state.auth);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  useEffect(() => {
    const fetchSubtasks = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/subtasks/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setSubtasks(data);
        }
      } catch (error) {
        console.error("Error fetching subtasks:", error);
      }
    };
    if (taskId) {
      fetchSubtasks();
    }
  }, [taskId, token]);

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/subtasks/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: newSubtaskTitle }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setSubtasks([...subtasks, data]);
        setNewSubtaskTitle("");
        toast.success("Subtask added");
      }
    } catch (error) {
      console.error("Error adding subtask:", error);
      toast.error("Failed to add subtask");
    }
  };

  const handleToggleSubtask = async (
    subtaskId: string,
    isCompleted: boolean
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/subtasks/${subtaskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_completed: !isCompleted }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setSubtasks(subtasks.map((s) => (s.id === subtaskId ? data : s)));
      }
    } catch (error) {
      console.error("Error toggling subtask:", error);
    }
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/subtasks/${subtaskId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setSubtasks(subtasks.filter((s) => s.id !== subtaskId));
        toast.success("Subtask deleted");
      }
    } catch (error) {
      console.error("Error deleting subtask:", error);
      toast.error("Failed to delete subtask");
    }
  };

  return (
    <Card className="border-2 mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Subtasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a new subtask..."
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
          />
          <Button onClick={handleAddSubtask}>Add</Button>
        </div>

        <div className="space-y-2">
          {subtasks.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No subtasks yet. Add one above!
            </p>
          ) : (
            subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={subtask.is_completed}
                    onChange={() =>
                      handleToggleSubtask(subtask.id, subtask.is_completed)
                    }
                    className="w-5 h-5 cursor-pointer"
                  />
                  <span
                    className={`${
                      subtask.is_completed
                        ? "line-through text-muted-foreground"
                        : ""
                    }`}
                  >
                    {subtask.title}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteSubtask(subtask.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
