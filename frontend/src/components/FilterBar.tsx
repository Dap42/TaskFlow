"use client";

import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../store/tasksSlice";
import { RootState } from "../store/store";

export default function FilterBar() {
  const dispatch = useDispatch();
  const filter = useSelector((state: RootState) => state.tasks.filter);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-center transition-colors duration-200">
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <select
          value={filter.category || ""}
          onChange={(e) =>
            dispatch(setFilter({ category: e.target.value || null }))
          }
          className="border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">All</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Priority
        </label>
        <select
          value={filter.priority || ""}
          onChange={(e) =>
            dispatch(setFilter({ priority: e.target.value || null }))
          }
          className="border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Status
        </label>
        <select
          value={filter.status || ""}
          onChange={(e) =>
            dispatch(setFilter({ status: e.target.value || null }))
          }
          className="border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
          Search
        </label>
        <input
          type="text"
          placeholder="Search tasks..."
          value={filter.search || ""}
          onChange={(e) =>
            dispatch(setFilter({ search: e.target.value || null }))
          }
          className="border rounded p-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
    </div>
  );
}
