import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SplashScreen = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("Initializing...");

  // Main count-up timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800); // exit splash
          return 100;
        }
        return prev + 1;
      });
    }, 25); // speed control

    return () => clearInterval(timer);
  }, [onComplete]);

  // Text updates based on progress
  useEffect(() => {
    if (count > 90) {
      setText("Welcome, Jadeja.");
    } else if (count > 60) {
      setText("Compiling Modules...");
    } else if (count > 25) {
      setText("Loading Assets...");
    } else {
      setText("Initializing...");
    }
  }, [count]);

  return (
    <motion.div
      className="splash-screen"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        position: "fixed",
        inset: 0,
        background: "radial-gradient(circle at top, #0f0f1a, #000)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      {/* Orbit Loader */}
      <motion.div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.1)",
          borderTop: "2px solid #7C3AED",
          borderRight: "2px solid #5EEAD4",
          marginBottom: 20,
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />

      {/* Percentage */}
      <h1
        style={{
          fontSize: "3.5rem",
          fontWeight: 800,
          background: "linear-gradient(90deg,#7C3AED,#5EEAD4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {count}%
      </h1>

      {/* Status Text */}
      <p
        style={{
          marginTop: 12,
          letterSpacing: "0.15em",
          fontSize: "0.9rem",
          color: "#5EEAD4",
          textTransform: "uppercase",
        }}
      >
        {text}
      </p>
    </motion.div>
  );
};

export default SplashScreen;
