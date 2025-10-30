import React, { useState } from "react";

const SettingsButton = ({ onApply, defaultDiver = 50, defaultRisk = 50 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRisk, setTempRisk] = useState(defaultRisk);
  const [tempDiver, setTempDiver] = useState(defaultDiver);
  const [tempSectors, setTempSectors] = useState([
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
      "ENERGY"
  ]);

  const handleSectorChange = (sector) => {
    setTempSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector) 
        : [...prev, sector]
    );
  };

  const handleApply = () => {
    if (typeof onApply === "function") {
      onApply(tempDiver, tempRisk, tempSectors);
    }
    setIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
            position: "absolute",
            bottom: "5px",
            right: 0,
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
        }}
      />
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "15px",
            zIndex: 1000,
            minWidth: "300px",
          }}
        >
          <label style={{ display: "block", marginBottom: "6px", color: "black" }}>
            Diversification: {tempDiver}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={tempDiver}
            onChange={(e) => setTempDiver(Number(e.target.value))}
            style={{ width: "100%" }}
          />

          <label style={{ display: "block", marginTop: "10px", marginBottom: "6px", color: "black" }}>
            Risk: {tempRisk}
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={tempRisk}
            onChange={(e) => setTempRisk(Number(e.target.value))}
            style={{ width: "100%" }}
          />

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", height: "200px", width: "300px", color: "black"}}>
            <label style={{ display: "block", margin: "6px", color: "black" }}>
              <input
                type="checkbox"
                checked={tempSectors.includes("INDUSTRIALS")}
                onChange={() => handleSectorChange("INDUSTRIALS")}
              />
              Industrial
            </label>

            <label style={{ display: "block", margin: "6px", color: "black" }}>
              <input
                type="checkbox"
                checked={tempSectors.includes("HEALTHCARE")}
                onChange={() => handleSectorChange("HEALTHCARE")}
              />
              Healthcare
            </label>

            <label style={{ display: "block", margin: "6px", color: "black" }}>
              <input
                type="checkbox"
                checked={tempSectors.includes("TECHNOLOGY")}
                onChange={() => handleSectorChange("TECHNOLOGY")}
              />
              Technology
            </label>

            <label style={{ display: "block", margin: "6px", color: "black" }}>
              <input
                type="checkbox"
                checked={tempSectors.includes("UTILITIES")}
                onChange={() => handleSectorChange("UTILITIES")}
              />
              Utilities
            </label>

            <label style={{ display: "block", margin: "6px", color: "black" }}>
              <input
                type="checkbox"
                checked={tempSectors.includes("FINANCIAL SERVICES")}
                onChange={() => handleSectorChange("FINANCIAL SERVICES")}
              />
              Financial
            </label>

            <label style={{ display: "block", margin: "6px", color: "black" }}>
              <input
                type="checkbox"
                checked={tempSectors.includes("BASIC MATERIALS")}
                onChange={() => handleSectorChange("BASIC MATERIALS")}
              />
              Materials
            </label>

            <label style={{ display: "block", margin: "6px", color: "black" }}>
              <input
                type="checkbox"
                checked={tempSectors.includes("CONSUMER CYCLICAL")}
                onChange={() => handleSectorChange("CONSUMER CYCLICAL")}
              />
              Cyclical
            </label>

            <label style={{ display: "block", margin: "6px", color: "black" }}>
              <input
                type="checkbox"
                checked={tempSectors.includes("REAL ESTATE")}
                onChange={() => handleSectorChange("REAL ESTATE")}
              />
              Real Estate
            </label>

            <label style={{ display: "block", margin: "6px", color: "black" }}>
              <input
                type="checkbox"
                checked={tempSectors.includes("COMMUNICATION SERVICES")}
                onChange={() => handleSectorChange("COMMUNICATION SERVICES")}
              />
              Services
            </label>

            <label style={{ display: "block", margin: "6px", color: "black" }}>
              <input
                type="checkbox"
                checked={tempSectors.includes("CONSUMER DEFENSIVE")}
                onChange={() => handleSectorChange("CONSUMER DEFENSIVE")}
              />
              Defensive
            </label>

            <label style={{ display: "block", margin: "6px", color: "black" }}>
              <input
                type="checkbox"
                checked={tempSectors.includes("ENERGY")}
                onChange={() => handleSectorChange("ENERGY")}
              />
              Energy
            </label>
          </div>
          
          <div style={
            { display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#ccc",
                color: "black",
                cursor: "pointer",
                flex: 1,
                marginRight: "5px",
              }}
            >
              Close
            </button>
            <button
              onClick={handleApply}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#99ff00",
                color: "black",
                cursor: "pointer",
                flex: 1,
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsButton;
