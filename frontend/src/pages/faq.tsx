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
import MonkeyHead from "../assets/faq/monkey-head.png";
import "./css/faq.css";
import { Interact } from "../components/faq/interact";
export interface Detail {
  title: string;
  description: string;
}


const FAQ: React.FC = () => {
  
const details: Detail[][] = [[
  {
    title: "Section 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ni",
  },
  {
    title: "Section 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ni",
  },
],
[
  {
    title: "Section 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ni",
  },
  {
    title: "Section 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ni",
  },
],
[
  {
    title: "Section 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ni",
  },
  {
    title: "Section 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ni",
  },
],
[
  {
    title: "Section 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ni",
  },
  {
    title: "Section 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ni",
  },
]];


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
        <Interact sprite={Pirate1} coords={{x:400, y: -240}} popupText="Shopkeeper: Hey young pirate" isUsingPrompt={false} size="5" title="Shopkeeper" details={details[0]} />
        <Interact sprite={Monkey} coords={{x: -300, y: -570}} popupImage={MonkeyHead} popupText="Three headed Monkey: Hey young pirate" isUsingPrompt={false}  size="4"title="Three headed monkey" details={details[1]}/>
        <Interact sprite={Pirate6} popupImage={Pirate6Head} coords={{x: -320, y: -140}} popupText="Elaine Marley: Hey young pirate" isUsingPrompt={false}  size="5"title="Elaine Marley" details={details[2]}/>
        <Interact sprite={Pirate8} popupImage={Pirate8Head} coords={{x: 440, y: -130}} popupText="Elaine Marley: Hey young pirate" isUsingPrompt={false}  size="6"title="Carla" details={details[3]}/>
        <Interact sprite={PirateTextSprite} coords={{x: 30, y: -175}} popupText="Captain Smirk: So you have some harder questions for me young kid ?"  popupImage={PirateTextHead} isUsingPrompt={true}  size="7"title="Captain Smirk" details={details[4]}/>
        {/* <Interact sprite={Pirate1} coords={{x: -300, y: -100}} /> */}
      </Flex>
    </Box>
  );
};

export default FAQ;
