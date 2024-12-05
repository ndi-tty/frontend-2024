import React from "react";
import { Box, Flex } from "@radix-ui/themes";
import Bar from "../assets/faq/bar.png";
import Pirate1 from "../assets/faq/pirate1.png";
import PirateTextSprite from "../assets/faq/pirate-text-sprite.png";
import PirateTextHead from "../assets/faq/pirate-text-head.png";
import Pirate6Head from "../assets/faq/pirate6-head.png";
import Pirate6 from "../assets/faq/pirate6.png";
import Pirate8Head from "../assets/faq/pirate8-head.png";
import Pirate8 from "../assets/faq/pirate8.png";
import Monkey from "../assets/faq/monkey-3.gif";
import "./css/faq.css";
import { Interact } from "../components/faq/interact";

const FAQ: React.FC = () => {
  
  return (
    <Box className="main" style={{ position: "relative", overflow: "hidden" }}>
      <h1 style={{marginBottom: 0, marginTop: 0}}>Welcome to the Great Pirate Island themed FAQ !</h1>
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
        <Interact sprite={Pirate1} coords={{x: 350, y: -270}} popupText="Hey young pirate" isUsingPrompt={false} size="5" />
        <Interact sprite={Monkey} coords={{x: -500, y: -620}} popupText="Three headed Monkey: Hey young pirate" isUsingPrompt={false}  size="4"/>
        <Interact sprite={Pirate6} popupImage={Pirate6Head} coords={{x: -300, y: -150}} popupText="Elaine Marley: Hey young pirate" isUsingPrompt={false}  size="5"/>
        <Interact sprite={Pirate8} popupImage={Pirate8Head} coords={{x: 400, y: -150}} popupText="Elaine Marley: Hey young pirate" isUsingPrompt={false}  size="6"/>
        <Interact sprite={PirateTextSprite} coords={{x: 30, y: -180}} popupText="Captain Smirk: So you have some harder questions for me young kid ?"  popupImage={PirateTextHead} isUsingPrompt={true}  size="7"/>
        {/* <Interact sprite={Pirate1} coords={{x: -300, y: -100}} /> */}
      </Flex>
    </Box>
  );
};

export default FAQ;
