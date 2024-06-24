import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Modal, TextField, Table, TableHead, TableBody, TableCell, TableRow, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

const ContractTypePage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [contractTypes, setContractTypes] = useState([]);
  const [formData, setFormData] = useState({  
    name: '',
    description: '',
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchContractTypes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/contract_types');
        setContractTypes(response.data);
      } catch (error) {
        console.error('Error fetching contract types:', error);
      }
    };

    fetchContractTypes();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditIndex(null);
    setFormData({ name: '', description: '' });
    setFormErrors({}); // Limpar erros de validação
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length === 0) {
      if (editIndex !== null) {
        try {
          const response = await axios.put(`http://127.0.0.1:8000/api/contract_types/${contractTypes[editIndex].id}`, formData);
          const updatedContractTypes = [...contractTypes];
          updatedContractTypes[editIndex] = response.data;
          setContractTypes(updatedContractTypes);
          setEditIndex(null);
          setShowSuccessAlert('Contract type alterado com sucesso!');
        } catch (error) {
          console.error('Error updating contract type:', error);
        }
      } else {
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/contract_types', formData);
          setContractTypes([...contractTypes, response.data]);
          setShowSuccessAlert('Contract type inserido com sucesso!');
        } catch (error) {
          console.error('Error creating contract type:', error);
        }
      }
      setFormData({ name: '', description: '' });
      handleCloseModal();
    } else {
      setFormErrors(errors);
    }
  };

  const validateForm = (formData) => {
  const errors = {};
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  } else if (formData.name.trim().length < 10) { // Verificar se o campo tem menos de 10 caracteres
    errors.name = 'Name must be at least 10 characters long';
  }
  if (!formData.description.trim()) {
    errors.description = 'Description is required';
  }
  return errors;
};

  const handleEdit = (index) => {
    setFormData(contractTypes[index]);
    setEditIndex(index);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/contract_types/${confirmDeleteId}`);
      setContractTypes(contractTypes.filter(contract => contract.id !== confirmDeleteId));
      setShowDeleteSuccessAlert(true);
    } catch (error) {
      console.error('Error deleting contract type:', error);
    }
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  return (
    <div>
      <h1>Contract Types</h1>
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>{showSuccessAlert}</Alert>
      )}
      {showDeleteSuccessAlert && (
        <Alert severity="success" onClose={() => setShowDeleteSuccessAlert(false)}>Contract Type removido com sucesso!</Alert>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}><AddIcon /></Button>
      </div>
      <ModalForm open={openModal} onClose={handleCloseModal} formData={formData} formErrors={formErrors} handleChange={handleChange} handleSubmit={handleSubmit} />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contractTypes.map((contract, index) => (
            <TableRow key={contract.id}>
              <TableCell>{contract.id}</TableCell>
              <TableCell>{contract.name}</TableCell>
              <TableCell>{contract.description}</TableCell>
              <TableCell>
                <Button variant="outlined" color="secondary" onClick={() => handleDelete(contract.id)}>
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
          Are you sure you want to delete this contract type?
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

const ModalForm = ({ open, onClose, formData, formErrors, handleChange, handleSubmit }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
        <h2>{formData.id ? 'Edit Contract Type' : 'New Contract Type'}</h2>
        <form onSubmit={handleSubmit}>
            <TextField
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
            error={!!formErrors.name && formData.name.trim() === ''} // Verificar se o campo está vazio
            helperText={formErrors.name && formData.name.trim() === '' ? 'Name is required' : formErrors.name} // Exibir a mensagem de erro apenas se o campo estiver vazio
            />
            <TextField
            name="description"
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            error={!!formErrors.description && formData.description.trim() === ''} // Verificar se o campo está vazio
            helperText={formErrors.description && formData.description.trim() === '' ? 'Description is required' : formErrors.description} // Exibir a mensagem de erro apenas se o campo estiver vazio
            />
            <Button type="submit" variant="contained" color="primary">{formData.id ? 'Update' : 'Submit'}</Button>
            <Button variant="contained" color="error" onClick={onClose} style={{ marginLeft: '10px' }}>Cancel</Button>
        </form>
      </div>
    </Modal>
  );
}

export default ContractTypePage;