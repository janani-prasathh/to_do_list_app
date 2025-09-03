import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Sidebar } from "@/components/sidebar";
import { MainContent } from "@/components/main-content";
import { FloatingActionButton } from "@/components/floating-action-button";
import type { Task } from "@shared/schema";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFocusMode, setIsFocusMode] = useLocalStorage("taskflow-focus-mode", false);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    // TODO: Open edit modal/dialog
  };

  const handleFloatingAdd = () => {
    // TODO: Open quick add modal or focus on main input
    const mainInput = document.querySelector('[data-testid="input-new-task"]') as HTMLInputElement;
    if (mainInput) {
      mainInput.focus();
      mainInput.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar
        onCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
        onFocusModeToggle={() => setIsFocusMode(!isFocusMode)}
        isFocusMode={isFocusMode}
      />
      <MainContent
        selectedCategory={selectedCategory}
        onEditTask={handleEditTask}
        isFocusMode={isFocusMode}
      />
      <FloatingActionButton onClick={handleFloatingAdd} />
    </div>
  );
}
