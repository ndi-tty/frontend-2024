import { WebSocketServer } from "ws";
import { GameState, Message } from "./types";

const GRAVITY = 0.5;
const FLAP = -5;
const PIPE_WIDTH = 50; // Fixed width for pipes
const PIPE_GAP = 150; // Increased gap for easier gameplay

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  const initialState: GameState = {
    bird: { x: 50, y: 300, velocity: 0, width: 15, height: 15 },
    pipes: [],
    score: 0,
    gameOver: false,
  };

  ws.send(JSON.stringify({ type: "INITIAL_STATE", data: initialState }));

  ws.on("message", (message: string) => {
    const { type, data }: Message = JSON.parse(message);

    if (type === "FLAP") {
      initialState.bird.velocity = FLAP;
    }

    if (type === "UPDATE") {
      // Update bird position
      initialState.bird.y += initialState.bird.velocity;
      initialState.bird.velocity += GRAVITY;

      // Add new pipes
      if (
        initialState.pipes.length === 0 ||
        initialState.pipes[initialState.pipes.length - 1].x < 200
      ) {
        const height = Math.random() * (500 - PIPE_GAP - 50) + 50;
        initialState.pipes.push({ x: 400, height });
      }
      initialState.pipes = initialState.pipes.map((pipe) => ({
        ...pipe,
        x: pipe.x - 3,
      }));

      // Collision detection
      initialState.pipes.forEach((pipe) => {
        if (
          initialState.bird.x + initialState.bird.width / 2 > pipe.x &&
          initialState.bird.x - initialState.bird.width / 2 <
            pipe.x + PIPE_WIDTH &&
          (initialState.bird.y - initialState.bird.height / 2 < pipe.height ||
            initialState.bird.y + initialState.bird.height / 2 >
              pipe.height + PIPE_GAP)
        ) {
          initialState.gameOver = true;
        }
      });

      // Check if bird hit the ground or ceiling
      if (
        initialState.bird.y + initialState.bird.height / 2 > 600 ||
        initialState.bird.y - initialState.bird.height / 2 < 0
      ) {
        initialState.gameOver = true;
      }

      // Score update
      initialState.score += 1;

      ws.send(JSON.stringify({ type: "UPDATE_STATE", data: initialState }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
