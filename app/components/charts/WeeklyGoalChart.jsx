import { Pie, PieChart, ResponsiveContainer } from "recharts";
import styles from "~/styles/components/Charts.module.css";

function GoalLabel({ cx, cy, midAngle, outerRadius, payload }) {
  if (!payload.value) return null;
  const angle = -midAngle * Math.PI / 180;
  const x = cx + (outerRadius + 20) * Math.cos(angle);
  const y = cy + (outerRadius + 20) * Math.sin(angle);
  const left = x < cx;
  const estimatedTextWidth = payload.label.length * 5.2;
  const textX = Math.max(14, Math.min(cx * 2 - estimatedTextWidth - 8, left ? x - 8 - estimatedTextWidth : x + 8));
  return <g>
    <circle cx={textX - 7} cy={y - 3} r={3.5} fill={payload.fill} />
    <text x={textX} y={y} textAnchor="start" fill="#717171" fontSize={10}>{payload.label}</text>
  </g>;
}

export default function WeeklyGoalChart({ sessions, goal }) {
  const remaining = Math.max(0, goal - sessions);
  const data = [
    { value: Math.min(sessions, goal), label: `${sessions} réalisées`, fill: "var(--chart-primary)" },
    { value: remaining, label: `${remaining} restantes`, fill: "var(--chart-primary-muted)" },
  ];

  return (
    <div className={styles.goalChart} role="img" aria-label={`${sessions} courses réalisées sur un objectif de ${goal}. ${remaining} restantes.`}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 370, height: 220 }}>
        <PieChart>
          <Pie data={data} dataKey="value" cx="50%" cy="55%" innerRadius={41} outerRadius={81}
            startAngle={0} endAngle={-360} stroke="none" labelLine={false} label={GoalLabel} isAnimationActive={false} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
