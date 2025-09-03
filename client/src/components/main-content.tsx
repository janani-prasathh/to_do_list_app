import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, List, Grid3X3, Lightbulb, Coffee, BookOpen, Clipboard, Calendar, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskCard } from "./task-card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Task, Category } from "@shared/schema";

interface MainContentProps {
  selectedCategory: string | null;
  onEditTask: (task: Task) => void;
  isFocusMode: boolean;
}

export function MainContent({ selectedCategory, onEditTask, isFocusMode }: MainContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: suggestions = [] } = useQuery<any[]>({
    queryKey: ["/api/suggestions"],
  });

  const filteredTasks = tasks.filter(task => {
    const matchesCategory = selectedCategory ? task.categoryId === selectedCategory : true;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const incompleteTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  const createTaskMutation = useMutation({
    mutationFn: async (taskData: { title: string; categoryId?: string }) => {
      const maxPosition = Math.max(...tasks.map(t => t.position), -1);
      return apiRequest("POST", "/api/tasks", {
        title: taskData.title,
        categoryId: taskData.categoryId,
        position: maxPosition + 1,
        priority: "medium",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setNewTaskTitle("");
      setNewTaskCategory("");
      toast({
        title: "Task created!",
        description: "Your new task has been added successfully.",
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

  const addSuggestionMutation = useMutation({
    mutationFn: async (suggestionText: string) => {
      const maxPosition = Math.max(...tasks.map(t => t.position), -1);
      return apiRequest("POST", "/api/tasks", {
        title: suggestionText,
        position: maxPosition + 1,
        priority: "medium",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Task added!",
        description: "Suggestion has been added to your task list.",
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

  const handleQuickAdd = () => {
    if (newTaskTitle.trim()) {
      createTaskMutation.mutate({
        title: newTaskTitle.trim(),
        categoryId: newTaskCategory || undefined,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleQuickAdd();
    }
  };

  const suggestionIcons = {
    lightbulb: Lightbulb,
    coffee: Coffee,
    "book-open": BookOpen,
    clipboard: Clipboard,
    calendar: Calendar,
  };

  return (
    <div className={`main-content flex-1 ${isFocusMode ? 'ml-0' : 'ml-80'} theme-transition`}>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Good morning!</h2>
            <p className="text-muted-foreground">
              You have {incompleteTasks.length} tasks today. Let's get productive! 🚀
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-muted border-0 rounded-lg focus:ring-2 focus:ring-primary transition-all"
                data-testid="input-search-tasks"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            {/* View Toggle */}
            <div className="flex bg-muted rounded-lg p-1">
              <Button variant="ghost" size="icon" className="p-2 rounded-md bg-background text-foreground shadow-sm">
                <List className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="p-2 rounded-md text-muted-foreground hover:text-foreground">
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Smart Suggestions */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Smart Suggestions
          </h3>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion: any) => {
              const IconComponent = suggestionIcons[suggestion.icon as keyof typeof suggestionIcons] || Lightbulb;
              return (
                <Button
                  key={suggestion.id}
                  variant="ghost"
                  className="category-pill px-4 py-2 rounded-full text-sm font-medium text-foreground hover:bg-accent transition-all transform hover:scale-105"
                  onClick={() => addSuggestionMutation.mutate(suggestion.text)}
                  disabled={addSuggestionMutation.isPending}
                  data-testid={`button-suggestion-${suggestion.id}`}
                >
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-4 h-4" />
                    <span>{suggestion.text}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Quick Add */}
        <div className="mb-6">
          <div className="glass-effect rounded-xl p-4">
            <div className="flex items-center space-x-4">
              <Input
                type="text"
                placeholder="What needs to be done?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-lg font-medium placeholder-muted-foreground"
                data-testid="input-new-task"
              />
              <div className="flex items-center space-x-2">
                <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
                  <SelectTrigger className="bg-muted border-0 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary w-32" data-testid="select-category">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleQuickAdd}
                  disabled={!newTaskTitle.trim() || createTaskMutation.isPending}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  data-testid="button-add-task"
                >
                  Add Task
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        {tasksLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incompleteTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                categories={categories}
                onEdit={onEditTask}
              />
            ))}
            
            {completedTasks.length > 0 && (
              <>
                <div className="pt-4">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                    Completed ({completedTasks.length})
                  </h3>
                </div>
                {completedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    categories={categories}
                    onEdit={onEditTask}
                  />
                ))}
              </>
            )}

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {searchQuery ? "No tasks match your search." : "No tasks yet. Add one above!"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Section */}
        {!isFocusMode && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6">Productivity Insights</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Progress */}
              <div className="glass-effect rounded-xl p-6">
                <h4 className="font-semibold mb-4">Weekly Progress</h4>
                <div className="space-y-3">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => {
                    const progress = [100, 80, 70, 0, 0, 0, 0][index];
                    return (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{day}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{progress}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Achievement Streak */}
              <div className="glass-effect rounded-xl p-6">
                <h4 className="font-semibold mb-4">Achievement Streak</h4>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 streak-glow">
                    <Flame className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-primary" data-testid="text-streak-display">12</p>
                  <p className="text-sm text-muted-foreground">Days in a row</p>
                  <div className="flex justify-center space-x-1 mt-4">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <div 
                        key={dot}
                        className={`w-2 h-2 rounded-full ${dot <= 3 ? 'bg-primary' : 'bg-muted'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
