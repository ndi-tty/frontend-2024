import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./css/where-is-charlie.modules.css";
import win from "../assets/win.png";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import CustomAlertDialog from "../components/common/customAlertDialog";

enum Events {
  CONNECTION = "connection",
  COORDONATE = "coordonate",
  ERROR = "error",
  RESULT = "result",
}

interface ConnectionPayload {
  text: string;
  imageBase64: string;
}

interface ResultPayload {
  success: boolean;
  message: string;
}

interface Coordonates {
  x: number;
  y: number;
}

const renderTime = ({ remainingTime }: any) => {
  const currentTime = useRef(remainingTime);
  const prevTime = useRef(null);
  const isNewTimeFirstTick = useRef(false);
  const [, setOneLastRerender] = useState(0);

  if (currentTime.current !== remainingTime) {
    isNewTimeFirstTick.current = true;
    prevTime.current = currentTime.current;
    currentTime.current = remainingTime;
  } else {
    isNewTimeFirstTick.current = false;
  }

  // force one last re-render when the time is over to tirgger the last animation
  if (remainingTime === 0) {
    setTimeout(() => {
      setOneLastRerender((val) => val + 1);
    }, 20);
  }

  const isTimeUp = isNewTimeFirstTick.current;

  return (
    <div className="time-wrapper">
      <div key={remainingTime} className={`time ${isTimeUp ? "up" : ""}`}>
        {remainingTime}
      </div>
      {prevTime.current !== null && (
        <div
          key={prevTime.current}
          className={`time ${!isTimeUp ? "down" : ""}`}
        >
          {prevTime.current}
        </div>
      )}
    </div>
  );
};

const WhereIsCharlie: React.FC = () => {
  const ws = useRef<Socket | null>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const squareLength = 500;
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isWin, setIsWin] = useState<boolean>(false);
  const [isHardcore, setIsHardcore] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    ws.current = io("http://localhost:8080/where-is-charlie");
    ws.current.on(Events.CONNECTION, (data: ConnectionPayload) => {
      setImage(`data:image/png;base64,${data.imageBase64}`);
    });
    ws.current.on(Events.RESULT, (data: ResultPayload) => {
      console.log(data);
      if (data.success) {
        setIsWin(data.success);
      } else {
      }
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
      ws.current?.emit(Events.COORDONATE, relativeCoordinates);
    } else {
      console.log("Click was outside the image.");
    }
  };

  return (
    <div className="App">
      <h1>Where Is Charlie?</h1>

      <CustomAlertDialog
        onAction={() => {
          setIsHardcore(true);
          setIsPlaying(true);
        }}
        onCancel={() => {
          setIsHardcore(false);
          setIsPlaying(true);
        }}
        title="Enable Hardcore Mode?"
        description="Hardcore Mode disables the zoom feature, making the game more
            challenging. Are you up for the challenge?"
        actionText="Yes, Hardcore! 🔥💀🔪"
        cancelText="No, Easy Mode 😎👌👍"
      />

      <div style={{ position: "relative", border: "solid 2px black" }}>
        <div className="timer-container ">
          <CountdownCircleTimer
            isPlaying={isPlaying}
            duration={180}
            colors={"#f73434"}
            onComplete={() => {
              // do your stuff here
              return { shouldRepeat: true, delay: 1.5 }; // repeat animation in 1.5 seconds
            }}
          >
            {renderTime}
          </CountdownCircleTimer>
        </div>

        {isWin && (
          <div className="win-container">
            <img src={win} alt="win" />
          </div>
        )}

        {image ? (
          <>
            <img
              ref={imageRef}
              onClick={handleClick}
              onMouseMove={handleMouseMove}
              onDragStart={(e) => e.preventDefault()}
              src={image}
              alt="Where is Charlie?"
              className={[
                isHardcore ? "mode-hardcore" : "",
                isWin ? "game-win" : "game-in-progress",
              ].join(" ")}
              style={{
                display: "block",
                width: "100%",
              }}
            />

            {isHardcore && !isWin && isPlaying && (
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
