import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Modal,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Money from 'money';
import axios from 'axios';

const InvoicePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [bookingForPayouts, setBookingForPayouts] = useState([]);
  const [details, setDetails] = useState([]);
  const [formData, setFormData] = useState({
    bookingForPayouts_id: '',
    invoice_number: '',
    issue_date: '',
    due_date: '',
    value: { amount: '' }
  });
  const [editIndex, setEditIndex] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingForPayoutsResponse = await axios.get('http://127.0.0.1:8000/api/bookingForPayouts');
        setBookingForPayouts(bookingForPayoutsResponse.data);
        
        const invoicesResponse = await axios.get('http://127.0.0.1:8000/api/invoices');
        setInvoices(invoicesResponse.data);

        const detailsResponse = await axios.get('http://127.0.0.1:8000/api/paymentAndTaxDetails');
        setDetails(detailsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditIndex(null);
    setFormData({
      bookingForPayouts_id: '',
      invoice_number: '',
      issue_date: '',
      due_date: '',
      value: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Se o nome do campo for "value", atualize apenas a propriedade "amount" do objeto
    if (name === 'value') {
      setFormData({ ...formData, value: { ...formData.value, amount: value } });
    } else {
      // Caso contrário, atualize o estado normalmente
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calcula o período com base nas datas de issue_date e due_date
      const period = calculatePeriod(formData.issue_date, formData.due_date);
      
      const formDataWithPeriod = {
        ...formData,
        period: period, // Define o período no formulário
        value: formData.value.amount.toFixed(2) // Formata o valor com duas casas decimais
      };
  
      if (formData.id) {
        await axios.put(`http://127.0.0.1:8000/api/invoices/${formData.id}`, formDataWithPeriod);
        const updatedInvoices = [...invoices];
        updatedInvoices[editIndex] = formDataWithPeriod;
        setInvoices(updatedInvoices);
        setShowSuccessAlert('Invoice updated successfully!');
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/invoices', formDataWithPeriod);
        setInvoices([...invoices, response.data]);
        setShowSuccessAlert('Invoice added successfully!');
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const calculatePeriod = (startDate, endDate) => {
    // Retorna o período diretamente
    return `${startDate} - ${endDate}`;
  };

  const handleEdit = (index) => {
    const { id, bookingForPayouts_id, invoice_number, issue_date, due_date, value } = invoices[index];
    setFormData({ id, bookingForPayouts_id, invoice_number, issue_date, due_date, value });
    setEditIndex(index);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/invoices/${confirmDeleteId}`);
      setInvoices(invoices.filter(invoice => invoice.id !== confirmDeleteId));
      setShowDeleteSuccessAlert(true);
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const getPaymentStatus = (invoiceId) => {
    const invoiceDetails = details.find(detail => detail.invoice_id === invoiceId);
    
    if (invoiceDetails) {
      const status = invoiceDetails.payment_data_status === 1 ? "Paid" : "Not Paid";
      const visualIndicator = invoiceDetails.payment_data_status === 1 ? <span style={{color: 'green', fontSize: '20px'}}>●</span> : <span style={{color: 'red', fontSize: '20px'}}>●</span>;
      return { status, visualIndicator };
    } else {
      return { status: "Não disponível", visualIndicator: '' };
    }
  };

  const formatCurrency = (value) => {
    // Verifica se o valor é um número válido
    if (typeof value !== 'number' || isNaN(value)) {
      return 'Invalid value';
    }
    
    // Formata o valor como moeda em euros (€)
    const formattedValue = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
    
    return formattedValue;
  };
  
  const YourComponent = () => {
    const value = 1234.56; // Seu valor de moeda
  
    return (
      <div>
        <p>{formatCurrency(value)}</p>
      </div>
    );
  };
  
 

  return (
    <div>
      <h1>Invoices</h1>
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>{showSuccessAlert}</Alert>
      )}
      {showDeleteSuccessAlert && (
        <Alert severity="success" onClose={() => setShowDeleteSuccessAlert(false)}>Invoice removed successfully!</Alert>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}><AddIcon /></Button>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
          <h2>{formData.id ? 'Edit Invoice' : 'New Invoice'}</h2>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="bookingForPayouts-select-label">Booking For Payouts</InputLabel>
              <Select
                name="bookingForPayouts_id"
                label="Booking For Payouts"
                value={formData.bookingForPayouts_id || ''}
                onChange={handleChange}
              >
                {bookingForPayouts.map(booking => (
                  <MenuItem key={booking.id} value={booking.id}>{booking.bookingReference}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="invoice_number"
              label="Invoice Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.invoice_number}
              onChange={handleChange}
            />
            <TextField
              name="issue_date"
              label="Issue Date"
              type="date" // Alterado para type date para mostrar o seletor de data
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.issue_date}
              onChange={handleChange}
            />
            <TextField
              name="due_date"
              label="Due Date"
              type="date" // Alterado para type date para mostrar o seletor de data
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.due_date}
              onChange={handleChange}
            />
            <TextField
              name="value"
              label="Value"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.value.amount || ''}
              onChange={handleChange}
            />
            <Button type="submit" variant="contained" color="primary">{formData.id ? 'Update' : 'Submit'}</Button>
            <Button variant="contained" color="error" onClick={handleCloseModal} style={{ marginLeft: '10px' }}>Cancel</Button>
          </form>
        </div>
      </Modal>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Booking For Payouts</TableCell>
            <TableCell>Invoice Number</TableCell>
            <TableCell>Issue Date</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Period</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice, index) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>{bookingForPayouts.find(booking => booking.id === invoice.bookingForPayouts_id)?.bookingReference}</TableCell>
              <TableCell>{invoice.invoice_number}</TableCell>
              <TableCell>{new Date(invoice.issue_date).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
              <TableCell>{invoice.period && invoice.period.split(' - ').map(date => new Date(date).toLocaleDateString()).join(' - ')}</TableCell>
              <TableCell> 
              {invoice.value}
              </TableCell>
              <TableCell>
                <span className={getPaymentStatus(invoice.id).textStyleClass}>
                {getPaymentStatus(invoice.id).visualIndicator} {getPaymentStatus(invoice.id).status}
                </span>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(index)}>Edit</Button>
                <Button onClick={() => handleDelete(invoice.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={confirmDeleteId !== null} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this invoice?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InvoicePage;