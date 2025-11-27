import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatBot() {
  const [query, setQuery] = useState("");
  const [ticker, setTicker] = useState("");
  const [step, setStep] = useState(1);
  const [analysis, setAnalysis] = useState("");
  const [progress, setProgress] = useState(0);
  
  // New state for loading status and the current text to display
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  // The sequence of messages you requested
  const loadingMessages = [
    "Running market analyst...",
    "Running media analyst...",
    "Running news analyst...",
    "Running fundamentals analyst..."
  ];

  useEffect(() => {
    let interval;
    if (isLoading) {
      let i = 0;
      // Initialize first state immediately
      setLoadingText(loadingMessages[0]);
      setProgress(25); 
      
      interval = setInterval(() => {
        i = i + 1; // Increment without looping

        // Check if we are still within the array bounds
        if (i < loadingMessages.length) {
          setLoadingText(loadingMessages[i]);
          
          // Calculate percentage
          const currentProgress = ((i + 1) / loadingMessages.length) * 100;
          setProgress(currentProgress);
        } else {
          // We reached the end, stop the timer
          clearInterval(interval);
        }
      }, 5000); 
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  async function handleClassify(e) {
    e.preventDefault();
    setTicker("");
    setAnalysis("");

    const response = await fetch("http://localhost:5000/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: query }),
    });

    const data = await response.json();
    setTicker(data.ticker);
    setStep(2);
  }

  async function handleAnalyze() {
    // Start the loading sequence
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ticker, date: "2025-10-20" }),
      });

      if (!response.ok) {
        console.error("API error:", response.statusText);
        setAnalysis("Error fetching analysis");
        setIsLoading(false);
        setStep(3);
        return;
      }

      const data = await response.json();
      
      setAnalysis(data.analysis || "No analysis returned");
      
      // Stop loading and move to step 3
      setIsLoading(false);
      setStep(3);

    } catch (err) {
      console.error(err);
      setAnalysis("Error fetching analysis");
      setIsLoading(false);
      setStep(3);
    }
  }

  return (
    <div
      style={{
        padding: 30,
        fontFamily: "sans-serif",
        // 1. Set fixed width and height
        width: "1500px",
        height: "calc(100vh-80px)",
        boxSizing: "border-box", // Ensures padding doesn't expand dimensions
        display: "flex",
        flexDirection: "column",
        backgroundColor: "transparent"
      }}
    >
      <h1>Trading Assistant</h1>

      {step === 1 && (
        <form onSubmit={handleClassify} style={{width: "50%"}}>
          <label>What stock do you want to analyze?</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. analyze tesla"
            style={{ width: "100%", marginTop: 8, padding: 8, boxSizing: "border-box" }}
          />
          <button style={{ marginTop: 15, padding: "10px 20px" }}>Submit</button>
        </form>
      )}

      {step === 2 && (
        <div>
          <h2>Identified Ticker: {ticker}</h2>
          {ticker === "UNKNOWN" ? (
            <>
              <p>No ticker found.</p>
              <button onClick={() => setStep(1)}>Try Again</button>
            </>
          ) : (
            <>
              {isLoading ? (
                // 2. Show cycling text while loading
                <div style={{ marginTop: 20 }}>
                   <p style={{ fontSize: "1.1em", color: "#555", fontStyle: "italic" }}>
                     {loadingText}
                   </p>
                   {/* Optional simple loading bar/spinner visualization */}
                   <div style={{ 
                      width: "100%", 
                      height: "10px",             // Height of the bar
                      background: "#e0e0e0",      // Light grey background container
                      borderRadius: "5px",        // Rounded corners
                      marginTop: "10px",
                      overflow: "hidden"          // Ensures inner bar doesn't overflow corners
                    }}>
                      <div style={{ 
                        width: `${progress}%`,    // Dynamic width based on state
                        height: "100%", 
                        background: "#4caf50",    // Green color (change to any hex code)
                        transition: "width 0.5s ease-in-out" // Makes the jump smooth
                      }}></div>
                    </div>
                </div>
              ) : (
                <>
                  <p>Is this correct?</p>
                  <button onClick={handleAnalyze} style={{ marginRight: 10, padding: "10px 20px" }}>
                    Yes
                  </button>
                  <button onClick={() => setStep(1)} style={{ padding: "10px 20px" }}>
                    No
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}

      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", height: "80%" }}>
          <h2>Analysis for {ticker}</h2>
          <div
            style={{
              background: "transparent",
              padding: 20,
              // Take up remaining space inside the 1000px container
              flex: 1, 
              overflowY: "auto",
              overflowX: "hidden",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            <ReactMarkdown>
              {typeof analysis === "string" ? analysis : JSON.stringify(analysis, null, 2)}
            </ReactMarkdown>
          </div>
          <button onClick={() => setStep(1)} style={{ marginTop: 15, padding: "15px" }}>
            Analyze Another
          </button>
        </div>
      )}
    </div>
  );
}