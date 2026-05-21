import { Projectnote } from "../models/note.models.js";
import { Project } from "../models/Project.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asynchandlers } from "../utils/async-handlers.js";
import mongoose from "mongoose";

// Create Note — Admin only
const createNote = asynchandlers(async (req, res) => {
  const { projectId } = req.params;
  const { content } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const note = await Projectnote.create({
    project: projectId,
    createdBy: req.user._id,
    content,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note created successfully"));
});

// Get All Notes
const getNotes = asynchandlers(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const notes = await Projectnote.find({ project: projectId })
    .populate("createdBy", "username fullName avatar")
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

// Get Note By ID
const getNoteById = asynchandlers(async (req, res) => {
  const { noteId } = req.params;

  const note = await Projectnote.findById(noteId)
    .populate("createdBy", "username fullName avatar")
    .lean();

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note fetched successfully"));
});

// Update Note — Admin only
const updateNote = asynchandlers(async (req, res) => {
  const { noteId } = req.params;
  const { content } = req.body;

  const note = await Projectnote.findByIdAndUpdate(
    noteId,
    { $set: { content } },
    { returnDocument: "after" },
  );

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note updated successfully"));
});

// Delete Note — Admin only
const deleteNote = asynchandlers(async (req, res) => {
  const { noteId } = req.params;

  const note = await Projectnote.findByIdAndDelete(noteId);
  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { noteId }, "Note deleted successfully"));
});

export { createNote, getNotes, getNoteById, updateNote, deleteNote };
