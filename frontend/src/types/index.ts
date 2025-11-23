export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  deadline: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}
