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

const RenovationPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [renovations, setRenovations] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    function: '',
    user_id: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesResponse = await axios.get('http://127.0.0.1:8000/api/renovations');
        setRenovations(employeesResponse.data);

        const contractsResponse = await axios.get('http://127.0.0.1:8000/api/contracts');
        setContracts(contractsResponse.data);

        const usersResponse = await axios.get('http://127.0.0.1:8000/api/users');
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchEmployees();
  }, []);

  const getUserName = (userId) => {
    const user = users.find(user => user.id === userId);
    return user ? user.name : 'Unknown';
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditIndex(null);
    setFormData({ function: '', user_id: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editIndex !== null) {
        await axios.put(`http://127.0.0.1:8000/api/employees/${renovations[editIndex].id}`, formData);
        const updatedEmployees = [...renovations];
        updatedEmployees[editIndex] = formData;
        setRenovations(updatedEmployees);
        setShowSuccessAlert('Employee updated successfully!');
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/employees', formData);
        setRenovations([...renovations, response.data]);
        setShowSuccessAlert('Employee added successfully!');
      }
      setFormData({ function: '', user_id: '' });
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (index) => {
    setFormData(renovations[index]);
    setEditIndex(index);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/renovations/${confirmDeleteId}`);
      setRenovations(renovations.filter(renovation => renovation.id !== confirmDeleteId));
      setShowDeleteSuccessAlert(true);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  return (
    <div>
      <h1>Renovation</h1>
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>{showSuccessAlert}</Alert>
      )}
      {showDeleteSuccessAlert && (
        <Alert severity="success" onClose={() => setShowDeleteSuccessAlert(false)}>Employee removed successfully!</Alert>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}><AddIcon /></Button>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
          <h2>{formData.id ? 'Edit Employee' : 'New Employee'}</h2>
          <form onSubmit={handleSubmit}>

            <FormControl fullWidth margin="normal">
            <InputLabel id="demo-select-small-label">Name</InputLabel>
                <Select
                    name="user_id"
                    label="Name"
                    value={formData.user_id || ''}
                    onChange={handleChange}
                    >
                    {users.map(user => (
                        <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                    ))}
            </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
  <InputLabel id="contract-select-label">Contract Code</InputLabel>
  <Select
    name="contract_id"
    label="Contract Code"
    value={formData.contract_id || ''}
    onChange={handleChange}
  >
    {contracts.map(contract => (
      <MenuItem key={contract.id} value={contract.id}>{contract.code}</MenuItem>
    ))}
  </Select>
</FormControl>
         
            <TextField
              name="function"
              label="Function"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.function}
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
            <TableCell>Contract Code</TableCell>
            <TableCell>Renewal Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>value</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renovations.map((renovation, index) => (
            <TableRow key={renovation.id}>
              <TableCell>{renovation.id}</TableCell>
              <TableCell>{getUserName(renovation.user_id)}</TableCell>
              <TableCell>{renovation.renewal_date}</TableCell>
              <TableCell>{renovation.description}</TableCell>
              <TableCell>
              {`€ ${renovation.value.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${renovation.value.currency}`}
              </TableCell>
              <TableCell>
                <Button variant="outlined" color="secondary" onClick={() => handleDelete(renovation.id)}>
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
          Are you sure you want to delete this employee?
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

export default RenovationPage;