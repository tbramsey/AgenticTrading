import React, { useState } from "react";

const LaunchButton: React.FC = () => {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleApply = async () => {
    setIsLoading(true);
    setStatus("Initializing launch sequence...");

    try {
      const res = await fetch("http://127.0.0.1:5000/portfolio/launch");
      const data = await res.json();

      if (res.ok) {
        setStatus("✅ Portfolio launched successfully");
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setStatus("❌ Failed to connect to backend");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Styles ---
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "20vh", // Takes full viewport height
    backgroundColor: "transparent", // Dark slate background
    color: "white",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "15px 40px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "white",
    background: isLoading
      ? "#475569" // Grey when loading
      : isHovered
      ? "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" // Lighter gradient on hover
      : "linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)", // Purple/Indigo gradient
    border: "none",
    borderRadius: "30px",
    cursor: isLoading ? "not-allowed" : "pointer",
    boxShadow: isHovered
      ? "0 10px 25px -5px rgba(147, 51, 234, 0.5)" // Glow effect
      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    transform: isHovered && !isLoading ? "translateY(-2px)" : "translateY(0)",
    outline: "none",
  };

  const statusStyle: React.CSSProperties = {
    marginTop: "20px",
    minHeight: "24px", // Prevents layout jump
    fontSize: "16px",
    color: status.includes("Error") || status.includes("Failed") 
      ? "#f87171" // Red for error
      : status.includes("✅") 
      ? "#4ade80" // Green for success
      : "#94a3b8", // Grey for neutral
    fontWeight: 500,
    opacity: status ? 1 : 0,
    transition: "opacity 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={handleApply}
        disabled={isLoading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={buttonStyle}
      >
        {isLoading ? (
          <span>🚀 Launching...</span>
        ) : (
          <span>Launch Portfolio</span>
        )}
      </button>


    </div>
  );
};

export default LaunchButton;