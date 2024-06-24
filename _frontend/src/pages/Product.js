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

const ProductPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [humanOptions, setHumanOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    value: '',
    human_id: '',
    material_id: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get('http://127.0.0.1:8000/api/products');
        setProducts(productsResponse.data);

        const usersResponse = await axios.get('http://127.0.0.1:8000/api/users');
        setUserOptions(usersResponse.data);

        const humanResourcesResponse = await axios.get('http://127.0.0.1:8000/api/humanResources');
        setHumanOptions(humanResourcesResponse.data);

        const materialsResponse = await axios.get('http://127.0.0.1:8000/api/materialResources');
        setMaterialOptions(materialsResponse.data);
       
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
      name: '',
      code: '',
      description: '',
      value: '',
      human_id: '',
      material_id: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`http://127.0.0.1:8000/api/products/${products[editIndex].id}`, formData);
        const updatedProducts = [...products];
        updatedProducts[editIndex] = formData;
        setProducts(updatedProducts);
        setShowSuccessAlert('Product updated successfully!');
      } else {
        const response = await axios.post('http://127.0.0.1:8000/api/products', formData);
        setProducts([...products, response.data]);
        setShowSuccessAlert('Product added successfully!');
      }
      setFormData({
        name: '',
        code: '',
        description: '',
        value: '',
        human_id: '',
        material_id: ''
      });
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = async (index) => {
    const { id, name, code, description, value, human_id, material_id } = products[index];
    setFormData({ id, name, code, description, value, human_id, material_id });
    setEditIndex(index);
    setOpenModal(true);

    // Fetch human and material data for the selected product
    try {
      const humanResponse = await axios.get(`http://127.0.0.1:8000/api/humanResources/${human_id}`);
      const materialResponse = await axios.get(`http://127.0.0.1:8000/api/materialResources/${material_id}`);
      const { name: humanName } = humanResponse.data;
      const { name: materialName } = materialResponse.data;
      
      setFormData(prevState => ({
        ...prevState,
        human_id: humanName,
        material_id: materialName
      }));
    } catch (error) {
      console.error('Error fetching human and material data:', error);
    }
  };

  const handleDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${confirmDeleteId}`);
      setProducts(products.filter(product => product.id !== confirmDeleteId));
      setShowDeleteSuccessAlert(true);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  return (
    <div>
      <h1>Products</h1>
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>{showSuccessAlert}</Alert>
      )}
      {showDeleteSuccessAlert && (
        <Alert severity="success" onClose={() => setShowDeleteSuccessAlert(false)}>Product removed successfully!</Alert>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}><AddIcon /></Button>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px' }}>
          <h2>{formData.id ? 'Edit Product' : 'New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <TextField
                name="name"
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                name="code"
                label="Code"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.code}
                onChange={handleChange}
              />
            </FormControl>
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
              <TextField
                name="value"
                label="Value"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.value.amount}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Human Name</InputLabel>
              <Select
                name="human_id"
                value={formData.human_id}
                onChange={handleChange}
              >
                {humanOptions.map(human => (
                  <MenuItem key={human.id} value={formData.human_id}>{human.resource.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Material Name</InputLabel>
              <Select
                name="material_id"
                value={formData.material_id}
                onChange={handleChange}
              >
                {materialOptions.map(material => (
                  <MenuItem key={material.id} value={formData.material_id}>{material.resource.name}</MenuItem>
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
            <TableCell>Name</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Human ID</TableCell>
            <TableCell>Material ID</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.code}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{`${product.value.amount} ${product.value.currency}`}</TableCell>
              <TableCell>{product.human_id}</TableCell>
              <TableCell>{product.material_id}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(index)}><EditIcon /></Button>
                <Button onClick={() => handleDelete(product.id)}><DeleteIcon style={{ color: 'red' }} /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={confirmDeleteId !== null} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">No</Button>
          <Button onClick={handleConfirmDelete} color="secondary">Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ProductPage;