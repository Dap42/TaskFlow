import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AISummaryCardProps {
  summary: string;
  isGenerating?: boolean;
  onGenerate?: () => void;
}

export default function AISummaryCard({ summary, isGenerating, onGenerate }: AISummaryCardProps) {
  if (!summary && !isGenerating) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border-l-4 border-purple-500 p-6 mb-8 rounded-lg shadow-md animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-xl text-purple-700 dark:text-purple-400 flex items-center gap-2">
          <Sparkles size={24} /> AI Weekly Summary
        </h3>
        <Link href="/ai-summary">
          <Button 
              variant="ghost" 
              size="sm" 
              className="text-purple-600 hover:text-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/20"
          >
              <Sparkles className="w-4 h-4 mr-2" />
              View Full Summary
          </Button>
        </Link>
      </div>
      
      {isGenerating && !summary ? (
          <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-purple-100 dark:bg-purple-900/20 rounded w-3/4"></div>
              <div className="h-4 bg-purple-100 dark:bg-purple-900/20 rounded w-full"></div>
              <div className="h-4 bg-purple-100 dark:bg-purple-900/20 rounded w-5/6"></div>
          </div>
      ) : (
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed line-clamp-3">
            {summary || "Generate your first AI summary to see insights here."}
          </p>
      )}
    </div>
  );
}
