import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
  Select,
  MenuItem,
  InputLabel,
  Grid
} from '@mui/material';
import axios from 'axios';

const PaymentAndTaxDetailPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [details, setDetails] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [formData, setFormData] = useState({
    invoice_id: '',
    vat_number: '',
    contry_of_issue: '',
    tax_number: '',
    tin_country_of_issue: '',
    payment_data_status: '',
    payment_method: '',
    payment_frequency: '',
    commission_rate: '',
    currency: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showPostSuccessAlert, setShowPostSuccessAlert] = useState(false);
  const [showUpdateSuccessAlert, setShowUpdateSuccessAlert] = useState(false);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false); // Adicionando estado para o alerta de exclusão

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      invoice_id: '',
      vat_number: '',
      contry_of_issue: '',
      tax_number: '',
      tin_country_of_issue: '',
      payment_data_status: '',
      payment_method: '',
      payment_frequency: '',
      commission_rate: '',
      currency: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        const response = await axios.put(`http://127.0.0.1:8000/api/paymentAndTaxDetails/${formData.id}`, formData);
        const updatedDetail = response.data;
        const updatedDetails = details.map(detail => {
          if (detail.id === updatedDetail.id) {
            return updatedDetail;
          }
          return detail;
        });
        setDetails(updatedDetails);
        setShowUpdateSuccessAlert(true);
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/paymentAndTaxDetails', formData);
        setDetails([...details, response.data]);
        setShowPostSuccessAlert(true);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleEdit = (index) => {
    const { id, invoice_id, vat_number, contry_of_issue, tax_number, tin_country_of_issue, payment_data_status, payment_method, payment_frequency, commission_rate, currency } = details[index];
    setFormData({ id, invoice_id, vat_number, contry_of_issue, tax_number, tin_country_of_issue, payment_data_status, payment_method, payment_frequency, commission_rate, currency });
    setEditIndex(index);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/paymentAndTaxDetails/${confirmDeleteId}`);
      setDetails(details.filter(detail => detail.id !== confirmDeleteId));
      setShowDeleteSuccessAlert(true);
    } catch (error) {
      console.error('Erro ao excluir detalhes de pagamento e impostos:', error);
    }
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const getStatusIndicator = (status) => {
    return (
      <span className={status === 1 ? 'status-indicator green' : 'status-indicator red'}></span>
    );
  };

  return (
    <div>
      <h1>Detalhes de Pagamento e Impostos</h1>
      {showPostSuccessAlert && (
        <Alert severity="success" onClose={() => setShowPostSuccessAlert(false)}>Payment and tax details added successfully!</Alert>
      )}
      {showUpdateSuccessAlert && (
        <Alert severity="success" onClose={() => setShowUpdateSuccessAlert(false)}>Payment and tax details updated successfully!</Alert>
      )}
      {showDeleteSuccessAlert && (
        <Alert severity="success" onClose={() => setShowDeleteSuccessAlert(false)}>Payment and tax details removed successfully!</Alert>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}><AddIcon /> Add Payment & Tax Detail</Button>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
          <h2>{formData.id ? 'Edit Payment & Tax Detail' : 'New Payment & Tax Detail'}</h2>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel>Invoice ID</InputLabel>
                        <Select
                            name="invoice_id"
                            value={formData.invoice_id}
                            onChange={handleChange}
                        >
                            {invoices.map((invoice) => (
                                <MenuItem key={invoice.id} value={invoice.id}>{invoice.invoice_number}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    name="vat_number"
                    label="VAT Number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.vat_number}
                    onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    name="contry_of_issue"
                    label="Country of Issue"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.contry_of_issue}
                    onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    name="tax_number"
                    label="Tax Number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.tax_number}
                    onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    name="tin_country_of_issue"
                    label="TIN Country of Issue"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.tin_country_of_issue}
                    onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel>Payment Data Status</InputLabel>
                        <Select
                            name="payment_data_status"
                            value={formData.payment_data_status}
                            onChange={handleChange}
                        >
                            <MenuItem value={0}>Not Paid</MenuItem>
                            <MenuItem value={1}>Paid</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    name="payment_method"
                    label="Payment Method"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.payment_method}
                    onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    name="payment_frequency"
                    label="Payment Frequency"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.payment_frequency}
                    onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    name="commission_rate"
                    label="Commission Rate"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.commission_rate}
                    onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    name="currency"
                    label="Currency"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={formData.currency}
                    onChange={handleChange}
                    />
                </Grid>
            </Grid>

            <Button type="submit" variant="contained" color="primary">{formData.id ? 'Update' : 'Submit'}</Button>
            <Button variant="contained" color="error" onClick={handleCloseModal} style={{ marginLeft: '10px' }}>Cancel</Button>
          </form>
        </div>
      </Modal>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Invoice ID</TableCell>
            <TableCell>VAT Number</TableCell>
            <TableCell>Country of Issue</TableCell>
            <TableCell>Tax Number</TableCell>
            <TableCell>TIN Country of Issue</TableCell>
            <TableCell>Payment Data Status</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Payment Frequency</TableCell>
            <TableCell>Commission Rate</TableCell>
            <TableCell>Currency</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {details.map((detail, index) => (
            <TableRow key={detail.id}>
              <TableCell>{detail.invoice_id}</TableCell>
              <TableCell>{detail.vat_number}</TableCell>
              <TableCell>{detail.country_of_issue}</TableCell>
              <TableCell>{detail.tax_number}</TableCell>
              <TableCell>{detail.tin_country_of_issue}</TableCell>
              <TableCell>{detail.payment_data_status === 1 ? 'Paid' : 'Not Paid'}</TableCell>
              <TableCell>{detail.payment_method}</TableCell>
              <TableCell>{detail.payment_frequency}</TableCell>
              <TableCell>{detail.commission_rate}</TableCell>
              <TableCell>{detail.currency}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(index)}><EditIcon /></Button>
                <Button onClick={() => handleDelete(detail.id)}><DeleteIcon style={{ color: 'red' }} /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={confirmDeleteId !== null} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this payment and tax detail?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">No</Button>
          <Button onClick={handleConfirmDelete} color="secondary">Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default PaymentAndTaxDetailPage;