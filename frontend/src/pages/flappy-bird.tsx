import React, { useState, useEffect, useCallback } from "react";
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
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket);

    socket.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);

      if (type === "INITIAL_STATE") {
        setBird(data.bird);
        setPipes(data.pipes);
        setScore(data.score);
        setGameOver(data.gameOver);
      }

      if (type === "UPDATE_STATE") {
        setBird(data.bird);
        setPipes(data.pipes);
        setScore(data.score);
        setGameOver(data.gameOver);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space" && ws) {
        ws.send(JSON.stringify({ type: "FLAP" }));
      }
    },
    [ws]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const gameInterval = setInterval(() => {
      if (gameOver || !ws) return;

      ws.send(JSON.stringify({ type: "UPDATE" }));
    }, 30);

    return () => clearInterval(gameInterval);
  }, [gameOver, ws]);

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
