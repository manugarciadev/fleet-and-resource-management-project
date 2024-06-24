import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Modal, TextField, Table, TableHead, TableBody, TableCell, TableRow, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Tab, Tabs, Box, MenuItem, Select, InputLabel, FormControl} from '@mui/material';
import axios from 'axios';

const UserPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({  
    userType: 'employee',
    name: '',
    email: '',
    telephone: '',
    whatsapp: '',
    password: '',
    humanResource: { description: '', employee_id: '', resource_id: '' }, // Inicialize os objetos humanResource, materialResource e allResource
    materialResource: { description: '', status: '', resource_id: '' },
    allResource: { description: '', status: '', employee_id: '', resource_id: '' }
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditIndex(null);
    setFormData({ userType: 'employee', name: '', email: '', telephone: '', whatsapp: '', password: '', humanResource: { description: '', employee_id: '', resource_id: '' }, materialResource: { description: '', status: '', resource_id: '' }, allResource: { description: '', status: '', employee_id: '', resource_id: '' } });
    setFormErrors({}); // Limpar erros de validação
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length === 0) {
      if (editIndex !== null) {
        try {
          const response = await axios.put(`http://127.0.0.1:8000/api/users/${users[editIndex]._id}`, formData);
          const updatedUsers = [...users];
          updatedUsers[editIndex] = response.data;
          setUsers(updatedUsers);
          setEditIndex(null);
          setShowSuccessAlert('User updated successfully!');
        } catch (error) {
          console.error('Error updating user:', error);
        }
      } else {
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/employee', formData);
          setUsers([...users, response.data]);
          setShowSuccessAlert('User created successfully!');
        } catch (error) {
          console.error('Error creating user:', error);
        }
      }
      setFormData({ userType: 'employee', name: '', email: '', telephone: '', whatsapp: '', password: '', humanResource: { description: '', employee_id: '', resource_id: '' }, materialResource: { description: '', status: '', resource_id: '' }, allResource: { description: '', status: '', employee_id: '', resource_id: '' } });
      handleCloseModal();
    } else {
      setFormErrors(errors);
    }
  };

  const validateForm = (formData) => {
    const errors = {};
    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 10) { // Verificar se o campo tem menos de 10 caracteres
      errors.name = 'Name must be at least 10 characters long';
    }
    if (!formData.email || !formData.email.trim()) {
      errors.email = 'Email is required';
    }
    if (!formData.telephone || !formData.telephone.trim()) {
      errors.telephone = 'Telephone is required';
    }
    if (!formData.whatsapp || !formData.whatsapp.trim()) {
      errors.whatsapp = 'Whatsapp is required';
    }
   
    return errors;
  };

  const handleEdit = (index) => {
    setFormData(users[index]);
    setEditIndex(index);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${confirmDeleteId}`);
      setUsers(users.filter(user => user._id !== confirmDeleteId));
      setShowDeleteSuccessAlert(true);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  return (
    <div>
      <h1>Users</h1>
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>{showSuccessAlert}</Alert>
      )}
      {showDeleteSuccessAlert && (
        <Alert severity="success" onClose={() => setShowDeleteSuccessAlert(false)}>User removed successfully!</Alert>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}><AddIcon /></Button>
      </div>
      <ModalForm open={openModal} onClose={handleCloseModal} formData={formData} formErrors={formErrors} handleChange={handleChange} handleSubmit={handleSubmit} users={users} />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Telephone</TableCell>
            <TableCell>Whatsapp</TableCell>
            <TableCell>Password</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user._id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.telephone}</TableCell>
              <TableCell>{user.whatsapp}</TableCell>
              <TableCell>{user.password}</TableCell>
              <TableCell>
                <Button variant="outlined" color="secondary" onClick={() => handleDelete(user._id)}>
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
          Are you sure you want to delete this user?
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

const ModalForm = ({ open, onClose, formData, formErrors, handleChange, handleSubmit, users }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
        <h2>{formData.userType === 'employee' ? 'Employee' : 'Partner'} Details</h2>
        <FormControl fullWidth margin="normal">
          <InputLabel id="userType-label">User Type</InputLabel>
          <Select
            name="userType"
            label="User Type"
            value={formData.userType}
            onChange={handleChange}
          >
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="partner">Partner</MenuItem>
          </Select>
        </FormControl>
        {(formData.userType === 'partner') && (
          <FormControl fullWidth margin="normal">
            <InputLabel id="resourceType-label">Resource Type</InputLabel>
            <Select
              name="resourceType"
              label="Resource Type"
              value={formData.resourceType}
              onChange={handleChange}
            >
              <MenuItem value="humanResource">Human Resource</MenuItem>
              <MenuItem value="materialResource">Material Resource</MenuItem>
              <MenuItem value="all">All Resources</MenuItem>
            </Select>
          </FormControl>
        )}
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Details" />
          {(formData.userType === 'employee' || (formData.userType === 'partner' && formData.resourceType !== 'materialResource')) && (
            <Tab label="Human Resource" />
          )}
          {(formData.userType === 'partner' && (formData.resourceType === 'materialResource' || formData.resourceType === 'all')) && (
            <Tab label="Material Resource" />
          )}
        </Tabs>
        <Box sx={{ p: 4 }}>
          {tabValue === 0 && (
            <form onSubmit={handleSubmit}>
              <TextField
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                fullWidth
                margin="normal"
              />
              {/* Campos de detalhes do usuário */}
            </form>
          )}
          {(tabValue === 1 || tabValue === 2) && (
            <form onSubmit={handleSubmit}>
              <TextField
                name="description"
                label="Description"
                value={(formData.resourceType === 'materialResource' || formData.resourceType === 'all') ? formData.materialResource.description : formData.humanResource.description}
                onChange={handleChange}
                error={!!formErrors.description}
                helperText={formErrors.description}
                fullWidth
                margin="normal"
              />
              {(formData.resourceType === 'humanResource' || formData.resourceType === 'all') && (
                <>
                  <TextField
                    name="employee_id"
                    label="Employee ID"
                    value={formData.humanResource.employee_id}
                    onChange={handleChange}
                    error={!!formErrors.employee_id}
                    helperText={formErrors.employee_id}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    name="resource_id"
                    label="Resource ID"
                    value={formData.humanResource.resource_id}
                    onChange={handleChange}
                    error={!!formErrors.resource_id}
                    helperText={formErrors.resource_id}
                    fullWidth
                    margin="normal"
                  />
                </>
              )}
              {(formData.resourceType === 'materialResource' || formData.resourceType === 'all') && (
                <>
                  <TextField
                    name="status"
                    label="Status"
                    value={formData.materialResource.status}
                    onChange={handleChange}
                    error={!!formErrors.status}
                    helperText={formErrors.status}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    name="resource_id"
                    label="Resource ID"
                    value={formData.materialResource.resource_id}
                    onChange={handleChange}
                    error={!!formErrors.resource_id}
                    helperText={formErrors.resource_id}
                    fullWidth
                    margin="normal"
                  />
                </>
              )}
              {/* Campos de recurso humano ou material */}
            </form>
          )}
        </Box>
      </div>
    </Modal>
  );
}

export default UserPage;