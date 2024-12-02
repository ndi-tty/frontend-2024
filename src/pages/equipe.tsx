import React from "react";
import { Box, Flex, Card, Avatar, Text, Heading } from "@radix-ui/themes";
import { Link } from "react-router-dom";

const teamMembers = [
  {
    name: "Charley",
    role: "Developer",

    github: "https://github.com/charley",
    linkedin: "https://linkedin.com/in/charley",
  },
  {
    name: "Thomas",
    role: "Developer",

    github: "https://github.com/thomas",
    linkedin: "https://linkedin.com/in/thomas",
  },
  {
    name: "Sylvain",
    role: "Developer",
    github: "https://github.com/sylvain",
    linkedin: "https://linkedin.com/in/sylvain",
  },
  {
    name: "Martin",
    role: "Developer",
    github: "https://github.com/martin",
    linkedin: "https://linkedin.com/in/martin",
  },
];

const Equipe: React.FC = () => {
  return (
    <Box style={{ padding: "1rem" }}>
      <Heading as="h1">Notre équipe</Heading>
      <Text as="div" size="2" color="gray" style={{ marginBottom: "1rem" }}>
        Découvrez les membres de notre équipe
      </Text>
      <Flex gap="4" wrap="wrap" direction="column">
        {teamMembers.map((member) => (
          <Box key={member.name} maxWidth="300px" width="100%">
            <Card>
              <Flex gap="3" align="center">
                <Box>
                  <Heading as="h2" weight="bold">
                    {member.name}
                  </Heading>
                  <Text as="div" size="2" color="gray">
                    {member.role}
                  </Text>
                  <Text as="div" size="2" color="gray">
                    Polytech Montpellier
                  </Text>
                  <Link
                    to={member.github}
                    style={{
                      display: "block",
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    GitHub
                  </Link>
                  <Link
                    to={member.linkedin}
                    style={{
                      display: "block",
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    LinkedIn
                  </Link>
                </Box>
              </Flex>
            </Card>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default Equipe;
