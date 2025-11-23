"use client";


import KanbanBoard from "../../components/KanbanBoard";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setTasks } from "../../store/tasksSlice";
import { toast } from "sonner";

import AuthGuard from "../../components/AuthGuard";

// ... existing imports

export default function KanbanPage() {
  const { token, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Manual redirect removed in favor of AuthGuard
    const fetchTasks = async () => {
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
      }
    };

    if (isAuthenticated) {
        fetchTasks();
    }
  }, [isAuthenticated, token, dispatch, router]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">

        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            Kanban Board
          </h1>
          <KanbanBoard />
        </div>
      </div>
    </AuthGuard>
  );
}
