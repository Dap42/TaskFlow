import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  deadline: string;
}

interface TasksState {
  items: Task[];
  filter: {
    category: string | null;
    priority: string | null;
    status: string | null;
    search: string | null;
  };
}

const initialState: TasksState = {
  items: [],
  filter: {
    category: null,
    priority: null,
    status: null,
    search: null,
  },
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.items.push(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    setFilter: (
      state,
      action: PayloadAction<Partial<TasksState["filter"]>>
    ) => {
      state.filter = { ...state.filter, ...action.payload };
    },
  },
});

export const { setTasks, addTask, updateTask, deleteTask, setFilter } =
  tasksSlice.actions;
export default tasksSlice.reducer;
