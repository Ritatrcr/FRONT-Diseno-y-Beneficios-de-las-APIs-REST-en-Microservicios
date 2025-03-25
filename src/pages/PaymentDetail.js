// src/pages/PaymentDetail.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Alert, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PaymentDetail = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');

  const fetchPayment = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/payments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayment(res.data);
    } catch (err) {
      setError('Error al obtener el detalle del pago');
    }
  };

  useEffect(() => {
    fetchPayment();
  }, [id]);

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!payment) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Cargando...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, backgroundColor: 'white', padding: 3, borderRadius: 2, boxShadow: 3 }}>
      <Box>
        <Typography variant="h5" sx={{ color: '#0033a0', fontWeight: 'bold', marginBottom: 2 }}>
          Detalle del Pago
        </Typography>
        <Typography sx={{ fontSize: 16 }}><strong>Monto:</strong> ${payment.amount}</Typography>
        <Typography sx={{ fontSize: 16 }}><strong>Moneda:</strong> {payment.currency}</Typography>
        <Typography sx={{ fontSize: 16 }}><strong>Método de Pago:</strong> {payment.payment_method}</Typography>
        <Typography sx={{ fontSize: 16 }}><strong>Descripción:</strong> {payment.description}</Typography>
        <Typography sx={{ fontSize: 16 }}><strong>Estado:</strong> {payment.status}</Typography>
        <Typography sx={{ fontSize: 16 }}><strong>Fecha de Creación:</strong> {payment.created_at}</Typography>
        <Box sx={{ marginTop: 3 }}>
          <Button variant="contained" sx={{ backgroundColor: '#3366FF', color: 'white' }}>Hacer otro pago</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PaymentDetail;
