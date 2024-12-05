import React, { useEffect } from "react";
import { Card, Flex, Heading, Box, Progress } from "@radix-ui/themes";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import charlieImage from "../assets/charlie.png";
import flappyBirdImage from "../assets/flappy_bird_logo.png";
import FlappyBird from "../components/games/flappy-bird";
import WhereIsCharlie from "../components/games/where-is-charlie";

export async function loader({}: any) {
  const totalValidatedResponse = await fetch(
    "http://localhost:8080/captcha/validated"
  );
  const totalValidated = await totalValidatedResponse.json();
  return totalValidated;
}

const CaptchaPage: React.FC = () => {
  const [selectedCaptcha, setSelectedCaptcha] = React.useState<string>("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const totalValidated = useLoaderData() as any;

  useEffect(() => {
    const gameParam = searchParams.get("game");
    console.log("gameParam", gameParam);
    if (gameParam) {
      setSelectedCaptcha(gameParam);
    } else {
      setSelectedCaptcha("");
    }
  }, [searchParams]);

  const handleSelect = (captcha: string) => {
    localStorage.setItem("gameFlappyStarted", "false");
    navigate(`?game=${captcha}`);
  };

  return (
    <>
      {selectedCaptcha === "" && (
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "var(--accent-1)",
            height: "100%",
            flexDirection: "column",
          }}
        >
          <Heading style={{ marginBottom: "var(--space-4)" }}>
            Selectioner votre CAPTCHA
          </Heading>
          <p style={{ marginTop: "var(--space-2)" }}>
            VOUS DEVEZ RÉSOUDRE LES DEUX <strong>CAPTCHAS</strong> POUR ACCÉDER
            À LA RESSOURCE DEMANDÉE
          </p>
          <Card
            style={{
              padding: "var(--space-5)",
              borderRadius: "var(--radius-4)",
              boxShadow: "var(--shadow-5)",
              backgroundColor: "white",
              maxWidth: "600px",
              textAlign: "center",
              marginBottom: "var(--space-4)",
            }}
          >
            <Flex justify="center" gap="var(--space-4)">
              <Box
                onClick={() => handleSelect("flappy-bird")}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  padding: 0,
                  width: "45%",
                  position: "relative",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <img
                  src={flappyBirdImage}
                  alt="Flappy Bird"
                  style={{
                    width: "100%",
                    borderRadius: "var(--radius-3)",
                  }}
                />
              </Box>
              <Box
                onClick={() => handleSelect("ou-est-charlie")}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  padding: "20px",
                  width: "45%",
                  position: "relative",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <img
                  src={charlieImage}
                  alt="Où est Charlie ?"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    borderRadius: "var(--radius-3)",
                  }}
                />
              </Box>
            </Flex>
          </Card>
          <Box maxWidth="300px" style={{ width: "100%", textAlign: "center" }}>
            <p style={{ marginTop: "var(--space-2)", fontSize: 25 }}>0/2</p>
            <Progress value={0} max={100} />
          </Box>
        </Box>
      )}
      {selectedCaptcha === "flappy-bird" && <FlappyBird />}
      {selectedCaptcha === "ou-est-charlie" && <WhereIsCharlie />}
    </>
  );
};

export default CaptchaPage;
