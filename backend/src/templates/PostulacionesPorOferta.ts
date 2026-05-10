import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const localStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 12 },
  title: { fontSize: 20, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  text: { marginBottom: 6 },
  table: { display: 'flex', flexDirection: 'column', width: 'auto', marginBottom: 20 },
  tableRow: { flexDirection: 'row', borderBottom: '1px solid #ccc', paddingVertical: 4 },
  tableHeader: { backgroundColor: '#f0f0f0', fontWeight: 'bold' },
  tableCell: { flex: 1, padding: 4 },
});

interface Postulacion {
  egresado: string;
  estado: string;
  fecha: string;
}

interface Props {
  tituloOferta: string;
  empresa: string;
  postulaciones: Postulacion[];
}

export const PostulacionesPorOfertaPDF = ({ tituloOferta, empresa, postulaciones }: Props) =>
  React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: 'A4', style: localStyles.page },
      React.createElement(Text, { style: localStyles.title }, 'Postulaciones a Oferta'),
      React.createElement(Text, { style: localStyles.text }, `Oferta: ${tituloOferta}`),
      React.createElement(Text, { style: localStyles.text }, `Empresa: ${empresa}`),
      React.createElement(
        View,
        { style: localStyles.table },
        React.createElement(
          View,
          { style: [localStyles.tableRow, localStyles.tableHeader] },
          React.createElement(Text, { style: localStyles.tableCell }, 'Egresado'),
          React.createElement(Text, { style: localStyles.tableCell }, 'Estado'),
          React.createElement(Text, { style: localStyles.tableCell }, 'Fecha postulación')
        ),
        ...postulaciones.map((p, idx) =>
          React.createElement(
            View,
            { style: localStyles.tableRow, key: idx },
            React.createElement(Text, { style: localStyles.tableCell }, p.egresado),
            React.createElement(Text, { style: localStyles.tableCell }, p.estado),
            React.createElement(Text, { style: localStyles.tableCell }, p.fecha)
          )
        )
      )
    )
  );