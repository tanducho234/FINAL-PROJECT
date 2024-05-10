const mongoose = require("mongoose");
const dotenv = require("dotenv");
const WebSocket = require("ws");
const BorrowRequest = require("../src/models/borrowRequest");

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const db = mongoose.connection;
    const collection = db.collection("borrowrequests");

    const changeStream = collection.watch();
    const wss = new WebSocket.Server({ port: 8080 });

    changeStream.on("change", async (change) => {
      try {
        console.log("Change detected:", change);
        if (change.operationType === "delete") {
          const messageData = {
            type: "BorrowRequestDeleted",
          };
          const jsonString = JSON.stringify(messageData);

          wss.clients.forEach((client) => {
            console.log("websocket");
            if (client.readyState === WebSocket.OPEN) {
              client.send(jsonString); // You can send additional data if needed
            }
          });
          return
        }
        documentId = change.documentKey._id.toHexString();
        const borrowRequest = await BorrowRequest.findById(documentId);
        const messageData = {
          id1: borrowRequest.lender,
          id2: borrowRequest.borrower,
          type: "BorrowRequestChange",
        };
        const jsonString = JSON.stringify(messageData);
        wss.clients.forEach((client) => {
          console.log("websocket");
          if (client.readyState === WebSocket.OPEN) {
            client.send(jsonString); // You can send additional data if needed
          }
        });
      } catch (error) {
        console.log(error);
      }
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
