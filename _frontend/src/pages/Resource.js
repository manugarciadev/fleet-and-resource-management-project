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
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import axios from 'axios';

const ResourcePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [resources, setResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [partners, setPartners] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type_id: '',
    user_id: '',
    partner_id: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resourcesResponse = await axios.get('http://127.0.0.1:8000/api/resources');
        setResources(resourcesResponse.data);

        const usersResponse = await axios.get('http://127.0.0.1:8000/api/users');
        setUsers(usersResponse.data);

        const employeesResponse = await axios.get('http://127.0.0.1:8000/api/resource_types');
        setResourceTypes(employeesResponse.data);

        const partnersResponse = await axios.get('http://127.0.0.1:8000/api/partners');
        setPartners(partnersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getResourceTypeName = (typeId) => {
    const type = resourceTypes.find(type => type.id === typeId);
    return type ? type.name : '';
  };
  
  const getUserName = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? user.name : '';
  };
  
  const getPartnerName = (partnerId) => {
    const partner = partners.find(partner => partner.id === partnerId);
    return partner ? partner.company_name : '';
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditIndex(null);
    setFormData({
        name: '',
        type_id: '',
        user_id: '',
        partner_id: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editIndex !== null) {
        await axios.put(`http://127.0.0.1:8000/api/resources/${resources[editIndex].id}`, formData);
        const updatedResources = [...resources];
        updatedResources[editIndex] = formData;
        setResources(updatedResources);
        setShowSuccessAlert('Resource updated successfully!');
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/resources', formData);
        setResources([...resources, response.data]);
        setShowSuccessAlert('Resource added successfully!');
      }
      setFormData({
        name: '',
        type_id: '',
        user_id: '',
        partner_id: ''
      });
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (index) => {
    setFormData(resources[index]);
    setEditIndex(index);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/resources/${confirmDeleteId}`);
      setResources(resources.filter(resource => resource.id !== confirmDeleteId));
      setShowDeleteSuccessAlert(true);
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  return (
    <div>
      <h1>Resources</h1>
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>{showSuccessAlert}</Alert>
      )}
      {showDeleteSuccessAlert && (
        <Alert severity="success" onClose={() => setShowDeleteSuccessAlert(false)}>Resource removed successfully!</Alert>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}><AddIcon /></Button>
      </div>
      {/* Modal for Adding/Edit Resource */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
          <h2>{formData.id ? 'Edit Resource' : 'New Resource'}</h2>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  name="name"
                  label="Name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Resource Types</InputLabel>
                  <Select
                    name="type_id" 
                    label="Resource Types"
                    value={formData.type_id}
                    onChange={handleChange}
                  >
                    {resourceTypes.map(resourceType => (
                      <MenuItem key={resourceType.id} value={resourceType.id}>{resourceType.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
           
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>User</InputLabel>
                  <Select
                    name="user_id"
                    label="User"
                    value={formData.user_id}
                    onChange={handleChange}
                  >
                    {users.map(user => (
                      <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Partner</InputLabel>
                  <Select
                    name="partner_id" 
                    label="Partner"
                    value={formData.partner_id}
                    onChange={handleChange}
                  >
                    {partners.map(partner => (
                      <MenuItem key={partner.id} value={partner.id}>{partner.company_name}</MenuItem>
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
      {/* Table of Resources */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Types</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Partner</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resources.map((resource, index) => (
            <TableRow key={resource.id}>
              <TableCell>{resource.id}</TableCell>
              <TableCell>{resource.name}</TableCell>
              <TableCell>{getResourceTypeName(resource.type_id)}</TableCell>
              <TableCell>{getUserName(resource.user_id)}</TableCell>
              <TableCell>{getPartnerName(resource.partner_id)}</TableCell>
             
              <TableCell>
                <Button variant="outlined" color="secondary" onClick={() => handleDelete(resource.id)}>
                  <DeleteIcon />
                </Button>
                <Button variant="outlined" color="primary" onClick={() => handleEdit(index)}><EditIcon /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Dialog for Confirming Resource Deletion */}
      <Dialog open={confirmDeleteId !== null} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this resource?
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

export default ResourcePage;