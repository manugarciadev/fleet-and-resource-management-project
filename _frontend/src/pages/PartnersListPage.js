import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  TextField,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem
} from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const initialFormData = {
  legal_name: '',
  logo: '',
  public_name: '',
  description: '',
  website_and_social_media: {
    social_media: [{ platform: 'Website', link: '' }]
  },
  street_address: '',
  city: '',
  postal_code: '',
  state_region: '',
  country_code: '',
  mobile_phone: '',
  emergency_phone_number: '',
  email: '',
  company_registration_number: ''
};

const FinancePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [partners, setPartners] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editIndex, setEditIndex] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [successAlertVisible, setSuccessAlertVisible] = useState(false);
  const [deleteSuccessAlertVisible, setDeleteSuccessAlertVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const partnersResponse = await axios.get('http://127.0.0.1:8000/api/partners');
        setPartners(partnersResponse.data.partners);
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
    setFormData(initialFormData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_media')) {
      const [parentName, index, fieldName] = name.split('.');
      const newSocialMedia = [...formData.website_and_social_media.social_media];
      newSocialMedia[index][fieldName] = value;
      setFormData({
        ...formData,
        website_and_social_media: {
          ...formData.website_and_social_media,
          social_media: newSocialMedia
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddSocialMedia = () => {
    setFormData({
      ...formData,
      website_and_social_media: {
        ...formData.website_and_social_media,
        social_media: [
          ...formData.website_and_social_media.social_media,
          { platform: 'Website', link: '' }
        ]
      }
    });
  };

  const handleRemoveSocialMedia = (index) => {
    const newSocialMedia = [...formData.website_and_social_media.social_media];
    newSocialMedia.splice(index, 1);
    setFormData({
      ...formData,
      website_and_social_media: {
        ...formData.website_and_social_media,
        social_media: newSocialMedia
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editIndex !== null) {
        await axios.put(`http://127.0.0.1:8000/api/partners/${partners[editIndex].id}`, formData);
        const updatedPartners = [...partners];
        updatedPartners[editIndex] = formData;
        setPartners(updatedPartners);
        setSuccessAlertVisible('Partner updated successfully!');
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/partners', formData);
        setPartners([...partners, response.data]);
        setSuccessAlertVisible('Partner added successfully!');
      }
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
      setDeleteSuccessAlertVisible(true);
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  return (
    <div>
      <h1>Partners List</h1>
      {successAlertVisible && (
        <Alert severity="success" onClose={() => setSuccessAlertVisible(false)}>{successAlertVisible}</Alert>
      )}
      {deleteSuccessAlertVisible && (
        <Alert severity="success" onClose={() => setDeleteSuccessAlertVisible(false)}>Partner removed successfully!</Alert>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        startIcon={<AddIcon />}
        style={{ marginBottom: '20px' }}
      >
        Add New Partner
      </Button>
      <Modal open={openModal} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto', padding: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', maxWidth: '600px', maxHeight: '500px', overflowY: 'auto', scrollbarColor: 'gray transparent' }}>
          <h2>{editIndex !== null ? 'Edit Partner' : 'New Partner'}</h2>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="legal_name"
                  label="Legal Company Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.legal_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="public_name"
                  label="Public Company Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.public_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>

              {formData.website_and_social_media.social_media.map((socialMedia, index) => (
                <Grid item xs={12} key={index}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                      <Select
                        name={`social_media.${index}.platform`}
                        label="Platform"
                        variant="outlined"
                        fullWidth
                        value={socialMedia.platform}
                        onChange={handleChange}
                        size="small"
                      >
                        <MenuItem value="Website">Website</MenuItem>
                        <MenuItem value="Facebook">Facebook</MenuItem>
                        <MenuItem value="Instagram">Instagram</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        name={`social_media.${index}.link`}
                        label="Link"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        size="small"
                        value={socialMedia.link}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <IconButton color="secondary" onClick={() => handleRemoveSocialMedia(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleAddSocialMedia}
                  startIcon={<AddIcon />}
                >
                  Add Social Media Link
                </Button>
                </Grid>
              <Grid item xs={12}>
                <TextField
                  name="street_address"
                  label="Street Address"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.street_address}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="city"
                  label="City"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="postal_code"
                  label="Postal Code"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.postal_code}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="state_region"
                  label="State/Region"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.state_region}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="country_code"
                  label="Country Code"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.country_code}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="mobile_phone"
                  label="Mobile Phone"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.mobile_phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="emergency_phone_number"
                  label="Emergency Phone Number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.emergency_phone_number}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="company_registration_number"
                  label="Company Registration Number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.company_registration_number}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="logo"
                  label="Logo"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.logo}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  {editIndex !== null ? 'Update Partner' : 'Add Partner'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
        <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Function</TableCell>
            <TableCell>User ID</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {partners.map((partner, index) => (
            <TableRow key={partner.id}>
              <TableCell>{partner.id}</TableCell>
              <TableCell>
                <Link to={`/partners/${partner.id}`}>
                    {partner.legal_name}
                </Link>
              </TableCell>
              
              <TableCell>
              <IconButton onClick={() => handleEdit(partners.indexOf(partner))} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(partner.id)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!confirmDeleteId} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this partner?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FinancePage;