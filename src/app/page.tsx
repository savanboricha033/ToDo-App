"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3001/tasks");
      if (!response.ok) throw new Error(`Error fetching tasks: ${response.status}`);
      const data = await response.json();
      setTodoList(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err.message);
    }
  };

  const addTask = async (text) => {
    if (!text) return;
    try {
      const response = await fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, completed: false }),
      });
      if (!response.ok) throw new Error(`Error adding task: ${response.status}`);
      const newTask = await response.json();
      setTodoList((prev) => [...prev, newTask]);
      setInputText("");
    } catch (err) {
      console.error("Failed to add task:", err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Error deleting task: ${response.status}`);
      setTodoList((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err.message);
    }
  };

  const toggleComplete = async (task) => {
    try {
      const updatedTask = { ...task, completed: !task.completed };
      const response = await fetch(`http://localhost:3001/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) throw new Error(`Error updating task: ${response.status}`);
      setTodoList((prev) =>
        prev.map((t) => (t.id === task.id ? updatedTask : t))
      );
    } catch (err) {
      console.error("Failed to update task:", err.message);
    }
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case "remaining":
        return todoList.filter((task) => !task.completed);
      case "completed":
        return todoList.filter((task) => task.completed);
      default:
        return todoList;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = getFilteredTasks();

  return (
    <main>
      <div>
        <h1 className="font-mono text-5xl flex justify-center items-center m-10">
          To-Do List
        </h1>
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="input-box" className="sr-only">
            Input with button
          </Label>
          <div className="flex gap-2 m-2 justify-center">
            <Input
              id="input-box"
              value={inputText}
              className="w-1/3"
              placeholder="Give your task"
              onChange={(e) => setInputText(e.target.value)}
            />
            <Button onClick={() => addTask(inputText)} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex-1">
            {filteredTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2 m-2">
                <Checkbox
                  id={`checkbox-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleComplete(task)}
                />
                <Label
                  htmlFor={`checkbox-${task.id}`}
                  className={`flex-1 ${
                    task.completed ? "line-through" : ""
                  }`}
                >
                  {task.text}
                </Label>
                <Button onClick={() => deleteTask(task.id)}>Delete</Button>
              </div>
            ))}
          </div>
          <div className="flex w-full fixed bottom-0">
            <Button
              className="flex-1"
              onClick={() => setFilter("all")}
              variant={filter === "all" ? "default" : "secondary"}
            >
              All
            </Button>
            <Button
              className="flex-1"
              onClick={() => setFilter("remaining")}
              variant={filter === "remaining" ? "default" : "secondary"}
            >
              Remaining
            </Button>
            <Button
              className="flex-1"
              onClick={() => setFilter("completed")}
              variant={filter === "completed" ? "default" : "secondary"}
            >
              Completed
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
}
