import React, { useEffect, useMemo } from "react";
import { Card, Flex, Heading, Box, Progress, Badge } from "@radix-ui/themes";
import { useNavigate, useSearchParams } from "react-router-dom";
import charlieImage from "../assets/charlie.png";
import flappyBirdImage from "../assets/flappy_bird_logo.png";
import FlappyBird from "../components/games/flappy-bird";
import WhereIsCharlie from "../components/games/where-is-charlie";
import { io, Socket } from "socket.io-client";

const CaptchaPage: React.FC = () => {
  const [selectedCaptcha, setSelectedCaptcha] = React.useState<string>("");
  const [searchParams] = useSearchParams();
  const [isFlappyBirdValidated, setIsFlappyBirdValidated] =
    React.useState(false);
  const navigate = useNavigate();
  const socketRef = React.useRef<Socket | null>(null);

  const totalCaptchas = useMemo(() => {
    return isFlappyBirdValidated ? 1 : 0;
  }, [isFlappyBirdValidated]);

  useEffect(() => {
    const gameParam = searchParams.get("game");

    if (gameParam === "flappy-bird" || gameParam === "ou-est-charlie") {
      setSelectedCaptcha(gameParam);
    } else {
      // !TODO: Add same logic to flappy-bird.tsx
      const newSocket = io("http://127.0.0.1:8080/finger-print");
      socketRef.current = newSocket;
      socketRef.current.on("FLAPPY_BIRD_VALIDATED", (message: any) => {
        setIsFlappyBirdValidated(message.message);
      });

      setSelectedCaptcha("");

      return () => {
        newSocket.disconnect();
      };
    }
  }, [searchParams]);

  const handleSelect = (captcha: string) => {
    localStorage.setItem("gameFlappyStarted", "false");
    socketRef.current?.disconnect();
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
                onClick={() =>
                  isFlappyBirdValidated ? null : handleSelect("flappy-bird")
                }
                style={{
                  border: "none",
                  background: "none",
                  cursor: isFlappyBirdValidated ? "not-allowed" : "pointer",
                  padding: 0,
                  width: "45%",
                  position: "relative",
                  transition: isFlappyBirdValidated
                    ? "none"
                    : "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = isFlappyBirdValidated
                    ? "none"
                    : "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = isFlappyBirdValidated
                    ? "none"
                    : "scale(1)")
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
                {isFlappyBirdValidated && (
                  <Badge color="green" size="3" style={{ padding: "5px 25px" }}>
                    Validé
                  </Badge>
                )}
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
            <p style={{ fontSize: 25 }}>{totalCaptchas} / 2 </p>
            <Progress value={isFlappyBirdValidated ? 50 : 0} />
          </Box>
        </Box>
      )}
      {selectedCaptcha === "flappy-bird" && <FlappyBird />}
      {selectedCaptcha === "ou-est-charlie" && <WhereIsCharlie />}
    </>
  );
};

export default CaptchaPage;
