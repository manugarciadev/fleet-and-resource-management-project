import React, { useState, useEffect } from 'react';
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
  InputLabel,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const DocumentPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [partners, setPartners] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    partner_id: '',
    employee_id: '',
    title: '',
    date: '',
    document: null,
    validity: ''
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const partnersResponse = await axios.get('http://localhost:8000/api/partners');
        setPartners(partnersResponse.data);

        const employeesResponse = await axios.get('http://localhost:8000/api/employees');
        setEmployees(employeesResponse.data);

        const documentsResponse = await axios.get('http://localhost:8000/api/documents');
        setDocuments(documentsResponse.data);
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
    setFormData({
      id: null,
      partner_id: '',
      employee_id: '',
      title: '',
      date: '',
      document: null,
      validity: ''
    });
  };

  const handleChange = (e) => {
    if (e.target.name === 'document') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('partner_id', formData.partner_id);
      formDataToSend.append('employee_id', formData.employee_id);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('document', formData.document);
      formDataToSend.append('validity', formData.validity);

      let response;
      if (formData.id) {
        // If document id exists, it's an update
        response = await axios.put(`http://localhost:8000/api/documents/${formData.id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Otherwise, it's a new document
        response = await axios.post('http://localhost:8000/api/documents', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      const updatedDocuments = [...documents];
      const index = updatedDocuments.findIndex(doc => doc.id === response.data.id);
      if (index !== -1) {
        // If document exists in the array, update it
        updatedDocuments[index] = response.data;
      } else {
        // If document doesn't exist in the array, add it
        updatedDocuments.push(response.data);
      }

      setDocuments(updatedDocuments);
      setShowSuccessAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEditClick = (document) => {
    setFormData({
      id: document.id,
      partner_id: document.partner_id,
      employee_id: document.employee_id,
      title: document.title,
      date: document.date,
      document: null, // Reset the document field to prevent accidental file upload
      validity: document.validity
    });
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/documents/${id}`);
      setDocuments(documents.filter(document => document.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
    setConfirmDeleteId(null);
  };

  const handleDownloadClick = (documentPath) => {
    fetch(`http://localhost:8000/storage/${documentPath}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `document_${documentPath}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error('Error downloading document:', error);
      });
  };

  const handleImageClick = (documentPath) => {
    window.open(`http://localhost:8000/storage/${documentPath}`, '_blank');
  };

  return (
    <div>
      <h1>Documents</h1>
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>Document added successfully!</Alert>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}><AddIcon /> Add Document</Button>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
          <h2>{formData.id ? 'Edit Document' : 'Add Document'}</h2>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="partner-select-label">Partner</InputLabel>
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
            <FormControl fullWidth margin="normal">
              <InputLabel id="employee-select-label">Employee</InputLabel>
              <Select
                name="employee_id"
                label="Employee"
                value={formData.employee_id}
                onChange={handleChange}
              >
                {employees.map(employee => (
                  <MenuItem key={employee.id} value={employee.id}>{employee.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="title"
              label="Title"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              name="date"
              label="Date"
              type="date"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.date}
              onChange={handleChange}
            />
            <input
              type="file"
              name="document"
              onChange={handleChange}
              style={{ margin: '10px 0' }}
            />
            <TextField
              name="validity"
              label="Validity"
              type="date"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.validity}
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
            <TableCell>Partner</TableCell>
            <TableCell>Employee</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Document</TableCell>
            <TableCell>Validity</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map(document => (
            <TableRow key={document.id}>
              <TableCell>{document.partner ? document.partner.company_name : '--'}</TableCell>
              <TableCell>{document.employee ? document.employee.name : '--'}</TableCell>
              <TableCell>{document.title}</TableCell>
              <TableCell>{document.date}</TableCell>
              <TableCell>
                <button onClick={() => handleImageClick(document.document)}>View Image</button>
                <button onClick={() => handleDownloadClick(document.document)}>Download</button>
              </TableCell>
              <TableCell>{document.validity}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditClick(document)}><EditIcon style={{ color: 'blue' }} /></IconButton>
                <IconButton onClick={() => setConfirmDeleteId(document.id)}><DeleteIcon style={{ color: 'red' }} /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={confirmDeleteId !== null} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this document?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)} color="primary">No</Button>
          <Button onClick={() => handleDelete(confirmDeleteId)} color="secondary">Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DocumentPage;