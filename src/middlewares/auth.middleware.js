import { User } from "../models/user.model.js";
import { projectMember } from "../models/projectmember.models.js";
import { asynchandlers } from "../utils/async-handlers.js";
import { ApiError } from "../utils/api-error.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const verifyJWT = asynchandlers(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  console.log("Token mila:", token);

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded token:", decodedToken);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );
    console.log("Mila user:", user);
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});

export const validateProjectPermission = (roles = []) => {
  return asynchandlers(async (req, res, next) => {
    const { projectId } = req.params;

    if (!projectId) {
      throw new ApiError(400, "project id is missing");
    }
    const project = await projectMember
      .findOne({
        project: new mongoose.Types.ObjectId(projectId),
        user: req.user._id,
      })
      .lean();
    // ✅ Ye add karo — dekho kya aa raha hai
    console.log("Poora project document:", project);
    console.log("DB se aaya role:", project?.role);
    console.log("Required roles:", roles);
    console.log("projectId:", projectId);
    console.log("user._id:", req.user._id);
    console.log("typeof projectId:", typeof projectId);
    console.log("typeof user._id:", typeof req.user._id);
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new ApiError(400, "Invalid project ID");
    }

    if (!project) {
      throw new ApiError(400, "project is missing");
    }
    const givenRole = project?.role;

    req.user.role = givenRole;

    if (!roles.includes(givenRole)) {
      throw new ApiError(403, "you do not have access to perform this action");
    }
    next();
  });
};
