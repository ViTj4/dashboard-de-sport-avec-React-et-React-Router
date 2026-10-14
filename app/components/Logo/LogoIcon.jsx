import { useId } from "react";
import styles from "~/styles/components/Logo.module.css";

// Coordinates and colours from the supplied SVGs, with the rotated orange
// rectangles expressed in the same coordinates as the blue ones.
const bars = [
  { x: 0, blueY: 11, blueHeight: 8, orangeY: 3.3281, orangeHeight: 11, motion: styles.firstBar },
  { x: 4.00003, blueY: 5.65625, blueHeight: 15, orangeY: 0, orangeHeight: 14, motion: styles.secondBar, blueMotion: styles.blueBar },
  { x: 8.00003, blueY: 11.3281, blueHeight: 5, orangeY: 2, orangeHeight: 12, motion: styles.thirdBar },
  { x: 12, blueY: 11, blueHeight: 9, orangeY: 5, orangeHeight: 9, motion: styles.fourthBar },
  { x: 16, blueY: 11.3281, blueHeight: 6, orangeY: 0, orangeHeight: 14, motion: styles.fifthBar },
];

export default function LogoIcon() {
  const gradientId = useId();
  const blueGradientId = `${gradientId}-blue`;
  const orangeGradientId = `${gradientId}-orange`;

  return (
    <svg
      className={styles.icon}
      width={19}
      height={21}
      viewBox="0 0 19 21"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={blueGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#F4320B" />
          <stop offset="1" stopColor="#5465F7" />
        </linearGradient>
        <linearGradient id={orangeGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#F99885" />
          <stop offset="1" stopColor="#DF392B" />
        </linearGradient>
      </defs>
      {bars.map((bar) => (
        <g key={bar.x}>
          <rect
            className={bar.blueMotion}
            x={bar.x}
            y={bar.blueY}
            width={3}
            height={bar.blueHeight}
            rx={1.5}
            fill={`url(#${blueGradientId})`}
          />
          <rect
            className={`${styles.movingBar} ${bar.motion}`}
            x={bar.x}
            y={bar.orangeY}
            width={3}
            height={bar.orangeHeight}
            rx={1.5}
            fill={`url(#${orangeGradientId})`}
          />
        </g>
      ))}
    </svg>
  );
}
