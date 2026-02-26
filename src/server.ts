import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";
import { env } from "./config/env";
import { connectDB } from "./database/db";

const PORT = Number(env.PORT);

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

startServer();
