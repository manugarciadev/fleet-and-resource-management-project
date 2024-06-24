import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import {
  Button,
  Modal,
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Alert,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const PartnerPage = () => {
  const { id } = useParams();
  const [partner, setPartner] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    company_description: '',
    website: '',
    booking_prefix: '',
    company_name: '',
    vat_number: '',
    registration_address: '',
    registration_number: '',
    preferred_language: '',
    preferred_currency: '',
    time_zone: '',
    provider_rates_exchange: '',
    userId: ''
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteSuccessAlert, setShowDeleteSuccessAlert] = useState(false);
  const [mainTab, setMainTab] = useState(0);
  const [subTab, setSubTab] = useState(0);
  const [imageURL, setImageURL] = useState('');

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/partners/${id}`);
        setPartner(response.data.partner); // Ajuste para acessar response.data.partner
      } catch (error) {
        console.error('Error fetching partner:', error);
      }
    };
    fetchPartner();
  }, [id]);


  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      company_description: '',
      website: '',
      booking_prefix: '',
      company_name: '',
      vat_number: '',
      registration_address: '',
      registration_number: '',
      preferred_language: '',
      preferred_currency: '',
      time_zone: '',
      provider_rates_exchange: '',
      userId: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/partners/${id}`, formData);
      setPartner(formData);
      setShowSuccessAlert('Partner updated successfully!');
      handleCloseModal();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleMainTabChange = (event, newValue) => {
    setMainTab(newValue);
    setSubTab(0); // Reset subTab to 0 whenever a new main tab is selected
  };

  const handleSubTabChange = (event, newValue) => {
    setSubTab(newValue);
  };

  const renderSubTabs = () => {
    switch (mainTab) {
      case 0:
        return (
          <Tabs value={subTab} onChange={handleSubTabChange} indicatorColor="primary">
            <Tab label="Partner Details" />
            <Tab label="Legal requirements" />
          </Tabs>
        );
      case 1:
        return (
          <Tabs value={subTab} onChange={handleSubTabChange} indicatorColor="primary">
            <Tab label="Account" />
          </Tabs>
        );
      case 2:
        return (
          <Tabs value={subTab} onChange={handleSubTabChange} indicatorColor="primary">
            <Tab label="Service Detail" />
          </Tabs>
        );
      case 3:
        return (
          <Tabs value={subTab} onChange={handleSubTabChange} indicatorColor="primary">
            <Tab label="Bookings for Payout" />
            <Tab label="Invoices" />
            <Tab label="Payment Confirmations" />
            <Tab label="Payment & tax details" />
          </Tabs>
        );
      case 4:
        return (
          <Tabs value={subTab} onChange={handleSubTabChange} indicatorColor="primary">
            <Tab label="Booking Detail" />
          </Tabs>
        );
      case 5:
        return (
          <Tabs value={subTab} onChange={handleSubTabChange} indicatorColor="primary">
            <Tab label="Documents" />
            <Tab label="Contracts" />
            <Tab label="Renovation" />
          </Tabs>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {showSuccessAlert && (
        <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>{showSuccessAlert}</Alert>
      )}
      {showDeleteSuccessAlert && (
        <Alert severity="success" onClose={() => setShowDeleteSuccessAlert(false)}>Partner removed successfully!</Alert>
      )}
      <div style={{ justifyContent: 'flex-end', marginBottom: '15px', marginTop: '30px' }}>
        {/* Add any additional buttons here */}
      </div>
      <Modal open={openModal} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto', padding: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', maxWidth: '600px', maxHeight: '500px', overflowY: 'auto', scrollbarColor: 'gray transparent' }}>
          <h2>{formData.id ? 'Edit Partner' : 'New Partner'}</h2>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="company_description"
                  label="Legal company name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.company_description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  <TextField
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" style={{ width: '100%', height: '100%' }}>
                          <label htmlFor="icon-button-file" style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                              accept="image/*"
                              id="icon-button-file"
                              type="file"
                              style={{ display: 'none' }}
                              onChange={handleImageUpload}
                            />
                            <IconButton color="primary" aria-label="upload picture" component="span" style={{ width: '100%', height: '100%' }}>
                              <CloudUploadIcon />
                            </IconButton>
                          </label>
                          {imageURL && (
                            <img
                              src={imageURL}
                              alt="Company Logo"
                              style={{ width: '60%', height: '50%', objectFit: 'cover', borderRadius: '4px' }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Typography>
              </Grid>
              {/* Additional form fields */}
              <Grid item xs={12}>
                <TextField
                  name="company_description"
                  label="Public company name"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.company_description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="company_description"
                  label="Company description (optional)"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.company_description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="company_description"
                  label="Website and social media"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.company_description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="company_description"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.company_description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="company_description"
                  label="Street address"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.company_description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="company_description"
                  label="City"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.company_description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="company_description"
                  label="Country"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={formData.company_description}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </form>
        </div>
      </Modal>
      <Box sx={{ width: '100%', typography: 'body1', marginBottom: '20px' }}>
        <Tabs value={mainTab} onChange={handleMainTabChange} indicatorColor="primary">
          <Tab label="Partner Profile" />
          <Tab label="User" />
          <Tab label="Services" />
          <Tab label="Finance" />
          <Tab label="Booking" />
          <Tab label="Comercial" />
        </Tabs>
        <div style={{ borderBottom: '1px solid #ccc', marginBottom: '20px' }}></div> {/* Linha abaixo das tabs */}
        {renderSubTabs()}
        <div style={{ borderBottom: '1px solid #ccc', marginBottom: '20px' }}></div> {/* Linha abaixo das tabs */}
      </Box>
      
      <Box>
        {mainTab === 0 && subTab === 0 && partner && (
           <div>
           <Grid container spacing={2}>
             <Grid item xs={12}>
               <Card>
                 <CardContent>
                   <Grid container justifyContent="space-between" alignItems="center">
                     <Grid item>
                       <Typography variant="h5" style={{ fontWeight: 'bold' }}>Company Information</Typography>
                     </Grid>
                     <Grid item>
                       <CardActions>
                         <Button variant="outlined" color="primary" onClick={handleOpenModal} sx={{ borderRadius: '20px', border: '1px solid #3f51b5', margin: '0 5px' }}><EditIcon /></Button>
                         <Button variant="outlined" color="secondary" onClick={handleOpenModal} sx={{ borderRadius: '20px', border: '1px solid #f50057', margin: '0 5px' }}><DeleteIcon /></Button>
                       </CardActions>
                     </Grid>
                   </Grid>
                   <Grid container spacing={2}>
                     <Grid item xs={3}>
                       <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Legal status</Typography>
                     </Grid>
                     <Grid item xs={9}>
                       <Typography variant="body2">Registered company</Typography>
                     </Grid>
                     <Grid item xs={3}>
                       <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Company logo</Typography>
                     </Grid>
                     <Grid item xs={9}>
                      <Grid container justifyContent="left">
                         <Grid item xs={6}>
                           <Typography variant="body2">
                             <TextField
                               variant="outlined"
                               fullWidth
                               margin="normal"
                               InputProps={{
                                 startAdornment: (
                                   <InputAdornment position="start" style={{ width: '100%', height: '100%' }}>
                                     <label htmlFor="icon-button-file" style={{ display: 'flex', alignItems: 'center' }}>
                                       <input
                                         accept="image/*"
                                         id="icon-button-file"
                                         type="file"
                                         style={{ display: 'none' }}
                                         onChange={handleImageUpload}
                                       />
                                       <IconButton color="primary" aria-label="upload picture" component="span" style={{ width: '100%', height: '100%'}}>
                                         <CloudUploadIcon />
                                       </IconButton>
                                     </label>
                                     {imageURL && (
                                       <img
                                         src={imageURL}
                                         alt="Company Logo"
                                         style={{ width: '60%', height: '50%', objectFit: 'cover', borderRadius: '4px' }}
                                       />
                                     )}
                                   </InputAdornment>
                                 ),
                               }}
                             />
                           </Typography>
                         </Grid>
                       </Grid>
                     </Grid>
                     <Grid item xs={3}>
                       <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Legal company name</Typography>
                     </Grid>
                     <Grid item xs={9}>
                       <Typography variant="body2">{partner.legal_name}</Typography>
                     </Grid>
                     <Grid item xs={3}>
                       <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Public company name</Typography>
                     </Grid>
                     <Grid item xs={9}>
                       <Typography variant="body2">{partner.public_name}</Typography>
                     </Grid>
                     <Grid item xs={3}>
                       <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Company description</Typography>
                     </Grid>
                     <Grid item xs={9}>
                       <Typography variant="body2">{partner.description}</Typography>
                     </Grid>
                     <Grid item xs={3}>
                       <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Website and social media</Typography>
                     </Grid>
                     <Grid item xs={9}>
                       <Typography variant="body2">https://www.tripadvisor.com/Attraction_Review-g1185333-d16880864-Reviews-Bu_Bista_Tours-Sal_Rei_Boa_Vista.html</Typography>
                     </Grid>
                   </Grid>
                 </CardContent>
               </Card>
             </Grid>
           </Grid>
 
           {/* Adicione espaço entre os conjuntos de grids */}
           <Box mt={2} />
           <Grid container spacing={2}>
             <Grid item xs={12}>
               <Card>
                 <CardContent>
                   <Grid container justifyContent="space-between" alignItems="center">
                     <Grid item>
                       <Typography variant="h5" style={{ fontWeight: 'bold' }}>Contact Information</Typography>
                     </Grid>
                     <Grid item>
                       <CardActions>
                         <Button variant="outlined" color="primary" onClick={handleOpenModal} sx={{ borderRadius: '20px', border: '1px solid #3f51b5', margin: '0 5px' }}><EditIcon /></Button>
                         <Button variant="outlined" color="secondary" onClick={handleOpenModal} sx={{ borderRadius: '20px', border: '1px solid #f50057', margin: '0 5px' }}><DeleteIcon /></Button>
                       </CardActions>
                     </Grid>
                   </Grid>
                   <Grid container spacing={2}>
                     <Grid item xs={3}>
                       <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Contact phone number</Typography>
                     </Grid>
                     <Grid item xs={9}>
                       <Typography variant="body2">+2385212748</Typography>
                     </Grid>
                     <Grid item xs={3}>
                       <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Contact email</Typography>
                     </Grid>
                     <Grid item xs={9}>
                       <Typography variant="body2">bubistatours@gmail.com</Typography>
                     </Grid>
                     <Grid item xs={3}>
                       <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Address</Typography>
                     </Grid>
                     <Grid item xs={9}>
                       <Typography variant="body2">Bairro da Boa Esperança, Sal Rei, Boa Vista Island, 5110, Cape Verde</Typography>
                     </Grid>
                     <Grid item xs={3}>
                       <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Managing directors</Typography>
                     </Grid>
                     <Grid item xs={9}>
                       <Typography variant="body2">Erica Seviane</Typography>
                     </Grid>
                   </Grid>
                 </CardContent>
               </Card>
             </Grid>
           </Grid>
 
            {/* Adicione espaço entre os conjuntos de grids */}
            <Box mt={2} />
           <Grid container spacing={2}>
             <Grid item xs={12}>
               <Card>
                 <CardContent>
                   <Grid container justifyContent="space-between" alignItems="center">
                     <Grid item>
                       <Typography variant="h5" style={{ fontWeight: 'bold' }}>Additional information</Typography>
                     </Grid>
                     <Grid item>
                       <CardActions>
                         <Button variant="outlined" color="primary" onClick={handleOpenModal} sx={{ borderRadius: '20px', border: '1px solid #3f51b5', margin: '0 5px' }}><EditIcon /></Button>
                         <Button variant="outlined" color="secondary" onClick={handleOpenModal} sx={{ borderRadius: '20px', border: '1px solid #f50057', margin: '0 5px' }}><DeleteIcon /></Button>
                       </CardActions>
                     </Grid>
                   </Grid>
                   <Grid container spacing={2}>
                     <Grid item xs={3}>
                       <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Company registration number</Typography>
                     </Grid>
                     <Grid item xs={9}>
                       <Typography variant="body2">9053D2018</Typography>
                     </Grid>
                   </Grid>
                 </CardContent>
               </Card>
             </Grid>
           </Grid>
           
         </div>
        )}
        {mainTab === 0 && subTab === 1 && (
          <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                      <Typography variant="h5" style={{ fontWeight: 'bold' }}>Insurance</Typography>
                    </Grid>
                  </Grid>
                  <Box mt={2} />
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">
                        One or more of your activities requires liability insurance. Every supply partner on GetYourGuide needs to maintain comprehensive 
                        general liability insurance covering risks related to the business and the services. Please enter your information here.
                      </Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Button variant="outlined" color="primary" onClick={handleOpenModal} sx={{ borderRadius: '20px', border: '1px solid #3f51b5', margin: '0 5px' }}>Add a new insurance provider </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box mt={2} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="h5" style={{ fontWeight: 'bold' }}>Terms and conditions</Typography>
                  </Grid>
                </Grid>
                <Box mt={2} />
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>General terms and conditions</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Typography variant="body2">
                      The GetYourGuide general terms and conditions (for reference only). This is the default contract between you and the customer, 
                      and exists in every language published on the GetYourGuide website (except non-Latin alphabet languages).
                    </Typography>
                  </Grid>
                </Grid>
                <Box mt={2} />
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Activity provider terms and conditions (optional)</Typography>
                  </Grid>
                  <Grid item xs={9}>
                  <Button variant="outlined" color="primary" onClick={handleOpenModal} sx={{ borderRadius: '20px', border: '1px solid #3f51b5', margin: '0 5px' }}>Add a language</Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box mt={2} />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="h5" style={{ fontWeight: 'bold' }}>Privacy policy</Typography>
                  </Grid>
                  <Grid item>
                    <CardActions>
                      
                    </CardActions>
                  </Grid>
                </Grid>
                <Box mt={2} />
                <Grid container spacing={2}>
                
                  <Grid item xs={12}>
                    <Typography variant="body2">
                    Your company’s protocols and guidelines around handling data that customers share with you or through GetYourGuide, 
                    e.g. phone numbers. This will be visible to customers on your GetYourGuide activity provider profile page.
                    </Typography>
                  </Grid>
                </Grid>
                <Box mt={2} />
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Privacy policy</Typography>
                  </Grid>
                  <Grid item xs={9}>
                  <Button variant="outlined" color="primary" onClick={handleOpenModal} sx={{ borderRadius: '20px', border: '1px solid #3f51b5', margin: '0 5px' }}>Add a language</Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        </div>
      )}
        
        {mainTab === 1 && subTab === 0 && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Detail
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {/* Display relevant user details */}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleOpenModal}
              >
                Edit
              </Button>
            </CardActions>
          </Card>
        )}
        {mainTab === 2 && subTab === 0 && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Service Detail
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {/* Display relevant service details */}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleOpenModal}
              >
                Edit
              </Button>
            </CardActions>
          </Card>
        )}
        {mainTab === 3 && subTab === 0 && (
            
            <TableContainer component={Paper}>
            <Table aria-label="partners table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Booking Reference</strong></TableCell>
                  <TableCell><strong>Lead traveler</strong></TableCell>
                  <TableCell><strong>Product code</strong></TableCell>
                  <TableCell><strong>Option code</strong></TableCell>
                  <TableCell><strong>Activity date</strong></TableCell>
                  <TableCell><strong>Date of purchase</strong></TableCell>
                  <TableCell><strong>Retail rate</strong></TableCell>
                  <TableCell><strong>Net rate</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                  <TableRow  >
                  <TableCell>GYGFWXAB7KXR</TableCell>
                  <TableCell>Schröder, Ronny</TableCell>
                  <TableCell>BVT0G</TableCell>
                  <TableCell>BVT0G</TableCell>
                  <TableCell>08/06/2024</TableCell>
                  <TableCell>07/06/2024</TableCell>
                  <TableCell>€158.00</TableCell>
                  <TableCell>€110.60</TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
           
        )}
        {mainTab === 3 && subTab === 1 && (
          <TableContainer component={Paper}>
          <Table aria-label="partners table">
            <TableHead>
              <TableRow>
              <TableCell><strong>Invoice</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Period</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                <TableRow  >
                <TableCell>GIS-302396-01182354</TableCell>
                <TableCell>Friday, May 31, 2024</TableCell>
                <TableCell>16-05-2024 - 31-05-2024</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>€560.00</TableCell>
                
                </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        )}
        {mainTab === 3 && subTab === 2 && (
          <TableContainer component={Paper}>
          <Table aria-label="partners table">
            <TableHead>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Payment Confirmation</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                <TableRow  >
                <TableCell>Sunday, June 2, 2024</TableCell>
                <TableCell>Regular</TableCell>
                <TableCell>GPS-302396-01065870</TableCell>
                <TableCell>€560.00</TableCell>
                
                </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        )}
        {mainTab === 3 && subTab === 3 && (
          <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                      <Typography variant="h5" style={{ fontWeight: 'bold' }}>Tax details</Typography>
                    </Grid>
                    <Grid item>
                      <CardActions>
                        <Button variant="outlined" color="primary" onClick={handleOpenModal} sx={{ borderRadius: '20px', border: '1px solid #3f51b5', margin: '0 5px' }}><EditIcon /></Button>
                      </CardActions>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>VAT number</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">276695208</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Country of issue</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">Cape Verde</Typography>
                    </Grid>
                    
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Tax Identification Number (TIN)</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">276695208</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>TIN country of issue</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">Cape Verde</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Adicione espaço entre os conjuntos de grids */}
          <Box mt={2} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                      <Typography variant="h5" style={{ fontWeight: 'bold' }}>Payment method</Typography>
                    </Grid>
                    <Grid item>
                      <CardActions>
                        <Button variant="outlined" color="primary" onClick={handleOpenModal} sx={{ borderRadius: '20px', border: '1px solid #3f51b5', margin: '0 5px' }}><EditIcon /></Button>
                      </CardActions>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Payment data status</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">Confirmed</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Payment method</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">International bank transfer</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>IBAN</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">CV64000200003960513010126</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>NIB</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">CV64000200003960513010126</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>SWIFT/BIC</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">CXECCVCVXXX</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Account Type</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">Checking Account</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Beneficiary name</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">Bu Country Turismo SU LDA</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Bank City</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">Praia</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Bank Name</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">Caixa Economica de Cabo Verde (CECV)</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Bank Address</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">Avenida de Palmarejo</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Bank Zip</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">7600</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

           {/* Adicione espaço entre os conjuntos de grids */}
           <Box mt={2} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                      <Typography variant="h5" style={{ fontWeight: 'bold' }}>Payment settings</Typography>
                    </Grid>
                    <Grid item>
                      <CardActions>
                        <Button variant="outlined" color="primary" onClick={handleOpenModal} sx={{ borderRadius: '20px', border: '1px solid #3f51b5', margin: '0 5px' }}><EditIcon /></Button>
                      </CardActions>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Payment frequency</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">Once per month</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Commission rate</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">30%</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>Currency</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography variant="body2">Euro (€)</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
        </div>
        )}
        {mainTab === 4 && subTab === 0 && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Booking Detail
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {/* Display relevant booking details */}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleOpenModal}
              >
                Edit
              </Button>
            </CardActions>
          </Card>
        )}
        {mainTab === 5 && subTab === 0 && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Documents
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {/* Display relevant document details */}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleOpenModal}
              >
                Edit
              </Button>
            </CardActions>
          </Card>
        )}
        {mainTab === 5 && subTab === 1 && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contracts
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {/* Display relevant contract details */}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleOpenModal}
              >
                Edit
              </Button>
            </CardActions>
          </Card>
        )}
        {mainTab === 5 && subTab === 2 && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Renovation
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {/* Display relevant renovation details */}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleOpenModal}
              >
                Edit
              </Button>
            </CardActions>
          </Card>
        )}
      </Box>
    </div>
  );
};

export default PartnerPage;