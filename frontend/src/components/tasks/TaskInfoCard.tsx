import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  Trash2,
  Save,
  Tag,
  Flag,
  Calendar,
} from "lucide-react";

interface TaskInfoCardProps {
  task: any;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  editedTask: any;
  setEditedTask: (task: any) => void;
  onSave: () => void;
  onDelete: () => void;
}

export default function TaskInfoCard({
  task,
  isEditing,
  setIsEditing,
  editedTask,
  setEditedTask,
  onSave,
  onDelete,
}: TaskInfoCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 hover:bg-red-600";
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "low":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex justify-between items-start flex-wrap gap-4">
          <CardTitle className="text-2xl">Task Information</CardTitle>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  onClick={onDelete}
                  variant="destructive"
                  size="sm"
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button onClick={onSave} size="sm" className="gap-2">
                  <Save className="w-4 h-4" />
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedTask(task);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Title
          </Label>
          {isEditing ? (
            <Input
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
            />
          ) : (
            <div className="text-2xl font-semibold">{task.title}</div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          {isEditing ? (
            <Textarea
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  description: e.target.value,
                })
              }
              rows={4}
            />
          ) : (
            <div className="text-muted-foreground">
              {task.description || "No description provided"}
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Category */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Category
            </Label>
            {isEditing ? (
              <Select
                value={editedTask.category}
                onValueChange={(v) =>
                  setEditedTask({ ...editedTask, category: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className="capitalize w-fit">
                {task.category}
              </Badge>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Priority
            </Label>
            {isEditing ? (
              <Select
                value={editedTask.priority}
                onValueChange={(v) =>
                  setEditedTask({ ...editedTask, priority: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge
                className={`${getPriorityColor(
                  task.priority
                )} text-white capitalize w-fit`}
              >
                {task.priority}
              </Badge>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            {isEditing ? (
              <Select
                value={editedTask.status}
                onValueChange={(v) =>
                  setEditedTask({ ...editedTask, status: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="secondary" className="capitalize w-fit">
                {task.status.replace("_", " ")}
              </Badge>
            )}
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Deadline
            </Label>
            {isEditing ? (
              <Input
                type="date"
                value={
                  editedTask.deadline
                    ? editedTask.deadline.split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setEditedTask({ ...editedTask, deadline: e.target.value })
                }
              />
            ) : (
              <div className="font-medium">
                {task.deadline
                  ? new Date(task.deadline).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "No deadline"}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
