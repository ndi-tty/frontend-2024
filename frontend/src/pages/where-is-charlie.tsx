import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./css/where-is-charlie.modules.css";

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

interface CoordonateProps {
  x: number;
  y: number;
}

const WhereIsCharlie: React.FC = () => {
  const ws = useRef<Socket | null>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const zoomDiameter = 100; // 6 cm in pixels (assuming 96 DPI, 1 cm = ~37.8 pixels)
  const zoomRadius = zoomDiameter / 2;
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [zoomEnabled, setZoomEnabled] = useState<boolean>(true); // Toggle state

  useEffect(() => {
    ws.current = io("http://localhost:8080/where-is-charlie");
    ws.current.on(Events.CONNECTION, (data: ConnectionPayload) => {
      setImage(`data:image/png;base64,${data.imageBase64}`);
    });
    ws.current.on(Events.RESULT, (data: ResultPayload) => {
      console.log(data);
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
    x = Math.min(Math.max(x, zoomRadius), rect.width - zoomRadius);
    y = Math.min(Math.max(y, zoomRadius), rect.height - zoomRadius);

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
      const relativeCoordinates: CoordonateProps = {
        x: x / rect.width, // Normalize to a value between 0 and 1
        y: y / rect.height, // Normalize to a value between 0 and 1
      };

      // Send coordinates to the backend
      ws.current?.emit(Events.COORDONATE, relativeCoordinates);
    } else {
      console.log("Click was outside the image.");
    }
  };

  return (
    <div className="App">
      <h1>Where Is Charlie?</h1>
      <button onClick={() => setZoomEnabled(!zoomEnabled)}>
        {zoomEnabled ? "Disable Zoom" : "Enable Zoom"}
      </button>
      <div>
        {image ? (
          <div style={{ position: "relative" }}>
            <img
              ref={imageRef}
              onClick={handleClick}
              onMouseMove={handleMouseMove}
              onDragStart={(e) => e.preventDefault()}
              src={image}
              alt="Where is Charlie?"
              style={{
                display: "block",
                width: "100%",
              }}
            />
            {zoomEnabled && (
              <div
                className="zoom-circle"
                style={{
                  top: cursorPos.y - zoomRadius,
                  left: cursorPos.x - zoomRadius,
                  width: zoomDiameter,
                  height: zoomDiameter,
                  backgroundImage: `url(${image})`,
                  backgroundPosition: `-${cursorPos.x * 2 - zoomRadius}px -${
                    cursorPos.y * 2 - zoomRadius
                  }px`,
                  backgroundSize: `${imageRef.current?.width! * 2}px ${
                    imageRef.current?.height! * 2
                  }px`,
                }}
              />
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default WhereIsCharlie;
