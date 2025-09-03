import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon, Zap, Calendar, Flame, Focus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category, UserStats, Task } from "@shared/schema";

interface SidebarProps {
  onCategorySelect: (categoryId: string | null) => void;
  selectedCategory: string | null;
  onFocusModeToggle: () => void;
  isFocusMode: boolean;
}

export function Sidebar({ onCategorySelect, selectedCategory, onFocusModeToggle, isFocusMode }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/stats"],
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const todayTasks = tasks.filter((task) => !task.completed).length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const categoryColors: Record<string, string> = {
    blue: "bg-blue-500",
    green: "bg-green-500", 
    purple: "bg-purple-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    orange: "bg-orange-500",
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className={`sidebar fixed inset-y-0 left-0 z-50 w-80 bg-card/50 glass-effect border-r border-border theme-transition ${isFocusMode ? '-translate-x-full' : 'translate-x-0'}`}>
      <div className="flex flex-col h-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
            data-testid="button-theme-toggle"
          >
            {theme === "light" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Today</p>
                <p className="text-2xl font-bold" data-testid="text-today-tasks">{todayTasks}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Streak</p>
                <p className="text-2xl font-bold" data-testid="text-streak">{stats?.currentStreak || 0}</p>
              </div>
              <Flame className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted opacity-20"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-primary progress-ring"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold" data-testid="text-completion-percentage">
                {completionPercentage}%
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Daily Progress</p>
        </div>

        {/* Categories */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Categories
          </h3>
          <div className="space-y-2">
            <div
              className={`flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer ${selectedCategory === null ? 'bg-accent' : ''}`}
              onClick={() => onCategorySelect(null)}
              data-testid="category-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="font-medium">All Tasks</span>
              </div>
              <span className="text-sm text-muted-foreground">{totalTasks}</span>
            </div>
            {categories.map((category) => {
              const categoryTasks = tasks.filter((task) => task.categoryId === category.id);
              return (
                <div
                  key={category.id}
                  className={`flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer ${selectedCategory === category.id ? 'bg-accent' : ''}`}
                  onClick={() => onCategorySelect(category.id)}
                  data-testid={`category-${category.name.toLowerCase()}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${categoryColors[category.color] || 'bg-gray-500'} rounded-full`}></div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{categoryTasks.length}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Focus Mode Toggle */}
        <Button
          onClick={onFocusModeToggle}
          className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105"
          data-testid="button-focus-mode"
        >
          <div className="flex items-center justify-center space-x-2">
            <Focus className="w-5 h-5" />
            <span>{isFocusMode ? 'Exit Focus' : 'Focus Mode'}</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
