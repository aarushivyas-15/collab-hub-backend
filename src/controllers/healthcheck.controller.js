import { ApiResponse } from "../utils/api-response.js";
import { asynchandlers } from "../utils/async-handlers.js";

//* another way without creating the file async handler
// const healthCheck = (req, res, next) => {
//   try {
//     res
//       .status(200)
//       .json(new ApiResponse(200, { message: "Server is running" }));
//   } catch (error) {
//     next(err);
//   }
// };

const healthCheck = asynchandlers(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { message: "Server is running" }));
});
export { healthCheck };
