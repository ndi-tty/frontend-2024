import { blackA, gray, mauve, green, slate } from "@radix-ui/colors";
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Flex, Box, Heading, Text, Separator } from "@radix-ui/themes";
import * as Switch from "@radix-ui/react-switch";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import ReactLogo from "../../assets/react.svg";
import NuitInfoLogo from "../../assets/nuit-info.svg";
import { FaHeart } from "react-icons/fa";

const themes = {
  dark: {
    backgroundColor: slate.slate12,
    headerBackground: green.green9,
    navBackground: slate.slate11,
    color: gray.gray1,
    linkColor: green.green5,
    IconBackground: gray.gray1,
  },
  light: {
    backgroundColor: gray.gray1,
    headerBackground: green.green7,
    navBackground: mauve.mauve5,
    color: blackA.blackA12,
    linkColor: green.green11,
    IconBackground: blackA.blackA2,
  },
};

const getSwitchStyles = (theme: typeof themes.light | typeof themes.dark) => ({
  root: {
    all: "unset",
    backgroundColor: theme.linkColor,
    borderRadius: "9999px",
    width: "45px",
    height: "30px",
    position: "relative",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: theme === themes.dark ? "flex-end" : "flex-start",
    padding: "0 2px",
  },
  thumb: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    backgroundColor: theme.IconBackground,
    borderRadius: "9999px",
    transition: "transform 100ms",
  },
});

const navLinkStyles = {
  color: "inherit",
  textDecoration: "none",
  display: "block",
  padding: "0.5rem",
};

const RootLayout: React.FC = () => {
  const [theme, setTheme] = React.useState(themes.light);
  const switchStyles = getSwitchStyles(theme);

  return (
    <Flex
      direction="column"
      style={{ height: "100vh", backgroundColor: theme.backgroundColor }}
    >
      <Box
        style={{
          padding: "2rem",
          backgroundColor: theme.headerBackground,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Flex align="center">
          <img
            src={ReactLogo}
            alt="logo"
            style={{ width: "40px", marginRight: "10px" }}
          />
          <Heading style={{ color: "white" }} as="h1">
            Nuit info 2024
          </Heading>
        </Flex>
        <Switch.Root
          checked={theme === themes.dark}
          onCheckedChange={() =>
            setTheme(theme === themes.light ? themes.dark : themes.light)
          }
          style={switchStyles.root as React.CSSProperties}
        >
          <Switch.Thumb style={switchStyles.thumb as React.CSSProperties}>
            {theme === themes.dark ? (
              <MoonIcon color={theme.headerBackground} />
            ) : (
              <SunIcon color={theme.headerBackground} />
            )}
          </Switch.Thumb>
        </Switch.Root>
      </Box>
      <Flex direction="row" style={{ flex: 1 }}>
        <Box
          style={{
            width: "300px",
            padding: "1rem",
            backgroundColor: theme.navBackground,
          }}
        >
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <NavLink to="/" style={navLinkStyles as React.CSSProperties}>
                Accueil
              </NavLink>
            </li>

            <li>
              <NavLink to="/about" style={navLinkStyles as React.CSSProperties}>
                Monkey Island (FAQ)
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/flappy-bird"
                style={navLinkStyles as React.CSSProperties}
              >
                CAPTCHA (Flappy Bird)
              </NavLink>
            </li>
            <Separator orientation="horizontal" size="4" />

            <li>
              <NavLink to="/team" style={navLinkStyles as React.CSSProperties}>
                L'équipe
              </NavLink>
            </li>
          </ul>
        </Box>
        <Box
          style={{
            flex: 1,
            padding: "1rem",
            backgroundColor: "white",
          }}
        >
          <Outlet />
        </Box>
      </Flex>
      <Box style={{ padding: "1rem", backgroundColor: theme.headerBackground }}>
        <Flex justify="between" align="center">
          <Flex align="center">
            <img
              src={NuitInfoLogo}
              alt="logo"
              style={{ width: "40px", marginRight: "10px" }}
            />
            <Heading as="h2" style={{ color: "white" }}>
              Nuit de l'info 2024
            </Heading>
          </Flex>
          <Text as="div" style={{ color: "white", textAlign: "right" }}>
            Made with {<FaHeart color="red" size={15} />} by{" "}
            {<NavLink to="/team">TTY team</NavLink>}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

export default RootLayout;
