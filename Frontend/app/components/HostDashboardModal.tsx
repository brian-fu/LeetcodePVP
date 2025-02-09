import React, { useEffect, useState, useRef } from "react";
import { getCookie } from "cookies-next";
import { clearGameCodeCookie, getUsernameFromCookie } from "../utils/cookies";

interface HostDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameCode: string;
}

const HostDashboardModal: React.FC<HostDashboardModalProps> = ({ isOpen, onClose, gameCode }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 300); // Wait for animation to complete before actual close
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  };

  const handleStartClick = async () => {
    try {
      const username = getUsernameFromCookie();
      if (!username) {
        alert('No username found. Please try again.');
        return;
      }

      const response = await fetch("/api/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      console.log("Response from /api/start:", data);

      if (response.ok) {
        window.location.href = "/submit";
      } else {
        alert(data.error || "Failed to start the game");
      }
    } catch (error) {
      console.error("Error starting the game:", error);
      alert("Failed to start the game");
    }
  };

  const handleEndClick = async () => {
    try {
      const username = getCookie("username");
      console.log("Username from cookie:", username);

      if (!username) {
        alert('No username found. Please try again.');
        return;
      }

      console.log("Making request to /api/stop with username:", username);
      
      const response = await fetch("/api/stop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          "username": username.toString()
        }),
      });

      const data = await response.json();
      console.log("Full response from /api/stop:", data); // Debug log

      if (response.ok) {
        clearGameCodeCookie();
        onClose();
      } else {
        alert(data.error || "Failed to stop the game");
      }
    } catch (error) {
      console.error("Error stopping the game:", error);
      alert("Failed to stop the game");
    }
  };

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      ref={overlayRef}
      className={`overlay ${isOpen ? 'overlayVisible' : 'overlayHidden'}`} 
      style={styles.overlay}
      onClick={handleOverlayClick}
    >
      <div className={`modal ${isOpen ? 'modalOpen' : 'modalClose'}`} style={styles.modal}>
        <h2 style={styles.title}>Host Dashboard</h2>
        <p style={styles.gameCode}>Game Code: {gameCode}</p>
        <button style={styles.startButton} onClick={handleStartClick}>
          Start
        </button>
        <button style={styles.endButton} onClick={handleEndClick}>
          End
        </button>
      </div>
      <style jsx global>{`
        .overlay {
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
          pointer-events: none;
        }
        
        .overlayVisible {
          opacity: 1;
          pointer-events: all;
        }
        
        .overlayHidden {
          opacity: 0;
          pointer-events: none;
        }
        
        .modal {
          transform: translateY(40px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .modalOpen {
          transform: translateY(0);
          opacity: 1;
        }
        
        .modalClose {
          transform: translateY(40px);
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#0d0d0d",
    padding: "20px",
    borderRadius: "8px",
    width: "600px",
    height: "400px",
    textAlign: "center" as "center",
    position: "relative" as "relative",
    zIndex: 1001,
  },
  title: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#ffffff",
  },
  gameCode: {
    fontSize: "18px",
    marginBottom: "20px",
    color: "#ffffff",
  },
  startButton: {
    position: "absolute" as "absolute",
    bottom: "20px",
    right: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  endButton: {
    position: "absolute" as "absolute",
    bottom: "20px",
    left: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default HostDashboardModal;