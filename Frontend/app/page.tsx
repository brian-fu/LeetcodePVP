"use client";

import { useState, useEffect } from "react";
import HostDashboardModal from "./components/HostDashboardModal";
import { setCookie } from "cookies-next";
import { setGameCodeCookie, setUsernameCookie } from './utils/cookies';

const Home = () => {
  const [username, setUsername] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameCode, setGameCode] = useState("");
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const checkGameStatus = async () => {
      try {
        const response = await fetch("/api/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ game_code: "any" }), // The backend currently doesn't use this
        });

        const data = await response.json();
        
        if (data.success && data.data.game_state === "STARTED") {
          window.location.href = "/submit";
        }
      } catch (error) {
        console.error("Error checking game status:", error);
      }
    };

    if (isPolling) {
      pollInterval = setInterval(checkGameStatus, 1000); // Poll every second
    }

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [isPolling]);

  const handleHostClick = async () => {
    if (!username) {
      alert("Please enter a username");
      return;
    }

    console.log("Setting username:", username);
    // setUsernameCookie(username);
    setCookie("username", username);
    setIsButtonClicked(true);

    try {
      const response = await fetch("/api/host", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      console.log("Response from /api/host:", data);

      if (response.ok) {
        setGameCode(data.game_code);
        setGameCodeCookie(data.game_code);
        setIsModalOpen(true);
      } else {
        alert("Failed to create game");
      }
    } catch (error) {
      console.error("Error creating game:", error);
      alert("Failed to create game");
    } finally {
      setIsButtonClicked(false);
    }
  };

  const handleJoinClick = async () => {
    if (!username) {
      alert("Please enter a username");
      return;
    }

    setUsernameCookie(username);
    setIsButtonClicked(true);

    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      console.log("Response from /api/join:", data);

      if (response.ok) {
        setIsPolling(true);
        if (data.data?.game_code) {
          setGameCodeCookie(data.data.game_code);
        }
        alert("Successfully joined the game");
      } else {
        alert(data.error || "Failed to join the game");
      }
    } catch (error) {
      console.error("Error joining game:", error);
      alert("Failed to join game");
    } finally {
      setIsButtonClicked(false);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#0d0d0d",
        color: "#00ff00",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ 
        position: "absolute",
        top: "10%",
        fontSize: '96px', 
        marginBottom: '20px', 
        textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00' 
      }}>
        Leetcode PVP
      </h1>
      <div
        style={{
          position: 'absolute',
          top: '40%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: '15px',
            fontSize: '20px',
            borderRadius: '5px',
            border: 'none',
            outline: 'none',
            textAlign: 'center',
            marginBottom: '10px',
            width: '240px',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <button
            style={{
              padding: "15px 40px",
              fontSize: "24px",
              fontWeight: "bold",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s, transform 0.3s",
              marginRight: '10px',
            }}
            onClick={handleJoinClick}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#0056b3")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#007bff")
            }
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Join
          </button>
          <button
            style={{
              padding: "15px 40px",
              fontSize: "24px",
              fontWeight: "bold",
              backgroundColor: isButtonClicked ? "#218838" : "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s, transform 0.3s",
            }}
            onClick={handleHostClick}
            onMouseEnter={(e) =>
              !isButtonClicked && (e.currentTarget.style.backgroundColor = "#218838")
            }
            onMouseLeave={(e) =>
              !isButtonClicked && (e.currentTarget.style.backgroundColor = "#28a745")
            }
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Host
          </button>
        </div>
      </div>
      <HostDashboardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        gameCode={gameCode}
      />
    </div>
  );
};

export default Home;