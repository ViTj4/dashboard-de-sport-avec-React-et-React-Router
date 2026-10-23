import styles from "~/styles/components/Charts.module.css";

export default function ChartDataTable({ caption, columns, rows }) {
  return (
    <div className={styles.srOnly}><table>
      <caption>{caption}</caption>
      <thead><tr>{columns.map((column) => <th key={column.key} scope="col">{column.label}</th>)}</tr></thead>
      <tbody>{rows.map((row, index) => <tr key={row.date ?? row.start ?? index}>
        {columns.map((column, columnIndex) => columnIndex === 0
          ? <th key={column.key} scope="row">{row[column.key]}</th>
          : <td key={column.key}>{row[column.key] ?? "Aucune course"}</td>)}
      </tr>)}</tbody>
    </table></div>
  );
}
