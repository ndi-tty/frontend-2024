import { blackA, gray, mauve, green, slate } from "@radix-ui/colors";
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Flex, Box, Heading, Text, Card, Avatar } from "@radix-ui/themes";
import * as Switch from "@radix-ui/react-switch";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import ReactLogo from "../../assets/react.svg";
import NuitInfoLogo from "../../assets/nuit-info.svg";

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
            width: "200px",
            padding: "1rem",
            backgroundColor: theme.navBackground,
          }}
        >
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <NavLink
                to="/"
                style={{
                  color: theme.linkColor,
                  textDecoration: "none",
                  display: "block",
                  padding: "0.5rem 0",
                }}
              >
                Accueil
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                style={{
                  color: theme.linkColor,
                  textDecoration: "none",
                  display: "block",
                  padding: "0.5rem 0",
                }}
              >
                Monkey Island (FAQ)
              </NavLink>
              <NavLink
                to="/team"
                style={{
                  color: theme.linkColor,
                  textDecoration: "none",
                  display: "block",
                  padding: "0.5rem 0",
                }}
              >
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
        </Flex>
      </Box>
    </Flex>
  );
};

export default RootLayout;
