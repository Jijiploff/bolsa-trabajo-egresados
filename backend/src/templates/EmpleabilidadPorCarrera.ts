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
  carrera: string;
  totalEgresados: number;
  contratados: number;
  porcentaje: number;
}

interface Props {
  datos: Datos[];
}

export const EmpleabilidadPorCarreraPDF = ({ datos }: Props) =>
  React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: localStyles.page },
      React.createElement(Text, { style: localStyles.title }, 'Empleabilidad por Carrera'),
      React.createElement(
        View,
        { style: localStyles.table },
        React.createElement(
          View,
          { style: [localStyles.tableRow, localStyles.tableHeader] },
          React.createElement(Text, { style: localStyles.tableCell }, 'Carrera'),
          React.createElement(Text, { style: localStyles.tableCell }, 'Total Egresados'),
          React.createElement(Text, { style: localStyles.tableCell }, 'Contratados'),
          React.createElement(Text, { style: localStyles.tableCell }, '% Empleabilidad')
        ),
        ...datos.map((d, idx) =>
          React.createElement(
            View,
            { style: localStyles.tableRow, key: idx },
            React.createElement(Text, { style: localStyles.tableCell }, d.carrera),
            React.createElement(Text, { style: localStyles.tableCell }, d.totalEgresados),
            React.createElement(Text, { style: localStyles.tableCell }, d.contratados),
            React.createElement(Text, { style: localStyles.tableCell }, `${d.porcentaje.toFixed(1)}%`)
          )
        )
      )
    )
  );