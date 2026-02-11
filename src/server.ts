import { Server } from "http";
import app from "./app";
import config from "./config";
import { connectedDb } from "./app/DB/connected.db";
import './app/bullMQ/init'
// import { seedAdmin } from "./app/utils/seedAdmin";


const port = config.port || 5001;

async function main() {
  // Express + HTTP server
  const httpServer: Server = app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
    connectedDb();
  });

  // graceful shutdown
  const exitHandler = () => {
    if (httpServer) httpServer.close(() => console.info("Server closed!"));
    process.exit(1);
  };

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
    exitHandler();
  });
}

main();
