// import { User } from "../models/user.model.js";
// import { Project } from "../models/Project.models.js";
// import { projectMember } from "../models/projectmember.models.js";
// import { ApiResponse } from "../utils/api-response.js";
// import { ApiError } from "../utils/api-error.js";
// import { asynchandlers } from "../utils/async-handlers.js";
// import mongoose from "mongoose";
// import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
// import { Schema } from "mongoose";
// import { pipeline } from "stream";
// import nodemailer from "nodemailer";

// const getProjects = asynchandlers(async (req, res) => {
//   const projects = await ProjectMember.aggregate([
//     {
//       $match: {
//         user: new mongoose.Types.ObjectId(req.user._id),
//       },
//     },
//     {
//       $lookup: {
//         from: "projects",
//         localField: "projects",
//         foreignField: "_id",
//         as: "projects",
//         pipeline: [
//           {
//             $lookup: {
//               from: "projectmembers",
//               localField: "_id",
//               foreignField: "projects",
//               as: "projectmembers",
//             },
//           },
//           {
//             $addFields: {
//               members: {
//                 $size: "$projectmembers",
//               },
//             },
//           },
//         ],
//       },
//     },
//     {
//       $unwind: "$project",
//     },
//     {
//       $project: {
//         project: {
//           _id: 1,
//           name: 1,
//           description: 1,
//           members: 1,
//           createdAt: 1,
//           createdBy: 1,
//         },
//         role: 1,
//         _id: 0,
//       },
//     },
//   ]);

//   return res.status(200).json(200, projects, "project fetched successfully");
// });

// const getProjectById = asynchandlers(async (req, res) => {
//   const { projectId } = req.params;
//   const project = await Project.findById(projectId);
//   if (!project) {
//     throw new ApiError(404, " project not found");
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, project, "project fetched successfully"));
// });

// const createProject = asynchandlers(async (req, res) => {
//   const { name, description } = req.body;

//   const project = await Project.create({
//     name,
//     description,
//     createdBy: new mongoose.Types.ObjectId(req.user._id),
//   });

//   await ProjectMember.create({
//     user: new mongoose.Types.ObjectId(req.user._id),
//     project: new mongoose.Types.ObjectId(req.project._id),
//     role: UserRolesEnum.ADMIN,
//   });
//   return res
//     .status(201)
//     .json(new ApiResponse(201, project, "project created successfully"));
// });

// const updateProjects = asynchandlers(async (req, res) => {
//   const { name, description } = req.body;
//   const { projectId } = req.params;

//   const project = await Project.findByIdAndUpdate(
//     projectId,
//     {
//       name,
//       description,
//     },
//     {
//       new: true,
//     },
//   );

//   if (!project) {
//     throw new ApiError(404, "project not found");
//   }
//   return res
//     .status(200)
//     .json(new ApiResponse(200, project, "project updated successfully"));
// });

// const deleteProjects = asynchandlers(async (req, res) => {
//   const { projectId } = req.params;

//   const project = await Project.findByIdAndDelete(projectId);
//   if (!project) {
//     throw new ApiError(404, " Project not found ");
//   }

//   return req
//     .status(200)
//     .json(new ApiResponse(200, " Project deleted successfully"));
// });

// const addMembersToProjects = asynchandlers(async (req, res) => {
//   const { email, role } = req.body;
//   const { projectId } = req.params;
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new ApiError(404, "User does not exist");
//   }

//   await ProjectMember.findByIdAndUpdate(
//     {
//       user: new mongoose.Types.ObjectId(user._id),
//       project: new mongoose.Types.ObjectId(projectId),
//     },
//     {
//       user: new mongoose.Types.ObjectId(user._id),
//       project: new mongoose.Types.ObjectId(projectId),
//       role: role,
//     },
//     {
//       new: true,
//       upsert: true,
//     },
//   );

//   return res
//     .status(201)
//     .json(new ApiResponse(201, {}, "project member added successfully"));
// });

// const getProjectMembers = asynchandlers(async (req, res) => {
//   const { projectId } = req.params;
//   const project = await Project.findById(req.params);

//   if (!project) {
//     throw new ApiError(404, "Project not found");
//   }

//   const projectMembers = await ProjectMember.aggregate([
//     {
//       $match: {
//         user: new mongoose.Types.ObjectId(projectId),
//       },
//     },

//     {
//       $lookup: {
//         from: "user",
//         localField: "user",
//         foreignField: "_id",
//         as: "user",
//         pipeline: [
//           {
//             $project: {
//               _id: 1,
//               username: 1,
//               fullName: 1,
//               avatar: 1,
//             },
//           },
//         ],
//       },
//     },
//     {
//       $addFields: {
//         user: {
//           $arrayElemAt: ["$user", 0],
//         },
//       },
//     },
//     {
//       $project: {
//         project: 1,
//         user: 1,
//         role: 1,
//         createdAt: 1,
//         updatedAt: 1,
//         _id: 0,
//       },
//     },
//   ]);

//   return res
//     .status(200)
//     .json(new ApiResponse(200, projectMembers, "project member fetched"));
// });

// const updateMemberRole = asynchandlers(async (req, res) => {
//   const { projectId, userId } = req.params;
//   const { newRole } = req.body;

//   if (!AvailableUserRole.includes(newRole)) {
//     throw new ApiError(400, "Invalid Role");
//   }

//   let ProjectMember = await ProjectMember.findOne(
//     {
//       project: new mongoose.Types.ObjectId(projectId),
//       user: new mongoose.Types.ObjectId(userId),
//     },

//     {
//       new: true,
//     },
//   );
//   return res
//     .status(201)
//     .json(
//       new ApiResponse(
//         201,
//         ProjectMember,
//         "project member role updated successfully",
//       ),
//     );
// });

// const deleteMember = asynchandlers(async (req, res) => {
//   const { projectId, userId } = req.params;

//   let ProjectMember = await ProjectMember.findByIdAndDelete(
//     {
//       project: new mongoose.Types.ObjectId(projectId),
//       user: new mongoose.Types.ObjectId(userId),
//     },

//     {
//       new: true,
//     },
//   );
//   return res
//     .status(201)
//     .json(
//       new ApiResponse(
//         201,
//         ProjectMember,
//         "project member deleted successfully",
//       ),
//     );
// });

// export {
//   getProjects,
//   getProjectById,
//   createProject,
//   updateProjects,
//   deleteProjects,
//   addMembersToProjects,
//   getProjectMembers,
//   updateMemberRole,
//   deleteMember,
// };
import { User } from "../models/user.model.js";
import { Project } from "../models/Project.models.js";
import { projectMember } from "../models/projectmember.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asynchandlers } from "../utils/async-handlers.js";
import mongoose from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const getProjects = asynchandlers(async (req, res) => {
  const projects = await projectMember.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "projects",
        localField: "project", // ✅ Bug 2 fix
        foreignField: "_id",
        as: "projects",
        pipeline: [
          {
            $lookup: {
              from: "projectmembers",
              localField: "_id",
              foreignField: "project",
              as: "projectmembers",
            },
          },
          {
            $addFields: {
              members: { $size: "$projectmembers" },
            },
          },
        ],
      },
    },
    {
      $unwind: "$projects", // ✅ Bug 3 fix
    },
    {
      $project: {
        project: {
          _id: 1,
          name: 1,
          description: 1,
          members: 1,
          createdAt: 1,
          createdBy: 1,
        },
        role: 1,
        _id: 0,
      },
    },
  ]);

  return res // ✅ Bug 4 fix
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

const getProjectById = asynchandlers(async (req, res) => {
  const { projectId } = req.params;
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"));
});

const createProject = asynchandlers(async (req, res) => {
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  await projectMember.create({
    user: new mongoose.Types.ObjectId(req.user._id),
    project: new mongoose.Types.ObjectId(project._id), // ✅ Bug 5 fix
    role: UserRolesEnum.ADMIN,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});

const updateProjects = asynchandlers(async (req, res) => {
  const { name, description } = req.body;
  const { projectId } = req.params;

  const project = await Project.findByIdAndUpdate(
    projectId,
    { $set: { name, description } },
    { new: true },
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});

const deleteProjects = asynchandlers(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findByIdAndDelete(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res // ✅ Bug 6 fix
    .status(200)
    .json(new ApiResponse(200, { projectId }, "Project deleted successfully"));
});

const addMembersToProjects = asynchandlers(async (req, res) => {
  const { email, role } = req.body;
  const { projectId } = req.params;
  console.log("email:", email); // ✅ ye add karo
  console.log("role:", role); // ✅ ye add karo
  console.log("projectId:", projectId); // ✅ ye add karo
  // console.log("mila user:", user);

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  

  await projectMember.findOneAndUpdate(
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
    },
    {
      user: new mongoose.Types.ObjectId(user._id),
      project: new mongoose.Types.ObjectId(projectId),
      role,
    },
    { new: true, upsert: true },
  );

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Project member added successfully"));
});

const getProjectMembers = asynchandlers(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId); // ✅ Bug 7 fix
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const projectMembers = await projectMember.aggregate([
    {
      $match: {
        project: new mongoose.Types.ObjectId(projectId), // ✅ Bug 8 fix
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        user: { $arrayElemAt: ["$user", 0] },
      },
    },
    {
      $project: {
        projects: 1,
        user: 1,
        role: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, projectMembers, "Project members fetched"));
});

const updateMemberRole = asynchandlers(async (req, res) => {
  const { projectId } = req.params;
  const { userId, newRole } = req.body;
  console.log("projectId:", projectId);
  console.log("userId:", userId);
  console.log("newRole:", newRole);

  if (!AvailableUserRole.includes(newRole)) {
    throw new ApiError(400, "Invalid role");
  }

  const member = await projectMember.findOneAndUpdate(
    // ✅ Bug 9 fix
    {
      project: new mongoose.Types.ObjectId(projectId),
      user: new mongoose.Types.ObjectId(userId),
    },
    { $set: { role: newRole } },
    { returnDocument: "after" },
  );

  if (!member) {
    throw new ApiError(404, "Member not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, member, "Member role updated successfully"));
});

const deleteMember = asynchandlers(async (req, res) => {
  // const { projectId, userId } = req.params;
  const { projectId } = req.params;
  const { userId } = req.body;
  const member = await projectMember.findOneAndDelete({
    // ✅ Bug 10 fix
    project: new mongoose.Types.ObjectId(projectId),
    user: new mongoose.Types.ObjectId(userId),
  });

  if (!member) {
    throw new ApiError(404, "Member not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Project member deleted successfully"));
});

export {
  getProjects,
  getProjectById,
  createProject,
  updateProjects,
  deleteProjects,
  addMembersToProjects,
  getProjectMembers,
  updateMemberRole,
  deleteMember,
};
