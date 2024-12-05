import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./css/where-is-charlie.modules.css";
import win from "../assets/win.png";
import CustomAlertDialog from "../components/common/custom-alert-dialog";
import Timer from "../components/common/timer";

enum Events {
  INIT_GAME = "init-game",
  START_GAME = "start-game",
  ERROR = "error",
  SUBMIT_COORDONATES = "submit-coordonates",
}

enum GameState {
  NOT_STARTED = "not-started",
  WON = "won",
  IN_PROGRESS = "in-progress",
  LOST = "lost",
}

interface InitGamePayload {
  attemptsLeft: number;
  imageBase64: string;
  gameState: GameState;
}

interface ResultPayload {
  attemptsLeft: number;
  message: string;
  success: boolean;
  gameState: GameState;
}

interface Coordonates {
  x: number;
  y: number;
}

const WhereIsCharlie: React.FC = () => {
  const ws = useRef<Socket | null>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const squareLength = 500;
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isHardcore, setIsHardcore] = useState<boolean>(true);
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null); // Track remaining attempts
  const [isWrongClick, setIsWrongClick] = useState<boolean>(false); // Flag to trigger animation

  useEffect(() => {
    ws.current = io("http://localhost:8080/where-is-charlie");
    ws.current.on(Events.INIT_GAME, (data: InitGamePayload) => {
      setImage(`data:image/png;base64,${data.imageBase64}`);
      setAttemptsLeft(data.attemptsLeft);
      setGameState(data.gameState);
    });

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current) return;

    // Calculate the cursor position relative to the image
    const rect = imageRef.current.getBoundingClientRect();

    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    // Clamp the position to ensure the zoom circle stays within bounds
    x = Math.min(Math.max(x, squareLength / 2), rect.width - squareLength / 2);
    y = Math.min(Math.max(y, squareLength / 2), rect.height - squareLength / 2);

    setCursorPos({ x, y });
  };

  const handleClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!ws.current || !imageRef.current) return;

    const image = imageRef.current;

    // Calculate relative coordinates
    const rect = image.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Ensure the coordinates are within the image
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      const relativeCoordinates: Coordonates = {
        x: x / rect.width, // Normalize to a value between 0 and 1
        y: y / rect.height, // Normalize to a value between 0 and 1
      };
      console.log(relativeCoordinates);

      // Send coordinates to the backend
      ws.current?.emit(
        Events.SUBMIT_COORDONATES,
        relativeCoordinates,
        (data: ResultPayload) => {
          console.log(data);

          setAttemptsLeft(data.attemptsLeft);
          setGameState(data.gameState);
          setIsWrongClick(data.success);
        }
      );
    } else {
      console.log("Click was outside the image.");
    }
  };

  const handleAnimationEnd = () => {
    setIsWrongClick(false); // Reset animation after it ends
  };

  return (
    <div className="App">
      <h1>Where Is Charlie?</h1>

      <CustomAlertDialog
        onAction={() => {
          setIsHardcore(true);
          ws.current?.emit(Events.START_GAME, "hello", (data: any) => {
            console.log(data);

            setGameState(GameState.IN_PROGRESS);
          });
        }}
        onCancel={() => {
          setIsHardcore(false);
          ws.current?.emit(Events.START_GAME, () => {
            setGameState(GameState.IN_PROGRESS);
          });
        }}
        title="Enable Hardcore Mode?"
        description="Hardcore Mode disables the zoom feature, making the game more
            challenging. Are you up for the challenge?"
        actionText="Yes, Hardcore! 🔥💀🔪"
        cancelText="No, Easy Mode 😎👌👍"
      />

      <div style={{ position: "relative", border: "solid 2px black" }}>
        {gameState !== GameState.NOT_STARTED && (
          <div className="timer-container">
            <Timer isPlaying={gameState === GameState.IN_PROGRESS} />
            <span className="attempts-left">Attempts Left: {attemptsLeft}</span>
          </div>
        )}

        {gameState === GameState.WON && (
          <div className="win-container">
            <img src={win} alt="win" />
          </div>
        )}

        {image && gameState !== GameState.NOT_STARTED ? (
          <>
            <img
              ref={imageRef}
              onClick={handleClick}
              onMouseMove={handleMouseMove}
              onDragStart={(e) => e.preventDefault()}
              src={image}
              alt="Where is Charlie?"
              className={[
                (isHardcore && gameState === GameState.IN_PROGRESS) ||
                gameState === GameState.WON
                  ? "black-overlay"
                  : "",
                isWrongClick ? "shake-animation" : "",
              ].join(" ")}
              style={{
                display: "block",
                width: "100%",
              }}
              onAnimationEnd={handleAnimationEnd} // Reset animation after it ends
            />

            {isHardcore && gameState === GameState.IN_PROGRESS && (
              <div
                className="highlight-square"
                style={{
                  top: cursorPos.y - squareLength / 2,
                  left: cursorPos.x - squareLength / 2,
                  width: squareLength,
                  height: squareLength,
                  backgroundImage: `url(${image})`,
                  backgroundPosition: `-${
                    2 + cursorPos.x - squareLength / 2
                  }px -${2 + cursorPos.y - squareLength / 2}px`,
                  // backgroundSize: `${imageRef.current?.width!}px ${imageRef
                  //   .current?.height!}px`,
                  backgroundSize: `${imageRef.current?.offsetWidth}px ${imageRef.current?.offsetHeight}px`,
                }}
              />
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default WhereIsCharlie;
