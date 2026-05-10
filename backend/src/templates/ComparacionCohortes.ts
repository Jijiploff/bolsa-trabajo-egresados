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

interface Cohorte {
  ano: number;
  totalEgresados: number;
  contratados: number;
  porcentaje: number;
}

interface Props {
  cohortes: Cohorte[];
}

export const ComparacionCohortesPDF = ({ cohortes }: Props) =>
  React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: localStyles.page },
      React.createElement(Text, { style: localStyles.title }, 'Comparación entre Cohortes'),
      React.createElement(
        View,
        { style: localStyles.table },
        React.createElement(
          View,
          { style: [localStyles.tableRow, localStyles.tableHeader] },
          React.createElement(Text, { style: localStyles.tableCell }, 'Año de egreso'),
          React.createElement(Text, { style: localStyles.tableCell }, 'Total egresados'),
          React.createElement(Text, { style: localStyles.tableCell }, 'Contratados'),
          React.createElement(Text, { style: localStyles.tableCell }, '% Empleabilidad')
        ),
        ...cohortes.map((c, idx) =>
          React.createElement(
            View,
            { style: localStyles.tableRow, key: idx },
            React.createElement(Text, { style: localStyles.tableCell }, c.ano),
            React.createElement(Text, { style: localStyles.tableCell }, c.totalEgresados),
            React.createElement(Text, { style: localStyles.tableCell }, c.contratados),
            React.createElement(Text, { style: localStyles.tableCell }, `${c.porcentaje.toFixed(1)}%`)
          )
        )
      )
    )
  );