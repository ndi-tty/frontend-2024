import React, { useEffect, useRef, useState } from "react";
import { Box, Flex } from "@radix-ui/themes";
import { Popup } from "./game-popup";

interface InteractProps {
  sprite: string;
  coords: { x: number; y: number };
  popupText?: string;
  popupImage?: string; // Optional image source for the popup
}

export const Interact: React.FC<InteractProps> = ({ sprite, coords, popupText, popupImage }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null); // Ref for the component container

  const handleClickOutside = (event: MouseEvent) => {
    // Close the popup if the click is outside the container
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsPopupOpen(false);
    }
  };

  useEffect(() => {
    // Attach and clean up the click listener
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleImageClick = () => {
    setIsPopupOpen(true);
  };

  return (
    <Box
      ref={containerRef} // Attach the ref to the component container
      style={{ position: "relative", width: "80vw", height: "auto" }}
    >
      <Flex
        style={{
          position: "absolute",
          top: "50%", // Center vertically relative to the container
          left: "50%", // Center horizontally relative to the container
          transform: `translate(${coords.x}%, ${coords.y}%)`, // Adjust positioning to the exact center
          padding: "1rem",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <img
          className="interact"
          src={sprite}
          alt="Sprite"
          style={{
            width: "10vw", // Use a responsive unit for scaling
            maxWidth: "200px", // Cap the size
            height: "auto",
            objectFit: "contain",
          }}
          onClick={handleImageClick} // Handle the click event to show the popup
          onError={(e) => {
            console.error("Error loading image:", e.target);
          }}
        />
      </Flex>
      {isPopupOpen && <Popup text={popupText} imageSrc={popupImage} />}
    </Box>
  );
};
