import { useState, useMemo } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  deadline: string;
  status: string;
}

export function useTaskFilters(tasks: Task[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (task) => task.category?.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    // Priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter((task) => task.priority === filterPriority);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (sortBy === "priority") {
        const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
        return (
          (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3)
        );
      }
      return 0;
    });

    return filtered;
  }, [tasks, searchQuery, filterCategory, filterPriority, filterStatus, sortBy]);

  return {
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
  };
}
