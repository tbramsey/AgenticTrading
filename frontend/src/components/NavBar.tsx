import React from "react";
import { NavLink, Outlet } from "react-router-dom"; // Added Outlet for the Layout wrapper
import BerryLogo from "../assets/berry_logo.png";

// --- THE NAVBAR COMPONENT ---
const NavBar = () => {
  const colors = {
    background: "#0D1117",
    border: "#30363d",
    textInactive: "#8b949e",
    textActive: "#2ea043", // Berry Green
    bgActive: "rgba(46, 160, 67, 0.15)",
    white: "#ffffff",
  };

  const styles = {
    sidebar: {
      width: "260px",
      height: "100vh",
      backgroundColor: colors.background,
      borderRight: `1px solid ${colors.border}`,
      display: "flex",
      flexDirection: "column",
      padding: "24px",
      boxSizing: "border-box",
      // FIXED POSITIONING
      position: "fixed", 
      top: 0,
      left: 0,
      zIndex: 1000, // Ensures this stays ON TOP of other content
      fontFamily: "'Inter', sans-serif",
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      marginBottom: "40px",
      gap: "12px",
    },
    logoTextContainer: {
      display: "flex",
      flexDirection: "column",
    },
    brandName: {
      color: colors.white,
      fontSize: "20px",
      fontWeight: "700",
      lineHeight: "1.2",
    },
    subBrandName: {
      color: colors.textInactive,
      fontSize: "12px",
      fontWeight: "400",
    },
    navLinksContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    linkItem: {
      display: "flex",
      alignItems: "center",
      padding: "12px 16px",
      borderRadius: "8px",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.2s ease",
      gap: "12px",
    },
  };

  const Icons = {
    About: ({ color }) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><circle cx="12" cy="8" r="1"></circle></svg>
    ),
    Dashboard: ({ color }) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
    ),
    Analysis: ({ color }) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
    ),
    Market: ({ color }) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
    ),
    Portfolio: ({ color }) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
    ),
  };

  const getLinkStyle = ({ isActive }) => ({
    ...styles.linkItem,
    backgroundColor: isActive ? colors.bgActive : "transparent",
    color: isActive ? colors.textActive : colors.textInactive,
  });

  return (
    <nav style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <img src={BerryLogo} alt="Berry Logo" width="40" height="40" style={{borderRadius: '8px'}} />
        <div style={styles.logoTextContainer}>
          <span style={styles.brandName}>Berry</span>
          <span style={styles.subBrandName}>Fintech Platform</span>
        </div>
      </div>

      <div style={styles.navLinksContainer}>
        <NavLink to="/about" style={getLinkStyle}>
          {({ isActive }) => (
            <>
              <Icons.About color={isActive ? colors.textActive : colors.textInactive} />
              <span>About</span>
            </>
          )}
        </NavLink>

        <NavLink to="/dashboard" style={getLinkStyle}>
          {({ isActive }) => (
            <>
              <Icons.Dashboard color={isActive ? colors.textActive : colors.textInactive} />
              <span>Dashboard</span>
            </>
          )}
        </NavLink>

        <NavLink to="/market" style={getLinkStyle}>
          {({ isActive }) => (
            <>
              <Icons.Market color={isActive ? colors.textActive : colors.textInactive} />
              <span>Market</span>
            </>
          )}
        </NavLink>

        <NavLink to="/portfolio" style={getLinkStyle}>
           {({ isActive }) => (
            <>
              <Icons.Portfolio color={isActive ? colors.textActive : colors.textInactive} />
              <span>Portfolio</span>
            </>
          )}
        </NavLink>

        <NavLink to="/stock-analysis" style={getLinkStyle}>
          {({ isActive }) => (
            <>
              <Icons.Analysis color={isActive ? colors.textActive : colors.textInactive} />
              <span>Stock Analysis</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

// --- LAYOUT HELPER ---
// Export this component to wrap your pages automatically
export const PageLayout = ({ children }) => {
  const layoutStyle = {
    marginLeft: "260px", // Exact width of the sidebar
    minHeight: "100vh",
    backgroundColor: "#0D1117", // Matches sidebar dark theme
    color: "white",
    width: "calc(100% - 260px)", // Ensures it doesn't cause horizontal scroll
  };

  return (
    <div style={{ display: "flex" }}>
      <NavBar />
      <main style={layoutStyle}>
        {/* If using Router Outlet, use that, otherwise use children */}
        {children ? children : <Outlet />} 
      </main>
    </div>
  );
};

export default NavBar;