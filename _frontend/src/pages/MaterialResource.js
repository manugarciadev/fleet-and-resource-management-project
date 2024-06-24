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
  InputLabel
} from '@mui/material';
import axios from 'axios';

const MaterialResourcePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [materialResources, setMaterialResources] = useState([]);
  const [resourceOptions, setResourceOptions] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    status: '',
    resource_id: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/materialResources');
        setMaterialResources(response.data);

        const resourcesResponse = await axios.get('http://127.0.0.1:8000/api/resources');
        setResourceOptions(resourcesResponse.data);
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
      description: '',
      status: '',
      resource_id: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`http://127.0.0.1:8000/api/materialResources/${materialResources[editIndex].id}`, formData);
        const updatedMaterialResources = [...materialResources];
        updatedMaterialResources[editIndex] = formData;
        setMaterialResources(updatedMaterialResources);
        setShowSuccessAlert('Material resource updated successfully!');
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/materialResources', formData);
        setMaterialResources([...materialResources, response.data]);
        setShowSuccessAlert('Material resource added successfully!');
      }
      setFormData({
        description: '',
        status: '',
        resource_id: ''
      });
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (index) => {
    const { id, description, status, resource_id } = materialResources[index];
    setFormData({ id, description, status, resource_id }); // Passar o ID do material resource
    setEditIndex(index);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/materialResources/${confirmDeleteId}`);
      setMaterialResources(materialResources.filter(resource => resource.id !== confirmDeleteId));
      setShowDeleteSuccessAlert(true);
    } catch (error) {
      console.error('Error deleting material resource:', error);
    }
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const getResourceNameById = (resourceId) => {
    const resource = resourceOptions.find(resource => resource.id === resourceId);
    return resource ? resource.name : '';
  };

  return (
    <div>
      <h1>Material Resources</h1>
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>{showSuccessAlert}</Alert>
      )}
      {showDeleteSuccessAlert && (
        <Alert severity="success" onClose={() => setShowDeleteSuccessAlert(false)}>Material resource removed successfully!</Alert>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}><AddIcon /></Button>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
          <h2>{formData.id ? 'Edit Material Resource' : 'New Material Resource'}</h2>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <TextField
                name="description"
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.description}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <MenuItem value={0}>Occupied</MenuItem>
                <MenuItem value={1}>Free</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Resource</InputLabel>
              <Select
                name="resource_id"
                value={formData.resource_id}
                onChange={handleChange}
              >
                {resourceOptions.map(resource => (
                  <MenuItem key={resource.id} value={resource.id}>{resource.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">{formData.id ? 'Update' : 'Submit'}</Button>
            <Button variant="contained" color="error" onClick={handleCloseModal} style={{ marginLeft: '10px' }}>Cancel</Button>
          </form>
        </div>
      </Modal>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Resource</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {materialResources.map((resource, index) => (
            <TableRow key={resource.id}>
              <TableCell>{resource.description}</TableCell>
              <TableCell>{resource.status === 1 ? 'Free' : 'Occupied'}</TableCell>
              <TableCell>{getResourceNameById(resource.resource_id)}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(index)}><EditIcon /></Button>
                <Button onClick={() => handleDelete(resource.id)}><DeleteIcon style={{ color: 'red' }} /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={confirmDeleteId !== null} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this material resource?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">No</Button>
          <Button onClick={handleConfirmDelete} color="secondary">Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MaterialResourcePage;