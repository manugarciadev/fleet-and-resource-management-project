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
  Grid,
  FormControl,
  Select,
  InputLabel,
  MenuItem
} from '@mui/material';
import axios from 'axios';

const ContractPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [contracts, setContracts] = useState([]);
  const [partners, setPartners] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [contractTypes, setContractTypes] = useState([]);
  const [signatures, setSignatures] = useState([]); // Variável de estado para armazenar as signatures
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    start_date: '',
    end_date: '',
    type_id: '',
    signature_id: '',
    employee_id: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const contractsResponse = await axios.get('http://127.0.0.1:8000/api/contracts');
            setContracts(contractsResponse.data);

             // Carregar parceiros
            const partnersResponse = await axios.get('http://127.0.0.1:8000/api/partners');
            setPartners(partnersResponse.data);

            // Carregar funcionários
            const employeesResponse = await axios.get('http://127.0.0.1:8000/api/employees');
            setEmployees(employeesResponse.data);

            // Carregar tipos de contrato
            const contractTypesResponse = await axios.get('http://127.0.0.1:8000/api/contract_types');
            setContractTypes(contractTypesResponse.data);

            // Carregar as signatures de subscriptions
            const subscriptionsResponse = await axios.get('http://127.0.0.1:8000/api/subscriptions');
            const subscriptionIds = subscriptionsResponse.data.map(subscription => subscription.id);
            setSignatures(subscriptionIds);
            
         
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

    fetchData();
  }, []);

  const getPartnerName = (partnerId) => {
    const partner = partners.find(partner => partner.id === partnerId);
    return partner ? partner.company_name : 'N/A';
  };
  
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(employee => employee.id === employeeId);
    return employee ? employee.user.name : 'N/A';
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditIndex(null);
    setFormData({
        code: '',
        description: '',
        start_date: '',
        end_date: '',
        type_id: '',
        signature_id: '',
        employee_id: '' 
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editIndex !== null) {
        await axios.put(`http://127.0.0.1:8000/api/contracts/${contracts[editIndex].id}`, formData);
        const updatedContracts = [...contracts];
        updatedContracts[editIndex] = formData;
        setContracts(updatedContracts);
        setShowSuccessAlert('Contract updated successfully!');
        logActivity('update', contracts[editIndex].id);
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/contracts', formData);
        setContracts([...contracts, response.data]);
        setShowSuccessAlert('Contract added successfully!');
        logActivity('create', response.data.id);
      }

      setFormData({
        code: '',
        description: '',
        start_date: '',
        end_date: '',
        type_id: '',
        signature_id: '',
        employee_id: ''
      });
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (index) => {
    setFormData(contracts[index]);
    setEditIndex(index);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/contracts/${confirmDeleteId}`);
      setContracts(contracts.filter(contract => contract.id !== confirmDeleteId));
      setShowDeleteSuccessAlert(true);
      logActivity('delete', confirmDeleteId);
    } catch (error) {
      console.error('Error deleting contract:', error);
    }
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const getStatusColor = (contract) => {
    const currentDate = new Date();
    const startDate = new Date(contract.start_date);
    const endDate = new Date(contract.end_date);

    if (currentDate < startDate || currentDate > endDate) {
      return 'red'; // Desativado
    } else {
      return 'green'; // Ativo
    }
  };

  const getStatusText = (contract) => {
    const currentDate = new Date();
    const startDate = new Date(contract.start_date);
    const endDate = new Date(contract.end_date);
  
    if (currentDate < startDate || currentDate > endDate) {
      return 'Inativo';
    } else {
      return 'Ativo';
    }
  };

  const logActivity = async (action, contractId) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/log_activities', {
        action,
        contract_id: contractId
      });
      console.log('Activity logged successfully!');
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return (
    <div>
      <h1>Contracts</h1>
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>{showSuccessAlert}</Alert>
      )}
      {showDeleteSuccessAlert && (
        <Alert severity="success" onClose={() => setShowDeleteSuccessAlert(false)}>Contract removed successfully!</Alert>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
      <Button variant="contained" color="primary" onClick={handleOpenModal}><AddIcon /></Button>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
        <h2>{formData.id ? 'Edit Contract' : 'New Contract'}</h2>
          <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
                 <Grid item xs={6}>
                    <TextField
                    name="code"
                    label="Code"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    size="small"
                    value={formData.code}
                    onChange={handleChange}
                    />
                 </Grid>
                 <Grid item xs={6}>
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
                <Grid item xs={6}>
                    <TextField
                    name="start_date"
                    label="Start Date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    size="small"
                    value={formData.start_date}
                    onChange={handleChange}
                    />
                 </Grid>
                 <Grid item xs={6}>
                    <TextField
                    name="end_date"
                    label="End Date"
                    type="date"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    size="small"
                    value={formData.end_date}
                    onChange={handleChange}
                    />
                 </Grid>

                <Grid item xs={6}>
                <FormControl fullWidth size="small">
                    <InputLabel id="type-label">Contract Type</InputLabel>
                    <Select
                    labelId="type-label"
                    id="type"
                    name="type_id"
                    label="Contract Type"
                    value={formData.type_id}
                    onChange={handleChange}
                    >
                    {contractTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                        {type.name}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </Grid>

                <Grid item xs={6}>
                <FormControl fullWidth size="small">
                    <InputLabel id="signature-label">Signature ID</InputLabel>
                    <Select
                        labelId="signature-label"
                        id="signature"
                        name="signature_id"
                        label="Signature ID"
                        value={formData.signature_id}
                        onChange={handleChange}
                        >
                        {signatures.map((signatureId) => (
                            <MenuItem key={signatureId} value={signatureId}>
                            {signatureId}
                            </MenuItem>
                        ))}
                        </Select>
                </FormControl>
                </Grid>

                
                <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="employee-label">Employee</InputLabel>
                <Select
                   
                    id="employee"
                    name="employee_id"
                    label="Employee"
                    
                    value={formData.employee_id || ''}
                    onChange={handleChange}
                >
                    {employees.map((employee) => (
                    <MenuItem key={employee.id} value={employee.id}>
                        {employee.user ? employee.user.name : 'Unknown'}
                    </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
                <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="partner-label">Partner</InputLabel>
                <Select
                  labelId="partner-label"
                  id="partner"
                  name="partner_id"
                  label="Partner"
                  value={formData.partner_id || ''}
                  onChange={handleChange}
                >
                  {partners.map((partner) => (
                    <MenuItem key={partner.id} value={partner.id}>
                      {partner.company_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
                
            <Grid item xs={6}>
            <Button type="submit" variant="contained" color="primary">{formData.id ? 'Update' : 'Submit'}</Button>
            <Button variant="contained" color="error" onClick={handleCloseModal} style={{ marginLeft: '10px' }}>Cancel</Button>
            </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
     
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Signature Date</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Partner</TableCell>
            <TableCell>Employee</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contracts.map((contract, index) => (
            <TableRow key={contract.id}>
              <TableCell>{contract.code}</TableCell>
              <TableCell>{contract.description}</TableCell>
              <TableCell>{}</TableCell>
              <TableCell>{contract.start_date}</TableCell>
              <TableCell>{contract.end_date}</TableCell>
              <TableCell>
                <span style={{ color: getStatusColor(contract), fontSize: '20px' }}>●</span>
                {getStatusText(contract)}
              </TableCell>
              <TableCell>{getPartnerName(contract.partner_id)}</TableCell>
              <TableCell>{getEmployeeName(contract.employee_id)}</TableCell>
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
          Are you sure you want to delete this contract?
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

export default ContractPage;