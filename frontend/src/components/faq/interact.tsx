import React, { useEffect, useRef, useState } from "react";
import { Box, Flex } from "@radix-ui/themes";
import { Popup } from "./game-popup";
import { PromptPopup } from "./prompt-popup";
import { Detail } from "../../pages/faq";

interface InteractProps {
  sprite: string;
  coords: { x: number; y: number };
  popupText?: string;
  popupImage?: string; // Optional image source for the popup
  isUsingPrompt?: boolean;
  size: string;
  title: string;
  details: Detail[]
}

export const Interact: React.FC<InteractProps> = ({
  sprite,
  coords,
  popupText,
  popupImage,
  isUsingPrompt,
  size,
  title,
  details, // New prop
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsPopupOpen(false);
    }
  };

  useEffect(() => {
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
      ref={containerRef}
      style={{ position: "relative", width: "80vw", height: "auto" }}
    >
      <Flex
        style={{
          flexDirection: "column",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(${coords.x}%, ${coords.y}%)`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h3 style={{ color: "white" }}>{title}</h3>
        <img
          className="interact"
          src={sprite}
          alt="Sprite"
          style={{
            width: `${size}vw`,
            maxWidth: "200px",
            height: "auto",
            objectFit: "contain",
          }}
          onClick={handleImageClick}
          onError={(e) => {
            console.error("Error loading image:", e.target);
          }}
        />
      </Flex>
      {isPopupOpen && (
        isUsingPrompt ? (
          <PromptPopup text={popupText} imageSrc={popupImage} />
        ) : (
          <Popup text={popupText} imageSrc={popupImage} details={details} />
        )
      )}
    </Box>
  );
};
