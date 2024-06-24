import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMultiEmail } from 'react-multi-email';
import {
  Button,
  Modal,
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import axios from 'axios';

const FinancePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [partners, setPartners] = useState([]);
  const [formData, setFormData] = useState({
    company_description: '',
    website: '',
    booking_prefix: '',
    company_name: '',
    vat_number: '',
    registration_address: '',
    registration_number: '',
    preferred_language: '',
    preferred_currency: '',
    time_zone: '',
    provider_rates_exchange: '',
    userId: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);
  const [currentTab, setCurrentTab] = useState(0); // Adicionando estado para controlar a aba atual

  useEffect(() => {
    const fetchData = async () => {
      try {
        const partnersResponse = await axios.get('http://127.0.0.1:8000/api/partners');
        setPartners(partnersResponse.data);
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
      company_description: '',
      website: '',
      booking_prefix: '',
      company_name: '',
      vat_number: '',
      registration_address: '',
      registration_number: '',
      preferred_language: '',
      preferred_currency: '',
      time_zone: '',
      provider_rates_exchange: '',
      userId: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editIndex !== null) {
        await axios.put(`http://127.0.0.1:8000/api/partners/${partners[editIndex].id}`, formData);
        const updatedPartners = [...partners];
        updatedPartners[editIndex] = formData;
        setPartners(updatedPartners);
        setShowSuccessAlert('Partner updated successfully!');
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/partners', formData);
        setPartners([...partners, response.data]);
        setShowSuccessAlert('Partner added successfully!');
      }
      setFormData({
        company_description: '',
        website: '',
        booking_prefix: '',
        company_name: '',
        vat_number: '',
        registration_address: '',
        registration_number: '',
        preferred_language: '',
        preferred_currency: '',
        time_zone: '',
        provider_rates_exchange: '',
        userId: ''
      });
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (index) => {
    setFormData(partners[index]);
    setEditIndex(index);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/partners/${confirmDeleteId}`);
      setPartners(partners.filter(partner => partner.id !== confirmDeleteId));
      setShowDeleteSuccessAlert(true);
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <div>
      <h1>Finance</h1>
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>{showSuccessAlert}</Alert>
      )}
      {showDeleteSuccessAlert && (
        <Alert severity="success" onClose={() => setShowDeleteSuccessAlert(false)}>Partner removed successfully!</Alert>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
       
      </div>
      
      <Tabs value={currentTab} onChange={handleTabChange} indicatorColor="primary">
        <Tab label="Bookings for payout" />
        <Tab label="invoices" />
        <Tab label="Payment Confirmations" />
        <Tab label="Payment & tax details" />
      </Tabs>
      <div style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}></div> {/* Linha abaixo das tabs */}
      {/* Renderizar o conteúdo com base na aba atual */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        
      </div>
      {currentTab === 0 && (
        
        <Grid container spacing={2}>
          {partners.map((partner, index) => (
            <Grid item xs={12} key={partner.id}>
              <Card>
                <CardContent>
                  <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                      <Typography variant="h5" style={{ fontWeight: 'bold' }}>Company Information</Typography>
                    </Grid>
                    <Grid item>
                      <CardActions>
                        <Button variant="outlined" color="primary" onClick={() => handleEdit(index)} sx={{ borderRadius: '20px', border: '1px solid #3f51b5', margin: '0 5px' }}><EditIcon /></Button>
                        <Button variant="outlined" color="secondary" onClick={() => handleDelete(partner.id)} sx={{ borderRadius: '20px', border: '1px solid #f50057', margin: '0 5px' }}><DeleteIcon /></Button>
                      </CardActions>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Title </Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">{partner.company_name}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Identification number</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">2222</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Booking e-mail addresses</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">bucountrytour@gmail.com</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Finance e-mail addresses</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">bucountrytour@gmail.com</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Phone number</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">2231193</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Emergency phone number</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">9993123</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Address</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">CV</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Product code</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">001</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {currentTab === 1 && (
        <div>Service Tab Content</div>
      )}
      {currentTab === 2 && (
        <div>Product Tab Content</div>
      )}
      <Dialog open={confirmDeleteId !== null} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this partner?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FinancePage;