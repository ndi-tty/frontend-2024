import React from "react";
import { Box } from "@radix-ui/themes";

interface PopupProps {
  text?: string;
  imageSrc?: string; // Optional image source
}

export const Popup: React.FC<PopupProps> = ({ text, imageSrc }) => {
  return (
    <Box
      style={{
        position: "absolute", // Makes the popup appear fixed on the screen
        top: "20%", // Center vertically on the screen
        left: "50%", // Center horizontally on the screen
        transform: `translate(-50%, ${imageSrc ? -200: -300}%)`, // Correct the positioning after centering
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent dark background
        padding: "2rem",
        borderRadius: "8px", // Optional: Rounded corners for the popup
        width: "60vw", // Adjust the width as needed
        display: "flex", // Flexbox to arrange text and image side by side
        alignItems: "center",
        gap: "1rem", // Space between the text and image
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Optional shadow for the popup
        zIndex: 1000, // Ensure the popup appears above other content
      }}
    >
      <Box style={{ flex: 1, color: "#fff", fontSize: "1.2rem" }}>
        <p>{text}</p>
      </Box>

      {/* Space for image on the right */}
      <Box
        style={{
          flexShrink: 0, // Prevent the image container from shrinking
          width: "200px", // Adjust the image container width
          height: "auto",
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Popup Image"
            style={{
              width: "100%", // Make the image fill the container
              height: "auto",
              objectFit: "cover", // Ensure the image covers the space without distortion
            }}
          />
        ) : (
          <div
            style={{
              backgroundColor: "#ccc", // Placeholder background color for when there's no image
              width: "100%",
              height: "100%",
            }}
          >
            {/* Placeholder content */}
          </div>
        )}
      </Box>
    </Box>
  );
};
