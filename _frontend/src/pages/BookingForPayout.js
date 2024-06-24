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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Grid
} from '@mui/material';
import axios from 'axios';

const BookingForPayoutPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [bookingForPayouts, setBookingForPayouts] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    bookingReference: '',
    leadTraveler: '',
    productCode: '',
    optionCode: '',
    activityDate: '',
    bookingDate: '',
    retailRate: '',
    netRate: '',
    product_id: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingResponse = await axios.get('http://127.0.0.1:8000/api/bookingForPayouts');
        setBookingForPayouts(bookingResponse.data);

        const productResponse = await axios.get('http://127.0.0.1:8000/api/products');
        setProducts(productResponse.data);
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
      bookingReference: '',
      leadTraveler: '',
      productCode: '',
      optionCode: '',
      activityDate: '',
      bookingDate: '',
      retailRate: '',
      netRate: '',
      product_id: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`http://127.0.0.1:8000/api/bookingForPayouts/${formData.id}`, formData);
        const updatedBookingForPayouts = [...bookingForPayouts];
        updatedBookingForPayouts[editIndex] = formData;
        setBookingForPayouts(updatedBookingForPayouts);
        setShowSuccessAlert('Booking for Payout updated successfully!');
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/bookingForPayouts', formData);
        setBookingForPayouts([...bookingForPayouts, response.data]);
        setShowSuccessAlert('Booking for Payout added successfully!');
      }
      setFormData({
        bookingReference: '',
        leadTraveler: '',
        productCode: '',
        optionCode: '',
        activityDate: '',
        bookingDate: '',
        retailRate: '',
        netRate: '',
        product_id: ''
      });
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (index) => {
    const { id, bookingReference, leadTraveler, productCode, optionCode, activityDate, bookingDate, retailRate, netRate, product_id } = bookingForPayouts[index];
    setFormData({ id, bookingReference, leadTraveler, productCode, optionCode, activityDate, bookingDate, retailRate, netRate, product_id });
    setEditIndex(index);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/bookingForPayouts/${confirmDeleteId}`);
      setBookingForPayouts(bookingForPayouts.filter(booking => booking.id !== confirmDeleteId));
      setShowDeleteSuccessAlert(true);
    } catch (error) {
      console.error('Error deleting booking for payout:', error);
    }
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  return (
    <div>
      <h1>Booking for Payouts</h1>
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>{showSuccessAlert}</Alert>
      )}
      {showDeleteSuccessAlert && (
        <Alert severity="success" onClose={() => setShowDeleteSuccessAlert(false)}>Booking for Payout removed successfully!</Alert>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}><AddIcon /></Button>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
          <h2>{formData.id ? 'Edit Booking for Payout' : 'New Booking for Payout'}</h2>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="bookingReference"
                  label="Booking Reference"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.bookingReference}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="leadTraveler"
                  label="Lead Traveler"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.leadTraveler}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="product-code-label">Product Code</InputLabel>
                  <Select
                    name="productCode"
                    labelId="product-code-label"
                    value={formData.productCode}
                    onChange={(e) => setFormData({ ...formData, productCode: e.target.value })}
                  >
                    {products.map(product => (
                      <MenuItem key={product.id} value={product.code}>{product.code}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="optionCode"
                  label="Option Code"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.optionCode}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="activityDate"
                  label="Activity Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.activityDate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="bookingDate"
                  label="Booking Date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.bookingDate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="retailRate"
                  label="Retail Rate"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.retailRate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="netRate"
                  label="Net Rate"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formData.netRate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="product-id-label">Product Name</InputLabel>
                  <Select
                    name="product_id"
                    labelId="product-id-label"
                    value={formData.product_id}
                    onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  >
                    {products.map(product => (
                      <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
            <TableCell>ID</TableCell>
            <TableCell>Booking Reference</TableCell>
            <TableCell>Lead traveler</TableCell>
            <TableCell>Product code</TableCell>
            <TableCell>Option code</TableCell>
            <TableCell>Activity date</TableCell>
            <TableCell>Booking date</TableCell>
            <TableCell>Retail rate</TableCell>
            <TableCell>Net rate</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookingForPayouts.map((booking, index) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.id}</TableCell>
              <TableCell>{booking.bookingReference}</TableCell>
              <TableCell>{booking.leadTraveler}</TableCell>
              <TableCell>{booking.productCode}</TableCell>
              <TableCell>{booking.optionCode}</TableCell>
              <TableCell>{booking.activityDate}</TableCell>
              <TableCell>{booking.bookingDate}</TableCell>
              <TableCell>{booking.retailRate}</TableCell>
              <TableCell>{booking.netRate}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(index)}><EditIcon /></Button>
                <Button onClick={() => handleDelete(booking.id)}><DeleteIcon style={{ color: 'red' }} /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={confirmDeleteId !== null} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this booking for payout?
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

export default BookingForPayoutPage;