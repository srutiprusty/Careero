import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";
import "./Globe.css";

const Globe = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Ensure canvasRef.current is not null
    if (!canvasRef.current) return;

    let phi = 0; // Initial rotation angle
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: window.devicePixelRatio,
      width: canvasRef.current.offsetWidth, // Canvas width based on parent size
      height: canvasRef.current.offsetHeight, // Canvas height based on parent size
      phi: Math.PI / 2, // Initial angle
      theta: 0.3, // Tilt angle
      dark: 1, // Darkness level
      diffuse: 1.2, // Surface light diffusion
      mapSamples: 16000, // Map resolution
      mapBrightness: 5, // Map brightness level
      baseColor: [0.2, 0.2, 0.3], // Base globe color
      markerColor: [1, 0, 0], // Marker color
      glowColor: [0, 0, 0], // Glow color
      markers: [
        { location: [37.7749, -122.4194], size: 0.05 }, // San Francisco
        { location: [40.7128, -74.006], size: 0.07 }, // New York
        { location: [51.5074, -0.1278], size: 0.05 }, // London
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01; // Rotation speed
      },
    });

    return () => globe.destroy(); // Cleanup on unmount
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default Globe;
