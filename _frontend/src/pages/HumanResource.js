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
  Alert
} from '@mui/material';
import axios from 'axios';

const HumanResourcePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [resources, setResources] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [humanResources, setHumanResources] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    employee_id: '',
    resource_id: ''
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

        const employeesResponse = await axios.get('http://127.0.0.1:8000/api/employees');
        setEmployees(employeesResponse.data);

        const humanResourcesResponse = await axios.get('http://127.0.0.1:8000/api/humanResources');
        setHumanResources(humanResourcesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.user.name : '';
  };

  const getResourceName = (resourceId) => {
    const resource = resources.find(res => res.id === resourceId);
    return resource ? resource.name : '';
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditIndex(null);
    setFormData({ description: '', employee_id: '', resource_id: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`http://127.0.0.1:8000/api/humanResources/${formData.id}`, formData);
        const updatedHumanResources = [...humanResources];
        updatedHumanResources[editIndex] = formData;
        setHumanResources(updatedHumanResources);
        setShowSuccessAlert('Human resource updated successfully!');
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/humanResources', formData);
        setHumanResources([...humanResources, response.data]);
        setShowSuccessAlert('Human resource added successfully!');
      }
      setFormData({ description: '', employee_id: '', resource_id: '' });
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (index) => {
    const { id, description, employee_id, resource_id } = humanResources[index];
    setFormData({ id, description, employee_id, resource_id });
    setEditIndex(index);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/humanResources/${confirmDeleteId}`);
      setHumanResources(humanResources.filter(resource => resource.id !== confirmDeleteId));
      setShowDeleteSuccessAlert(true);
    } catch (error) {
      console.error('Error deleting human resource:', error);
    }
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  return (
    <div>
      <h1>Human Resources</h1>
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>{showSuccessAlert}</Alert>
      )}
      {showDeleteSuccessAlert && (
        <Alert severity="success" onClose={() => setShowDeleteSuccessAlert(false)}>Human resource removed successfully!</Alert>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}><AddIcon /></Button>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
          <h2>{formData.id ? 'Edit Human Resource' : 'New Human Resource'}</h2>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="employee-select-label">Employee</InputLabel>
              <Select
                name="employee_id"
                label="Employee"
                value={formData.employee_id || ''}
                onChange={handleChange}
              >
                {employees.map(employee => (
                  <MenuItem key={employee.id} value={employee.id}>{employee.user.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="resource-select-label">Resource</InputLabel>
              <Select
                name="resource_id"
                label="Resource"
                value={formData.resource_id || ''}
                onChange={handleChange}
              >
                {resources.map(resource => (
                  <MenuItem key={resource.id} value={resource.id}>{resource.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="description"
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.description}
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
            <TableCell>Employee Name</TableCell>
            <TableCell>Resource Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {humanResources.map((resource, index) => (
            <TableRow key={resource.id}>
              <TableCell>{resource.id}</TableCell>
              <TableCell>{getEmployeeName(resource.employee_id)}</TableCell>
              <TableCell>{getResourceName(resource.resource_id)}</TableCell>
              <TableCell>{resource.description}</TableCell>
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
          Are you sure you want to delete this human resource?
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

export default HumanResourcePage;