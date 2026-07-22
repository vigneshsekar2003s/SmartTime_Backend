import { Request, Response } from "express";
import Task from "../models/Task";

// Create Task
export const createTask = async (req: Request, res: Response) => {
  try {
   const task = await Task.create({
  ...req.body,
  user: (req as any).user.id,
});

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
    });
  }
};

// Get All Tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find();

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};

// Update Task
export const updateTask = async (req: Request, res: Response) => {
  try {
    // If due date is changed, reset reminder
    if (req.body.dueDate) {
      req.body.reminderSent = false;
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
    });
  }
};

// Delete Task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task",
    });
  }
};