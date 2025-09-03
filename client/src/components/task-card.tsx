import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GripVertical, Clock, Edit3, Trash2, Check, RotateCcw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Task, Category } from "@shared/schema";

interface TaskCardProps {
  task: Task;
  categories: Category[];
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, categories, onEdit }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const category = categories.find(c => c.id === task.categoryId);
  
  const categoryColors: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500", 
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    orange: "bg-orange-500",
  };

  const priorityColors: Record<string, string> = {
    low: "bg-green-500",
    medium: "bg-yellow-500", 
    high: "bg-red-500",
  };

  const toggleTaskMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", `/api/tasks/${task.id}`, {
        completed: !task.completed,
      });
    },
    onMutate: () => {
      setIsCompleting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: task.completed ? "Task restored!" : "Task completed!",
        description: task.completed ? "Task marked as incomplete." : "Great job on finishing your task.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsCompleting(false);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/tasks/${task.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Task deleted",
        description: "Task has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className={`task-card glass-effect rounded-xl p-4 slide-in ${task.completed ? 'opacity-75' : ''}`} data-testid={`task-card-${task.id}`}>
      <div className="flex items-center space-x-4">
        {/* Drag Handle */}
        <div className="cursor-move text-muted-foreground hover:text-foreground transition-colors">
          <GripVertical className="w-4 h-4" />
        </div>
        
        {/* Checkbox */}
        <Button
          variant="ghost"
          size="icon"
          className={`relative w-6 h-6 rounded-lg border-2 p-0 ${task.completed ? 'bg-primary border-primary' : 'border-muted-foreground hover:border-primary'} transition-all`}
          onClick={() => toggleTaskMutation.mutate()}
          disabled={isCompleting}
          data-testid={`button-toggle-task-${task.id}`}
        >
          {task.completed && (
            <Check className="w-4 h-4 text-white" />
          )}
        </Button>
        
        {/* Task Content */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-1">
            <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`} data-testid={`text-task-title-${task.id}`}>
              {task.title}
            </h4>
            {category && (
              <div className="category-pill px-2 py-1 rounded-md">
                <span className="text-xs font-medium">{category.name}</span>
              </div>
            )}
            {task.dueTime && (
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{task.dueTime}</span>
              </div>
            )}
            {task.completed && (
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <CheckCircle className="w-3 h-3" />
                <span>Completed</span>
              </div>
            )}
          </div>
          {task.description && (
            <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
          )}
          
          {/* Task Progress */}
          <div className="flex items-center space-x-3 mt-2">
            <div className="flex-1 bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${task.completed ? 'bg-green-500' : 'bg-gradient-to-r from-primary to-purple-600'}`}
                style={{ width: `${task.completed ? 100 : task.progress || 0}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {task.completed ? '100%' : `${task.progress || 0}%`}
            </span>
          </div>
        </div>
        
        {/* Priority */}
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-8 ${priorityColors[task.priority] || 'bg-gray-500'} rounded-full`} />
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2">
          {task.completed ? (
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => toggleTaskMutation.mutate()}
              disabled={isCompleting}
              data-testid={`button-restore-task-${task.id}`}
            >
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => onEdit(task)}
              data-testid={`button-edit-task-${task.id}`}
            >
              <Edit3 className="w-4 h-4 text-muted-foreground" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
            onClick={() => deleteTaskMutation.mutate()}
            disabled={deleteTaskMutation.isPending}
            data-testid={`button-delete-task-${task.id}`}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}
