import React from "react";
import {
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  staticFile,
} from "remotion";

interface IPhoneMockupProps {
  screenshot: string;
  scale?: number;
  x?: number;
  y?: number;
  rotation?: number;
  showFrame?: boolean;
  zoomTo?: { x: number; y: number; scale: number };
  zoomDelay?: number;
}

export const IPhoneMockup: React.FC<IPhoneMockupProps> = ({
  screenshot,
  scale = 1,
  x = 0,
  y = 0,
  rotation = 0,
  showFrame = true,
  zoomTo,
  zoomDelay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns zoom effect
  let zoomScale = 1;
  let zoomX = 0;
  let zoomY = 0;

  if (zoomTo) {
    const zoomProgress = spring({
      frame: frame - zoomDelay,
      fps,
      config: { damping: 200 },
    });
    zoomScale = interpolate(zoomProgress, [0, 1], [1, zoomTo.scale]);
    zoomX = interpolate(zoomProgress, [0, 1], [0, zoomTo.x]);
    zoomY = interpolate(zoomProgress, [0, 1], [0, zoomTo.y]);
  }

  // iPhone 15 Pro dimensions (relative)
  const phoneWidth = 375;
  const phoneHeight = 812;
  const bezelRadius = 55;
  const notchWidth = 150;
  const notchHeight = 35;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg)`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: phoneWidth,
          height: phoneHeight,
          borderRadius: bezelRadius,
          overflow: "hidden",
          boxShadow: showFrame
            ? "0 50px 100px rgba(0,0,0,0.5), 0 0 0 2px #1a1a1a, 0 0 0 6px #0a0a0a, 0 0 0 8px #333"
            : "none",
          background: "#000",
        }}
      >
        {/* Screen content with zoom */}
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: bezelRadius - 4,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `scale(${zoomScale}) translate(${zoomX}px, ${zoomY}px)`,
              transformOrigin: "center center",
            }}
          >
            <Img
              src={staticFile(screenshot)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>

        {/* Dynamic Island */}
        {showFrame && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              width: notchWidth,
              height: notchHeight,
              background: "#000",
              borderRadius: 20,
            }}
          />
        )}
      </div>
    </div>
  );
};

// Animated phone entrance
interface AnimatedPhoneProps extends IPhoneMockupProps {
  entranceDelay?: number;
  entranceFrom?: "bottom" | "right" | "left" | "scale";
}

export const AnimatedPhone: React.FC<AnimatedPhoneProps> = ({
  entranceDelay = 0,
  entranceFrom = "bottom",
  ...props
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - entranceDelay,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  let translateX = props.x || 0;
  let translateY = props.y || 0;
  let animScale = props.scale || 1;

  switch (entranceFrom) {
    case "bottom":
      translateY = interpolate(entrance, [0, 1], [400, props.y || 0]);
      break;
    case "right":
      translateX = interpolate(entrance, [0, 1], [400, props.x || 0]);
      break;
    case "left":
      translateX = interpolate(entrance, [0, 1], [-400, props.x || 0]);
      break;
    case "scale":
      animScale = interpolate(entrance, [0, 1], [0, props.scale || 1]);
      break;
  }

  return (
    <div style={{ opacity: entrance }}>
      <IPhoneMockup
        {...props}
        x={translateX}
        y={translateY}
        scale={animScale}
      />
    </div>
  );
};
