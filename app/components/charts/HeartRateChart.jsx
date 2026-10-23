import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartLegend from "~/components/ChartLegend/ChartLegend.jsx";
import ChartTooltip from "./ChartTooltip.jsx";
import ChartDataTable from "./ChartDataTable.jsx";
import { formatDate } from "~/utils/formatters.js";
import styles from "~/styles/components/Charts.module.css";

const legend = [
  { label: "Min BPM", color: "var(--chart-heart-min)" },
  { label: "Max BPM", color: "var(--chart-heart-max)" },
  { label: "Moy. BPM", color: "var(--chart-primary)", line: true },
];
const columns = [
  { key: "date", label: "Date" }, { key: "min", label: "Minimum (BPM)" },
  { key: "max", label: "Maximum (BPM)" }, { key: "average", label: "Moyenne (BPM)" },
];

export default function HeartRateChart({ days, hasData }) {
  const observed = days.filter((day) => day.min !== null);
  const lower = observed.length ? Math.max(0, Math.floor((Math.min(...observed.map((day) => day.min)) - 5) / 10) * 10) : 0;
  const upper = observed.length ? Math.ceil((Math.max(...observed.map((day) => day.max)) + 5) / 10) * 10 : 200;
  const ticks = Array.from({ length: 5 }, (_, index) => lower + index * (upper - lower) / 4);

  return (
    <>
      <div className={styles.chart}>
        {hasData ? <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 500, height: 310 }}>
          <ComposedChart data={days} margin={{ top: 12, right: 0, bottom: 12, left: 0 }} barGap={4} accessibilityLayer aria-label="Fréquence cardiaque quotidienne minimale, maximale et moyenne">
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="2 2" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: "#717171", strokeWidth: 1 }} tick={{ fontSize: 12, fill: "#717171" }} tickMargin={20} height={40} />
            <YAxis domain={[lower, upper]} ticks={ticks} tickLine={false} axisLine={{ stroke: "#717171", strokeWidth: 1 }} tick={{ fontSize: 10, fill: "#717171" }} width={28} />
            <Tooltip content={<ChartTooltip unit="BPM" getLabel={(day) => formatDate(day.date)} />} cursor={{ fill: "#f2f3ff" }} />
            <Bar dataKey="min" name="Minimum" fill="var(--chart-heart-min)" barSize={14} radius={[12, 12, 12, 12]} isAnimationActive={false} />
            <Bar dataKey="max" name="Maximum" fill="var(--chart-heart-max)" barSize={14} radius={[12, 12, 12, 12]} isAnimationActive={false} />
            <Line dataKey="average" name="Moyenne" type="monotone" stroke="var(--chart-line)" strokeWidth={3}
              dot={{ r: 3.5, fill: "var(--chart-primary)", stroke: "#fff", strokeWidth: 1 }}
              activeDot={{ r: 5, fill: "var(--chart-primary)" }} connectNulls isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer> : <p className={styles.empty}>Aucune fréquence cardiaque enregistrée sur cette période.</p>}
      </div>
      <ChartLegend items={legend} />
      <ChartDataTable caption="Fréquences cardiaques de la semaine sélectionnée" columns={columns} rows={days} />
    </>
  );
}
