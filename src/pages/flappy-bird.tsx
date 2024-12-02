import React, { useState, useEffect, useCallback } from "react";
import "./css/flappy-bird.modules.css";

const GRAVITY = 1;
const FLAP = -10;
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;

interface Bird {
  x: number;
  y: number;
  velocity: number;
}

interface Pipe {
  x: number;
  height: number;
}

const FlappyBird: React.FC = () => {
  const [bird, setBird] = useState<Bird>({ x: 50, y: 300, velocity: 0 });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      setBird((prev) => ({ ...prev, velocity: FLAP }));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const gameInterval = setInterval(() => {
      if (gameOver) return;

      // Update bird position
      setBird((prev) => ({
        ...prev,
        y: prev.y + prev.velocity,
        velocity: prev.velocity + GRAVITY,
      }));

      // Add new pipes
      setPipes((prev) => {
        if (prev.length === 0 || prev[prev.length - 1].x < 200) {
          const height = Math.random() * (500 - PIPE_GAP - 50) + 50;
          return [...prev, { x: 400, height }];
        }
        return prev.map((pipe) => ({ ...pipe, x: pipe.x - 3 }));
      });

      // Collision detection
      pipes.forEach((pipe) => {
        if (
          bird.x + 20 > pipe.x &&
          bird.x - 20 < pipe.x + PIPE_WIDTH &&
          (bird.y - 20 < pipe.height || bird.y + 20 > pipe.height + PIPE_GAP)
        ) {
          setGameOver(true);
        }
      });

      // Check if bird hit the ground or ceiling
      if (bird.y + 20 > 600 || bird.y - 20 < 0) {
        setGameOver(true);
      }

      // Score update
      setScore((prev) => prev + 1);
    }, 30);

    return () => clearInterval(gameInterval);
  }, [bird, pipes, gameOver]);

  return (
    <div className="App">
      <h1>Flappy Bird with React</h1>
      <div className="game-area">
        <div
          className="bird"
          style={{ top: `${bird.y}px`, left: `${bird.x}px` }}
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
