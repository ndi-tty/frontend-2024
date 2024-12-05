import React from "react";
import { Box, Flex } from "@radix-ui/themes";
import Bar from "../assets/faq/bar.png";
import Pirate1 from "../assets/faq/pirate1.png";
import PirateTextSprite from "../assets/faq/pirate-text-sprite.png";
import PirateTextHead from "../assets/faq/pirate-text-head.png";
import "./css/faq.css";
import { Interact } from "../components/faq/interact";

const FAQ: React.FC = () => {
  
  return (
    <Box className="main" style={{ position: "relative", overflow: "hidden" }}>
      <Flex
        gap="4"
        wrap="wrap"
        direction="column"
        style={{ position: "relative", width: "100%", height: "auto" }}
      >
        <img
          src={Bar}
          alt="logo"
          style={{
            position: "relative",
            zIndex: "0",
            width: "100%",
            objectFit: "contain",
          }}
        />
        <Interact sprite={Pirate1} coords={{x: -300, y: -100}} popupText="Hey young pirate" isUsingPrompt={false} />
        <Interact sprite={PirateTextSprite} coords={{x: -100, y: -120}} popupText="Captain Smirk: So you have some harder questions for me young kid ?"  popupImage={PirateTextHead} isUsingPrompt={true}/>
        {/* <Interact sprite={Pirate1} coords={{x: -300, y: -100}} /> */}
      </Flex>
    </Box>
  );
};

export default FAQ;
