import express, { Request, Response } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms: { [roomId: string]: string[] } = {};
const choices: { [roomId: string]: { [playerId: string]: string } } = {};

// Handle Socket.IO connection
io.on("connection", (socket: Socket) => {
  console.log("A user connected", socket.id);

  socket.on("joinRoom", (roomId: string) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    if (rooms[roomId].length < 2) {
      socket.join(roomId);
      rooms[roomId].push(socket.id);
      console.log(`User ${socket.id} joined room ${roomId}`);

      socket.emit("roomJoined", roomId);

      if (rooms[roomId].length === 2) {
        io.to(roomId).emit("startGame", "The game can now begin!");
      }
    } else {
      socket.emit("roomFull", "This room is full. Please join another room.");
    }
  });

  socket.on(
    "playerChoice",
    ({ roomId, choice }: { roomId: string; choice: string }) => {
      if (!choices[roomId]) {
        choices[roomId] = {};
      }
      console.log(choices);
      choices[roomId][socket.id] = choice; // Store player's choice
      console.log(choices);

      console.log(`Player ${socket.id} chose ${choice} in room ${roomId}`);

      // Check if playerIds is defined before accessing its elements
      const playerIds = rooms[roomId];
      if (playerIds) {
        const player1 = playerIds[0];
        const player2 = playerIds[1];

        // Check if both player1 and player2 are defined
        if (player1 && player2) {
          const choice1 = choices[roomId][player1];
          const choice2 = choices[roomId][player2];

          // Check if both choices are defined
          if (choice1 && choice2) {
            const result = getGameResult(choice1, choice2);
            let winner = "none";
            if (result === "Player 1 wins!") {
              winner = player1;
            }
            if (result === "Player 2 wins!") {
              winner = player2;
            }
            io.to(roomId).emit("gameResult", {
              player1,
              choice1,
              player2,
              choice2,
              result,
              winner,
            });

            // Clear choices for the next round
            delete choices[roomId];
          } else {
            console.error(
              `Choices are not defined for players in room ${roomId}`
            );
          }
        } else {
          console.error(`Player IDs are not defined for room ${roomId}`);
          return; // Exit if player IDs are not defined
        }
      } else {
        console.error(`No players found in room ${roomId}`);
        return; // Exit if no players are found
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);

    // Remove the user from any rooms they were in
    for (const roomId in rooms) {
      if (rooms[roomId]) {
        rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
        if (rooms[roomId].length === 0) {
          delete rooms[roomId];
          delete choices[roomId]; // Clear choices if room is removed
        }
      }
    }
  });
});

// Helper function to determine the game result
function getGameResult(choice1: string, choice2: string): string {
  const winningMap: { [key: string]: string } = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper",
  };

  if (choice1 === choice2) return "It's a tie!";
  if (winningMap[choice1] === choice2) return "Player 1 wins!";
  return "Player 2 wins!";
}

// Express route for testing
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the RPS Server",
  });
});

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
