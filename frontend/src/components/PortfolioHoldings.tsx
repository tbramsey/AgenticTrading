import React, { useState, useEffect } from "react";

const PortfolioTicker = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STYLES ---
  const colors = {
    bgCard: "#0D1117",
    bgRow: "#161B22",
    border: "#30363d",
    textMain: "#ffffff",
    textSub: "#8b949e",
    green: "#3fb950",
    red: "#f85149",
  };

  const totalDuration = (holdings.length || 1) * 10;

  const styles = {
    // Main container acts as the "Window" masking the overflow
    container: {
      backgroundColor: colors.bgCard,
      borderRadius: "16px",
      padding: "16px 0", // Reduced vertical padding
      marginTop: "20px",
      border: "transparent",
      width: "100%", 
      maxWidth: "100%", // Allow it to stretch full width
      fontFamily: "'Inter', sans-serif",
      boxSizing: "border-box",
      overflow: "hidden", // MASKS the content outside
      position: "relative",
    },
    header: {
      color: colors.textMain,
      fontSize: "18px",
      fontWeight: "700",
      marginBottom: "10px",
      paddingLeft: "24px", // Align with visuals
    },
    // The Track is what actually moves
    scrollTrack: {
      display: "flex",
      gap: "16px",
      width: "max-content", // Width is determined by children
      // The animation logic is defined in the <style> tag below
      
      animation: `scroll ${totalDuration}s linear infinite`,
    },
    // Individual Stock Card
    card: {
      backgroundColor: colors.bgRow,
      border: `1px solid ${colors.border}`,
      borderRadius: "12px",
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      minWidth: "260px", // Fixed width ensures consistency
      flexShrink: 0,     // Prevents squishing
      cursor: "pointer",
    },
    leftSection: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
    },
    iconBox: (color) => ({
      width: "40px",
      height: "40px",
      borderRadius: "10px",
      backgroundColor: color || "#21262d",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontWeight: "bold",
      fontSize: "16px",
    }),
    tickerContainer: {
      display: "flex",
      flexDirection: "column",
    },
    tickerText: {
      color: colors.textMain,
      fontWeight: "700",
      fontSize: "14px",
    },
    companyText: {
      color: colors.textSub,
      fontSize: "11px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100px",
    },
    rightSection: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      marginLeft: "auto", // Pushes right section to the edge
    },
    priceText: {
      color: colors.textMain,
      fontWeight: "700",
      fontSize: "14px",
    },
    changeText: (isPositive) => ({
      color: isPositive ? colors.green : colors.red,
      fontSize: "11px",
      fontWeight: "600",
    }),
  };

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchCurrentPortfolio = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/fetch-portfolio');
        const rawData = await response.json();

        const processedData = rawData.map((item) => {
            const ticker = item[0];
            const price = item[1];
            const change = item[2];

            // Mock Data
            //const mockPrice = (Math.random() * 150) + 50; 
            //const mockChange = (Math.random() * 10) - 4; 
            
            return {
                ticker: ticker,
                price: price,
                change: change,
            };
        });

        setHoldings(processedData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch portfolio", error);
        setLoading(false);
      }
    };

    fetchCurrentPortfolio();
  }, []);

  const formatCurrency = (val) => `$${val.toFixed(2)}`;
  const formatChange = (val) => `${val > 0 ? "+" : ""}${val.toFixed(2)}%`;
  const getInitials = (ticker) => ticker.substring(0, 1);

  

  if (loading) return <div style={{ color: "white", padding: "20px" }}>Loading Ticker...</div>;

  return (
    <>
      {/* Injecting Keyframes for Animation */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); } 
          }
          /* Pause animation on hover for readability */
          .scroll-track:hover {
            animation-play-state: paused !important;
          }
        `}
      </style>

      <div style={styles.container}>
        <div style={styles.header}>Your Holdings</div>
        
        {/* We use a class name here to target the hover effect defined in <style> */}
        <div style={styles.scrollTrack} className="scroll-track">
          
          {/* RENDER LOGIC: 
             We map the holdings array TWICE ([...holdings, ...holdings]).
             This creates the seamless loop effect. 
             When the first set scrolls off screen, the second set takes its place instantly.
          */}
          
          {[...holdings, ...holdings].map((stock, index) => {
            const isPositive = stock.change >= 0;
            // Use index % length to keep colors consistent between the two duplicates
            const colorIndex = index % holdings.length; 
            const fallbackColor = ["#2f81f7", "#3fb950", "#d29922", "#f85149", "#a371f7"][colorIndex % 5];

            return (
              <div key={index} style={styles.card}>
                {/* Left Side */}
                <div style={styles.leftSection}>
                  <div style={styles.iconBox(fallbackColor)}>
                    {getInitials(stock.ticker)}
                  </div>
                  <div style={styles.tickerContainer}>
                    <span style={styles.tickerText}>{stock.ticker}</span>
                    <span style={styles.companyText} title={stock.name}>{stock.name}</span>
                  </div>
                </div>

                {/* Right Side */}
                <div style={styles.rightSection}>
                  <span style={styles.priceText}>{formatCurrency(stock.price)}</span>
                  <span style={styles.changeText(isPositive)}>
                    {formatChange(stock.change)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PortfolioTicker;