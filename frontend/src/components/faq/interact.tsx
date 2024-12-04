import React from "react";
import { Box, Flex } from "@radix-ui/themes";

// Define the type for the sprite prop
interface InteractProps {
  sprite: string; // Path to the sprite image
}

export const Interact: React.FC<InteractProps> = ({ sprite }) => {
  return (
    <Box >
      <Flex
        style={{
          zIndex: "1",
          position: "absolute",
          top: "60%",
          padding: "1rem",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem", // Space between items
        }}
      >
        <img
          className="interact"
          src={sprite}
          alt="Sprite"
          style={{
            width: "200px", // Set desired dimensions
            height: "200px",
            objectFit: "contain", // Ensure the image fits within the box
          }}
        />
      </Flex>
    </Box>
  );
};
