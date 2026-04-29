import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 3000;
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  })

  .catch((error) => {
    console.log("mongodb connection error", error);
  });

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });
// app.get("/instagram", (req, res) => {
//   res.send("This is ig page!"); // to access this http://localhost:8000/instagram
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port http://localhost:${port}`);
// });

// let myusername = process.env.myusername; // if process.env.username then gives gk
// console.log("value:", myusername);
// console.log("Start of backend");
