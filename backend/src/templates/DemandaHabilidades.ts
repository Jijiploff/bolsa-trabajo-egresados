import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const localStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 12 },
  title: { fontSize: 20, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  table: { display: 'flex', flexDirection: 'column', width: 'auto', marginBottom: 20 },
  tableRow: { flexDirection: 'row', borderBottom: '1px solid #ccc', paddingVertical: 4 },
  tableHeader: { backgroundColor: '#f0f0f0', fontWeight: 'bold' },
  tableCell: { flex: 1, padding: 4 },
});

interface Datos {
  habilidad: string;
  tipo: string;
  demanda: number;
}

interface Props {
  datos: Datos[];
}

export const DemandaHabilidadesPDF = ({ datos }: Props) =>
  React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: localStyles.page },
      React.createElement(Text, { style: localStyles.title }, 'Demanda de Habilidades'),
      React.createElement(
        View,
        { style: localStyles.table },
        React.createElement(
          View,
          { style: [localStyles.tableRow, localStyles.tableHeader] },
          React.createElement(Text, { style: localStyles.tableCell }, 'Habilidad'),
          React.createElement(Text, { style: localStyles.tableCell }, 'Tipo'),
          React.createElement(Text, { style: localStyles.tableCell }, 'Ofertas que la requieren')
        ),
        ...datos.map((d, idx) =>
          React.createElement(
            View,
            { style: localStyles.tableRow, key: idx },
            React.createElement(Text, { style: localStyles.tableCell }, d.habilidad),
            React.createElement(Text, { style: localStyles.tableCell }, d.tipo),
            React.createElement(Text, { style: localStyles.tableCell }, d.demanda)
          )
        )
      )
    )
  );