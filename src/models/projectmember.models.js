// import mongoose, { Schema } from "mongoose";
// import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

// const projectMemberSchema = new Schema(
//   {
//     name: { type: Schema.Types.Array.ObjectId, ref: "User", required: true },
//     project: {
//       type: Schema.Types.Array.ObjectId,
//       ref: "Project",
//       required: true,
//     },

//     role: {
//       type: String,
//       enum: AvailableUserRole,
//       default: UserRolesEnum.MEMBER,
//     },
//   },

//   { timestamps: true },
// );

// export const projectMember = mongoose.model(
//   "projectMember",
//   projectMemberSchema,
// );
import mongoose, { Schema } from "mongoose";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";

const projectMemberSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    role: {
      type: String,
      enum: AvailableUserRole,
      default: UserRolesEnum.MEMBER,
    },
  },
  { timestamps: true },
);

export const projectMember = mongoose.model(
  "projectMember",
  projectMemberSchema,
);
