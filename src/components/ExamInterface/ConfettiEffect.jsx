// src/components/ExamInterface/ConfettiEffect.jsx
import React, { useEffect, useRef } from 'react';

/**
 * Creates a celebratory confetti effect using canvas
 * 
 * This component adds a festive confetti animation to celebrate
 * the completion of an exam or achievement.
 */
const ConfettiEffect = () => {
  const canvasRef = useRef(null);

  // Colors to use for confetti pieces
  const colors = [
    'var(--primary)',
    'var(--primary-light)',
    'var(--secondary)',
    'var(--accent)',
    'var(--highlight)',
    '#FF5722', // deep orange
    '#8BC34A', // light green
    '#9C27B0'  // purple
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Set canvas to full window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Confetti pieces array
    const confetti = [];

    // Create confetti pieces
    const createConfetti = () => {
      const confettiCount = 150; // Number of confetti pieces

      for (let i = 0; i < confettiCount; i++) {
        confetti.push({
          x: Math.random() * canvas.width, // Random x position
          y: Math.random() * canvas.height - canvas.height, // Start above the canvas
          size: Math.random() * 10 + 5, // Random size between 5-15
          color: colors[Math.floor(Math.random() * colors.length)], // Random color
          shape: Math.random() > 0.5 ? 'circle' : 'rect', // Random shape
          speedX: Math.random() * 6 - 3, // Random horizontal speed
          speedY: Math.random() * 3 + 2, // Random vertical speed
          rotation: Math.random() * 360, // Random initial rotation
          rotationSpeed: Math.random() * 10 - 5 // Random rotation speed
        });
      }
    };

    // Draw a single confetti piece
    const drawConfetti = (piece) => {
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate((piece.rotation * Math.PI) / 180);
      ctx.fillStyle = piece.color;

      if (piece.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, piece.size / 2, 0, 2 * Math.PI);
        ctx.fill();
      } else {
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
      }

      ctx.restore();
    };

    // Update animation
    const updateConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let stillActive = false;

      confetti.forEach(piece => {
        piece.x += piece.speedX;
        piece.y += piece.speedY;
        piece.rotation += piece.rotationSpeed;

        // Apply gravity effect
        piece.speedY += 0.1;

        // Add some random movement
        piece.speedX += Math.random() * 0.2 - 0.1;

        // Check if confetti is still on screen
        if (piece.y < canvas.height + piece.size) {
          stillActive = true;
          drawConfetti(piece);
        }
      });

      // Continue animation if there's still active confetti
      if (stillActive) {
        requestAnimationFrame(updateConfetti);
      }
    };

    // Initialize and start animation
    createConfetti();
    updateConfetti();

    // Cleanup function
    return () => {
      // Nothing specific to clean up for canvas
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none', // Let clicks pass through
        zIndex: 9999
      }}
    />
  );
};

export default ConfettiEffect;