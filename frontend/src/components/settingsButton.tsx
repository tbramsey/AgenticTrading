import React, { useState, useRef, useEffect } from "react";

interface SettingsButtonProps {
  onApply: (diversification: number, risk: number, sectors: string[]) => void;
  defaultDiver?: number;
  defaultRisk?: number;
}

const defaultSectors = [
  "INDUSTRIALS",
  "HEALTHCARE",
  "TECHNOLOGY",
  "UTILITIES",
  "FINANCIAL SERVICES",
  "BASIC MATERIALS",
  "CONSUMER CYCLICAL",
  "REAL ESTATE",
  "COMMUNICATION SERVICES",
  "CONSUMER DEFENSIVE",
  "ENERGY",
];

const SettingsButton: React.FC<SettingsButtonProps> = ({
  onApply,
  defaultDiver = 50,
  defaultRisk = 50,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tempRisk, setTempRisk] = useState<number>(defaultRisk);
  const [tempDiver, setTempDiver] = useState<number>(defaultDiver);
  const [tempSectors, setTempSectors] = useState<string[]>([...defaultSectors]);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSectorChange = (sector: string) => {
    setTempSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
  };

  const handleApply = () => {
    onApply(tempDiver, tempRisk, tempSectors);
    setIsOpen(false);
  };

  // --- Icons ---
  const GearIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  );

  // --- Styles ---
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: "-10px",  // Changed from 'bottom' to 'top'
    right: "20px",
    zIndex: 50,
    fontFamily: "'Segoe UI', sans-serif",
  };

  const toggleBtnStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: isOpen ? "#334155" : "#4f46e5", 
    color: "white",
    cursor: "pointer",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: "all 0.2s ease",
    transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
  };

  const popoverStyle: React.CSSProperties = {
    position: "absolute",
    top: "60px", // Anchors to the top (pushes it down)
    right: 0,
    backgroundColor: "#1e293b", 
    border: "1px solid #334155",
    borderRadius: "12px",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    padding: "20px",
    width: "320px",
    color: "#f8fafc",
    animation: "fadeIn 0.2s ease-out",
  };

  const labelStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    fontWeight: 600,
    color: "#94a3b8",
    marginBottom: "8px",
  };

  const rangeStyle: React.CSSProperties = {
    width: "100%",
    height: "6px",
    background: "#334155",
    borderRadius: "3px",
    appearance: "none",
    outline: "none",
    marginBottom: "20px",
    cursor: "pointer",
  };

  const chipGridStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "20px",
    maxHeight: "200px",
    overflowY: "auto",
    paddingRight: "5px",
  };

  const actionRowStyle: React.CSSProperties = {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    borderTop: "1px solid #334155",
    paddingTop: "15px",
  };

  const btnBase: React.CSSProperties = {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "6px",
    border: "none",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "opacity 0.2s",
  };

  return (
    <div style={containerStyle} ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} style={toggleBtnStyle}>
        <GearIcon />
      </button>

      {isOpen && (
        <div style={popoverStyle}>
          <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", fontWeight: "bold" }}>Portfolio Settings</h3>

          {/* Diversification */}
          <div style={labelStyle}>
            <span>Diversification</span>
            <span style={{ color: "#6366f1" }}>{tempDiver}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={tempDiver}
            onChange={(e) => setTempDiver(Number(e.target.value))}
            style={rangeStyle}
          />

          {/* Risk */}
          <div style={labelStyle}>
            <span>Risk Tolerance</span>
            <span style={{ color: "#f43f5e" }}>{tempRisk}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={tempRisk}
            onChange={(e) => setTempRisk(Number(e.target.value))}
            style={rangeStyle}
          />

          {/* Sectors */}
          <div style={labelStyle}>
            <span>Active Sectors</span>
            <span style={{ fontSize: "12px" }}>{tempSectors.length} selected</span>
          </div>
          <div style={chipGridStyle}>
            {defaultSectors.map((sector) => {
              const isSelected = tempSectors.includes(sector);
              return (
                <button
                  key={sector}
                  onClick={() => handleSectorChange(sector)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "20px",
                    border: "none",
                    fontSize: "11px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    backgroundColor: isSelected ? "#4f46e5" : "#334155",
                    color: isSelected ? "white" : "#94a3b8",
                    transition: "background 0.2s",
                  }}
                >
                  {sector.replace("_", " ")}
                </button>
              );
            })}
          </div>

          <div style={actionRowStyle}>
            <button
              onClick={() => setIsOpen(false)}
              style={{ ...btnBase, backgroundColor: "#334155", color: "#cbd5e1" }}
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              style={{ ...btnBase, backgroundColor: "#4ade80", color: "#064e3b" }}
            >
              Apply Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsButton;