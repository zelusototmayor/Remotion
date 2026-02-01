import React from "react";
import { Img, staticFile, OffthreadVideo, interpolate } from "remotion";

type IPhoneMockupProps = {
  screenshot?: string;
  video?: string;
  scale?: number;
  showDynamicIsland?: boolean;
  style?: React.CSSProperties;
};

/**
 * iPhone mockup component with dynamic island.
 * Displays either a static screenshot or video inside a realistic phone frame.
 *
 * @example
 * // With screenshot
 * <IPhoneMockup screenshot="assets/app/home-screen.png" />
 *
 * // With video
 * <IPhoneMockup video="assets/app/demo.mp4" />
 */
export const IPhoneMockup: React.FC<IPhoneMockupProps> = ({
  screenshot,
  video,
  scale = 1,
  showDynamicIsland = true,
  style = {},
}) => {
  const phoneWidth = 375 * scale;
  const phoneHeight = 812 * scale;
  const bezelRadius = 55 * scale;
  const islandWidth = 130 * scale;
  const islandHeight = 35 * scale;

  return (
    <div
      style={{
        position: "relative",
        width: phoneWidth,
        height: phoneHeight,
        borderRadius: bezelRadius,
        overflow: "hidden",
        boxShadow: `0 ${50 * scale}px ${100 * scale}px rgba(0,0,0,0.5), 0 0 0 ${2 * scale}px #1a1a1a, 0 0 0 ${6 * scale}px #0a0a0a, 0 0 0 ${8 * scale}px #333`,
        background: "#000",
        ...style,
      }}
    >
      {/* Screen content */}
      {video ? (
        <OffthreadVideo
          src={staticFile(video)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: bezelRadius - 4 * scale,
          }}
          muted
        />
      ) : screenshot ? (
        <Img
          src={staticFile(screenshot)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: bezelRadius - 4 * scale,
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)",
            borderRadius: bezelRadius - 4 * scale,
          }}
        />
      )}

      {/* Dynamic Island */}
      {showDynamicIsland && (
        <div
          style={{
            position: "absolute",
            top: 12 * scale,
            left: "50%",
            transform: "translateX(-50%)",
            width: islandWidth,
            height: islandHeight,
            background: "#000",
            borderRadius: 20 * scale,
          }}
        />
      )}
    </div>
  );
};

type PhoneWithNotificationProps = {
  notificationProgress: number;
  notification: {
    appIcon: string;
    appName: string;
    message: string;
    time?: string;
  };
  colors: {
    text: string;
    textMuted: string;
  };
  scale?: number;
};

/**
 * iPhone mockup with animated notification sliding in.
 * Use with interpolated notificationProgress (0-1) to animate the notification.
 */
export const PhoneWithNotification: React.FC<PhoneWithNotificationProps> = ({
  notificationProgress,
  notification,
  colors,
  scale = 1,
}) => {
  const phoneWidth = 375 * scale;
  const phoneHeight = 812 * scale;
  const bezelRadius = 55 * scale;
  const notificationY = interpolate(notificationProgress, [0, 1], [-100 * scale, 55 * scale]);

  return (
    <div
      style={{
        position: "relative",
        width: phoneWidth,
        height: phoneHeight,
        borderRadius: bezelRadius,
        overflow: "hidden",
        boxShadow: `0 ${50 * scale}px ${100 * scale}px rgba(0,0,0,0.6), 0 0 0 ${2 * scale}px #1a1a1a, 0 0 0 ${6 * scale}px #0a0a0a, 0 0 0 ${8 * scale}px #333`,
        background: "#000",
      }}
    >
      {/* Lock screen */}
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 60 * scale,
        }}
      >
        <div
          style={{
            fontFamily: "system-ui",
            fontSize: 72 * scale,
            fontWeight: 200,
            color: "#fff",
            letterSpacing: -2,
          }}
        >
          9:41
        </div>
        <div
          style={{
            fontFamily: "system-ui",
            fontSize: 18 * scale,
            color: "#999",
            marginTop: 5 * scale,
          }}
        >
          Wednesday, January 21
        </div>
      </div>

      {/* Notification */}
      <div
        style={{
          position: "absolute",
          left: 12 * scale,
          right: 12 * scale,
          top: notificationY,
          opacity: notificationProgress,
          background: "rgba(40, 40, 50, 0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: 20 * scale,
          padding: 14 * scale,
          display: "flex",
          alignItems: "flex-start",
          gap: 12 * scale,
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
        }}
      >
        <Img
          src={staticFile(notification.appIcon)}
          style={{
            width: 44 * scale,
            height: 44 * scale,
            borderRadius: 10 * scale,
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4 * scale,
            }}
          >
            <div
              style={{
                fontFamily: "system-ui",
                fontSize: 15 * scale,
                fontWeight: 600,
                color: colors.text,
              }}
            >
              {notification.appName}
            </div>
            <div
              style={{
                fontFamily: "system-ui",
                fontSize: 13 * scale,
                color: colors.textMuted,
              }}
            >
              {notification.time || "now"}
            </div>
          </div>
          <div
            style={{
              fontFamily: "system-ui",
              fontSize: 15 * scale,
              color: "#ddd",
              lineHeight: 1.35,
            }}
          >
            {notification.message}
          </div>
        </div>
      </div>

      {/* Dynamic Island */}
      <div
        style={{
          position: "absolute",
          top: 12 * scale,
          left: "50%",
          transform: "translateX(-50%)",
          width: 130 * scale,
          height: 35 * scale,
          background: "#000",
          borderRadius: 20 * scale,
        }}
      />
    </div>
  );
};

export default IPhoneMockup;
