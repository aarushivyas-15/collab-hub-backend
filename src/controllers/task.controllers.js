import { User } from "../models/user.model.js";
import { Project } from "../models/Project.models.js";
import { Task } from "../models/task.models.js";
import { Subtask } from "../models/subtask.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asynchandlers } from "../utils/async-handlers.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import { MIMEType } from "util";
import { pipeline } from "stream";

const getTask = asynchandlers(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "project not found");
  }
  const tasks = await Task.find({
    project: new mongoose.Types.ObjectId(projectId),
  })
    .populate("assignedTo", "avatar username fullName")
    .populate("assignedBy", "avatar username fullName")
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(201, tasks, "tasks fetched successfully"));
});

const createTask = asynchandlers(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;

  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "project not found");
  }

  const files = req.files || [];

  const attachments = files.map((file) => {
    return {
      url: `${process.env.SERVER_URL}/images/${file.originalname}`,
      mimetype: file.mimetype,
      size: file.size,
    };
  });
  const task = await Task.create({
    title,
    description,
    project: new mongoose.Types.ObjectId(projectId),
    assignedTo: assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined,

    status,
    assignedBy: new mongoose.Types.ObjectId(req.user._id),
    attachments,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, task, "task created successfully"));
});

const getTaskById = asynchandlers(async (req, res) => {
  const { taskId } = req.params;
  const task = await Task.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
      },
    },
    {
      $lookup: {
        from: "user",
        localField: "assignedTo",
        foreignField: "_id",
        as: "assignedTo",
        pipeline: [
          {
            _id: 1,
            username: 1,
            fullName: 1,
            avatar: 1,
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subtasks",
        localField: "_id",
        foreignField: "tasks",
        as: "subtasks",
        pipeline: [
          {
            from: "user",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
            pipeline: [
              {
                $project: {
                  id: 1,
                  username: 1,
                  fullName: 1,
                  avatar: 1,
                },
              },
              {
                $addFields: {
                  createdBy: {
                    $arrayElemAt: ["$createdBy", 0],
                  },
                },
              },
            ],
          },
        ],
      },
    },
    {
      $addFields: {
        assignedTo: {
          $arrayElemAt: ["$assignedTo"],
        },
      },
    },
  ]);

  if (!task || task.length == 0) {
    throw new ApiError(404, "task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task[0], "task fetched successfully"));
});

const updateTask = asynchandlers(async (req, res) => {
  const { taskId } = req.params;
  const { title, description, assignedTo, status } = req.body;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Handle new attachments if files were uploaded
  const files = req.files || [];
  const newAttachments = files.map((file) => ({
    url: `${process.env.SERVER_URL}/images/${file.originalname}`,
    mimetype: file.mimetype,
    size: file.size,
  }));
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    {
      $set: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(assignedTo && {
          assignedTo: new mongoose.Types.ObjectId(assignedTo),
        }),
        // Append any new attachments to existing ones
        ...(newAttachments.length > 0 && {
          attachments: [...task.attachments, ...newAttachments],
        }),
      },
    },
    { new: true },
  ).populate("assignedTo", "avatar username fullName");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const deleteTask = asynchandlers(async (req, res) => {
  const { taskId } = req.params;
  console.log("length", taskId.length);
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await Subtask.deleteMany({ task: new mongoose.Types.ObjectId(taskId) });

  await Task.findByIdAndDelete(taskId);

  return res
    .status(200)
    .json(new ApiResponse(200, { taskId }, "Task deleted successfully"));
});

const createSubTask = asynchandlers(async (req, res) => {
  const { taskId } = req.params;
  const { title } = req.body;

  const task = await Task.findById(new mongoose.Types.ObjectId(taskId));

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subtask = await Subtask.create({
    title,
    task: new mongoose.Types.ObjectId(taskId),
    createdBy: req.user._id,
    isCompleted: false,
  });
  console.log("taskId:", taskId); // ✅ add karo
  console.log("user._id:", req.user._id); // ✅ add karo
  return res
    .status(201)
    .json(new ApiResponse(201, subtask, "Subtask created successfully"));
});

const updateSubTask = asynchandlers(async (req, res) => {
  const { title, isCompleted } = req.body;
  const { subtaskId } = req.params;
  const TrimedSubtaskId = subtaskId.trim();

  console.log("length:", subtaskId.length);
  console.log("subtaskId:", subtaskId);
  console.log("valid:", mongoose.Types.ObjectId.isValid(TrimedSubtaskId));

  const subtask = await Subtask.findById(
    new mongoose.Types.ObjectId(TrimedSubtaskId),
  );

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  const updatedSubtask = await Subtask.findByIdAndUpdate(
    TrimedSubtaskId,
    {
      $set: {
        ...(title !== undefined && { title }),
        ...(isCompleted !== undefined && { isCompleted }),
      },
    },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSubtask, "Subtask updated successfully"));
});

const deleteProjects = asynchandlers(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findByIdAndDelete(projectId);
  if (!project) {
    throw new ApiError(404, " Project not found ");
  }

  return req
    .status(200)
    .json(new ApiResponse(200, " Project deleted successfully"));
});

const addMembersToProjects = asynchandlers(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  await ProjectMember.findByIdAndUpdate(
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
      role: role,
    },
    {
      new: true,
      upsert: true,
    },
  );

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "project member added successfully"));
});

const deleteSubTask = asynchandlers(async (req, res) => {
  const { subtaskId } = req.params;

  const subtask = await Subtask.findById(subtaskId);
  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  await Subtask.findByIdAndDelete(subtaskId);

  return res
    .status(200)
    .json(new ApiResponse(200, { subtaskId }, "Subtask deleted successfully"));
}); // done
const getSubTask = asynchandlers(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const subtasks = await Subtask.find({ task: taskId }).lean();

  return res
    .status(200)
    .json(new ApiResponse(200, subtasks, "Subtasks fetched successfully"));
});
export {
  createSubTask,
  updateSubTask,
  deleteSubTask,
  createTask,
  updateTask,
  deleteTask,
  getTask,
  getTaskById,
  getSubTask,
};
