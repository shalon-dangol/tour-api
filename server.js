import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ path: "./config.env" });

mongoose.connect(process.env.DATABASE).then((con) => {
  console.log("DB connect successfully");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  console.log(process.env.NODE_ENV);
});
