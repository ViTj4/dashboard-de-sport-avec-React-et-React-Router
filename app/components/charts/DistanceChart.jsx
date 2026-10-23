import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartLegend from "~/components/ChartLegend/ChartLegend.jsx";
import ChartTooltip from "./ChartTooltip.jsx";
import ChartDataTable from "./ChartDataTable.jsx";
import { formatShortDate } from "~/utils/formatters.js";
import styles from "~/styles/components/Charts.module.css";

const legend = [{ label: "Km", color: "var(--chart-primary)" }];
const columns = [{ key: "label", label: "Semaine" }, { key: "start", label: "Début" }, { key: "end", label: "Fin" }, { key: "distance", label: "Distance (km)" }];

export default function DistanceChart({ weeks, hasData }) {
  return (
    <>
      <div className={styles.chart}>
        {hasData ? <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 360, height: 310 }}>
          <BarChart data={weeks} margin={{ top: 12, right: 4, bottom: 12, left: 0 }} accessibilityLayer aria-label="Distance parcourue par semaine">
            <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="2 2" vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: "#717171", strokeWidth: 1 }} tick={{ fontSize: 12, fill: "#717171" }} tickMargin={20} height={40} />
            <YAxis tickLine={false} axisLine={{ stroke: "#717171", strokeWidth: 1 }} tick={{ fontSize: 10, fill: "#717171" }} width={26} allowDecimals={false} />
            <Tooltip content={<ChartTooltip unit="km" getLabel={(week) => `${week.label} : ${formatShortDate(week.start)} – ${formatShortDate(week.end)}`} />} cursor={{ fill: "#f2f3ff" }} />
            <Bar dataKey="distance" name="Distance" fill="var(--chart-primary)" barSize={14} radius={[12, 12, 12, 12]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer> : <p className={styles.empty}>Aucune course sur cette période.</p>}
      </div>
      <ChartLegend items={legend} />
      <ChartDataTable caption="Distances des quatre semaines sélectionnées" columns={columns} rows={weeks} />
    </>
  );
}
