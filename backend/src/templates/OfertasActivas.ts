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

interface Oferta {
  titulo: string;
  empresa: string;
  modalidad: string;
  ubicacion: string;
  salario_min: number | null;
  salario_max: number | null;
}

interface Props {
  ofertas: Oferta[];
}

export const OfertasActivasPDF = ({ ofertas }: Props) =>
  React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: localStyles.page },
      React.createElement(Text, { style: localStyles.title }, 'Ofertas Laborales Activas'),
      React.createElement(
        View,
        { style: localStyles.table },
        React.createElement(
          View,
          { style: [localStyles.tableRow, localStyles.tableHeader] },
          React.createElement(Text, { style: localStyles.tableCell }, 'Título'),
          React.createElement(Text, { style: localStyles.tableCell }, 'Empresa'),
          React.createElement(Text, { style: localStyles.tableCell }, 'Modalidad'),
          React.createElement(Text, { style: localStyles.tableCell }, 'Ubicación'),
          React.createElement(Text, { style: localStyles.tableCell }, 'Salario')
        ),
        ...ofertas.map((o, idx) =>
          React.createElement(
            View,
            { style: localStyles.tableRow, key: idx },
            React.createElement(Text, { style: localStyles.tableCell }, o.titulo),
            React.createElement(Text, { style: localStyles.tableCell }, o.empresa),
            React.createElement(Text, { style: localStyles.tableCell }, o.modalidad),
            React.createElement(Text, { style: localStyles.tableCell }, o.ubicacion || '-'),
            React.createElement(
              Text,
              { style: localStyles.tableCell },
              o.salario_min != null && o.salario_max != null
                ? `$${o.salario_min} - $${o.salario_max}`
                : o.salario_min != null
                ? `Desde $${o.salario_min}`
                : o.salario_max != null
                ? `Hasta $${o.salario_max}`
                : 'No especificado'
            )
          )
        )
      )
    )
  );