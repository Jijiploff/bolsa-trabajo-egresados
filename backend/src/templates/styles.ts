import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: 'Helvetica' },
  title: { fontSize: 20, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginBottom: 10, fontWeight: 'bold' },
  table: { display: 'flex', flexDirection: 'column', width: 'auto', marginBottom: 20 },
  tableRow: { flexDirection: 'row', borderBottom: '1px solid #ccc', paddingVertical: 4 },
  tableHeader: { backgroundColor: '#f0f0f0', fontWeight: 'bold' },
  tableCell: { flex: 1, padding: 4 },
  text: { marginBottom: 6 },
  section: { marginBottom: 20 },
});