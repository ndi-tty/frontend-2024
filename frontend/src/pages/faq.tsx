import React from "react";
import { Box, Flex } from "@radix-ui/themes";
import Bar from "../assets/faq/bar.png";
import Pirate1 from "../assets/faq/pirate1.png";
import "./css/faq.css";
import { Interact } from "../components/faq/interact";

const FAQ: React.FC = () => {
  return (
    <Box className="main">
      <Flex gap="4" wrap="wrap" direction="column">
        <img
          src={Bar}
          alt="logo"
          style={{ position: "absolute", zIndex: "1", width: "80vw", marginRight: "10px" }}
        />
        <Interact sprite={Pirate1} />
      </Flex>
    </Box>
  );
};

export default FAQ;
