import React from 'react';
import { AbsoluteFill, Video, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';

export const VideoTemplate = ({ videoUrl, caption, scriptText }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // Fade in/out animation for text
  const opacity = interpolate(
    frame,
    [0, 30, durationInFrames - 30, durationInFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Scale animation
  const scale = interpolate(
    frame,
    [0, 30],
    [0.8, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Background Video from Pexels */}
      <Video
        src={videoUrl}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        muted
      />

      {/* Dark overlay for better text visibility */}
      <AbsoluteFill
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
      />

      {/* Text Overlay at Bottom */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            padding: '30px 40px',
            borderRadius: '20px',
            maxWidth: '90%',
            opacity,
            transform: `scale(${scale})`,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          <h2
            style={{
              color: '#ffffff',
              fontSize: '52px',
              fontWeight: 'bold',
              textAlign: 'center',
              margin: 0,
              fontFamily: 'Arial, Helvetica, sans-serif',
              lineHeight: 1.3,
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
            }}
          >
            {caption}
          </h2>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
