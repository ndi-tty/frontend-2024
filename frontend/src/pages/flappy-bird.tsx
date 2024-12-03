import React, { useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import "./css/flappy-bird.modules.css";

const PIPE_GAP = 150; // Increased gap for easier gameplay

interface Bird {
  x: number;
  y: number;
  velocity: number;
  width: number;
  height: number;
}

interface Pipe {
  x: number;
  height: number;
}

interface GameState {
  bird: Bird;
  pipes: Pipe[];
  score: number;
  gameOver: boolean;
}

const FlappyBird: React.FC = () => {
  const [bird, setBird] = useState<Bird>({
    x: 50,
    y: 300,
    velocity: 0,
    width: 10,
    height: 10,
  });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://127.0.0.1:8080");
    setSocket(newSocket);

    newSocket.on("INITIAL_STATE", (initialState: GameState) => {
      setBird(initialState.bird);
      setPipes(initialState.pipes);
      setScore(initialState.score);
      setGameOver(initialState.gameOver);
    });

    newSocket.on("UPDATE_STATE", (updatedState: GameState) => {
      console.log("UPDATE_STATE", updatedState);
      setBird(updatedState.bird);
      setPipes(updatedState.pipes);
      setScore(updatedState.score);
      setGameOver(updatedState.gameOver);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space" && socket) {
        socket.emit("message", JSON.stringify({ type: "FLAP" }));
      }
    },
    [socket]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const gameInterval = setInterval(() => {
      if (gameOver || !socket) return;

      socket.emit("message", JSON.stringify({ type: "UPDATE" }));
    }, 30);

    return () => clearInterval(gameInterval);
  }, [gameOver, socket]);

  return (
    <div className="App">
      <h1>Flappy Bird with React</h1>
      <div className="game-area">
        <div
          className="bird"
          style={{
            top: `${bird.y}px`,
            left: `${bird.x}px`,
            width: `${bird.width}px`,
            height: `${bird.height}px`,
          }}
        ></div>
        {pipes.map((pipe, index) => (
          <div key={index}>
            <div
              className="pipe"
              style={{ height: `${pipe.height}px`, left: `${pipe.x}px` }}
            ></div>
            <div
              className="pipe bottom"
              style={{
                height: `${600 - pipe.height - PIPE_GAP}px`,
                left: `${pipe.x}px`,
                top: `${pipe.height + PIPE_GAP}px`,
              }}
            ></div>
          </div>
        ))}
      </div>
      <div className="score">Score: {score}</div>
      {gameOver && <div className="game-over">Game Over!</div>}
    </div>
  );
};

export default FlappyBird;
