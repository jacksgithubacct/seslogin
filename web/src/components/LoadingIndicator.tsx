import { useEffect, useState } from "react";

const messages = [
  "Loading...",
  "Just a moment...",
  "Fetching data...",
  "Processing...",
  "Almost there...",
  "One second...",
];

export default function LoadingIndicator() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-message">{messages[messageIndex]}</div>
    </div>
  );
}
