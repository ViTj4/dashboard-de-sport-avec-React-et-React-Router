import styles from "~/styles/components/Charts.module.css";

/** Rend les données lisibles par les technologies d'assistance en complément du graphique SVG. */
export default function ChartDataTable({ caption, columns, rows }) {
  // Le conteneur porte le masquage visuel pour que la largeur intrinsèque du tableau ne déborde pas.
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
