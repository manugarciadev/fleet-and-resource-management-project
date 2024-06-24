import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Modal, TextField, Table, TableHead, TableBody, TableCell, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Grid, Tab, Tabs, Box } from '@mui/material';
import axios from 'axios';

const SubscriptionPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [formData, setFormData] = useState({
    signatureDate: '',
    validity: '',
    proof: null
  });
  const [editIndex, setEditIndex] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);
  const [tabValue, setTabValue] = useState(0); // estado para controlar o valor da aba ativa

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subscriptionsResponse = await axios.get('http://127.0.0.1:8000/api/subscriptions');
        setSubscriptions(subscriptionsResponse.data);
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
      signatureDate: '',
      validity: '',
      proof: null
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    const formDataToSend = new FormData();
    formDataToSend.append('signatureDate', formData.signatureDate);
    formDataToSend.append('validity', formData.validity);
    formDataToSend.append('proof', formData.proof);
    formDataToSend.append('_method', 'PUT'); // Adicionando o campo _method com o valor PUT

    try {
      if (editIndex !== null) {
        await axios.post(`http://127.0.0.1:8000/api/subscriptions/${subscriptions[editIndex].id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post('http://127.0.0.1:8000/api/subscriptions', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      setShowSuccessAlert(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (index) => {
    setFormData(subscriptions[index]);
    setEditIndex(index);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/subscriptions/${confirmDeleteId}`);
      setSubscriptions(subscriptions.filter(subscription => subscription.id !== confirmDeleteId));
      setShowDeleteSuccessAlert(true);
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <h1>Subscriptions</h1>
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>Subscription {editIndex !== null ? 'updated' : 'added'} successfully!</Alert>
      )}
      {showDeleteSuccessAlert && (
        <Alert severity="success" onClose={() => setShowDeleteSuccessAlert(false)}>Subscription removed successfully!</Alert>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}><AddIcon /></Button>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
          <h2>{formData.id ? 'Edit Partner' : 'New Partner'}</h2>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Details" />
            <Tab label="Settings" />
          </Tabs>
          <Box sx={{ p: 3 }}>
            {tabValue === 0 && (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      name="signatureDate"
                      label="Signature Date"
                      type="date"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      size="small"
                      value={formData.signatureDate}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="validity"
                      label="Validity"
                      type="date"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      size="small"
                      value={formData.validity}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      component="label"
                      fullWidth
                      color="primary"
                      startIcon={<AddIcon />}
                    >
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, proof: e.target.files[0] })}
                        style={{ display: 'none' }}
                      />
                    </Button>
                  </Grid>
                </Grid>
                <div style={{ marginTop: '10px' }}>
                  <Button type="submit" variant="contained" color="primary" style={{ marginRight: '10px' }}>{formData.id ? 'Update' : 'Submit'}</Button>
                  <Button variant="contained" color="error" onClick={handleCloseModal}>Cancel</Button>
                </div>
              </form>
            )}
            {tabValue === 1 && (
              <div>
                Placeholder for Settings
              </div>
            )}
          </Box>
        </div>
      </Modal>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Signature Date</TableCell>
            <TableCell>Validity</TableCell>
            <TableCell>Proof</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subscriptions.map((subscription, index) => (
            <TableRow key={subscription.id}>
              <TableCell>{subscription.id}</TableCell>
              <TableCell>{subscription.signatureDate}</TableCell>
              <TableCell>{subscription.validity}</TableCell>
              <TableCell>
                <img src={`http://localhost:8000/storage/${subscription.proof}`} alt="Proof" />
              </TableCell>
              <TableCell>
                <Button variant="outlined" color="secondary" onClick={() => handleDelete(subscription.id)}>
                  <DeleteIcon />
                </Button>
                <Button variant="outlined" color="primary" onClick={() => handleEdit(index)}><EditIcon /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
};

export default SubscriptionPage;