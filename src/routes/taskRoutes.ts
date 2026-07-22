import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController";

import upload from "../middleware/upload";

import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", verifyToken, createTask);

router.get("/", verifyToken, getTasks);

router.put("/:id", verifyToken, updateTask);

router.delete("/:id", verifyToken, deleteTask);

router.post(
  "/upload",
  upload.single("attachment"),
  (req, res) => {
    try {
      res.status(200).json({
        filename: req.file?.filename,
      });
    } catch (error) {
      res.status(500).json({
        message: "File Upload Failed",
      });
    }
  }
);

export default router;