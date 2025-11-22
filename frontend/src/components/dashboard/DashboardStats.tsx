"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatsProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statsData = [
    { label: "Total Tasks", value: stats.total, borderColor: "border-2" },
    { label: "Completed", value: stats.completed, borderColor: "border-2 border-green-200 dark:border-green-900", textColor: "text-green-600" },
    { label: "In Progress", value: stats.inProgress, borderColor: "border-2 border-blue-200 dark:border-blue-900", textColor: "text-blue-600" },
    { label: "To Do", value: stats.todo, borderColor: "border-2 border-gray-200 dark:border-gray-700", textColor: "text-gray-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: index * 0.1,
          }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <Card className={`${stat.borderColor} shadow-lg hover:shadow-xl transition-shadow`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.textColor || ""}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
