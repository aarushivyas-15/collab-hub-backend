import { Router } from "express";
import {
  addMembersToProjects,
  getProjects,
  createProject,
  deleteMember,
  deleteProjects,
  getProjectById,
  getProjectMembers,
  updateMemberRole,
  updateProjects,
} from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  createProjectValidator,
  addMembertoProjectValidator,
} from "../validators/index.js";
import { userLoginValidator } from "../validators/index.js";
import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middleware.js";
import { AvailableUserRole, UserRolesEnum } from "../utils/constants.js";
import {
  createTask,
  getTask,
  getTaskById,
  updateTask,
  deleteTask,
  getSubTask,
} from "../controllers/task.controllers.js";

import {
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from "../controllers/task.controllers.js";
const router = Router();
router.use(verifyJWT);

router
  .route("/")
  .get(getProjects)
  .post(createProjectValidator(), validate, createProject);
router
  .route("/:projectId")
  .get(
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    getProjectById,
  )
  .put(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    createProjectValidator(),
    validate,
    updateProjects,
  )
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteProjects);

router
  .route("/:projectId/members")
  .get(getProjectMembers)
  .post(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    addMembertoProjectValidator(),
    validate,
    addMembersToProjects,
  )
  .put(validateProjectPermission([UserRolesEnum.ADMIN]), updateMemberRole)
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteMember);

router
  .route("/:projectId/tasks")
  .get(validateProjectPermission(AvailableUserRole), getTask)
  .post(validateProjectPermission(AvailableUserRole), createTask);

router
  .route("/:projectId/t/:taskId")
  .put(updateTask)
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteTask);

// subtask

router
  .route("/:projectId/tasks/:taskId/subtasks")
  .get(validateProjectPermission(AvailableUserRole), getSubTask)
  .post(validateProjectPermission(AvailableUserRole), createSubTask);

router
  .route("/:projectId/tasks/:taskId/subtasks/:subtaskId")
  .put(updateSubTask)
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteSubTask);

export default router;
