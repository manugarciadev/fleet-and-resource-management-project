import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Divider } from '@mui/material';
import ContractPage from './pages/Contract';
import UserPage from './pages/User';
import ContractTypePage from './pages/ContractType';
import EmployeePage from './pages/Employee';
import PartnerPage from './pages/Partner';
import ResourcePage from './pages/Resource';
import ResourceTypePage from './pages/ResourceType';
import SubscriptionPage from './pages/Subscription';
import RenovationPage from './pages/Renovation';
import HumanResourcePage from './pages/HumanResource';
import MaterialResourcePage from './pages/MaterialResource';
import ProductPage from './pages/Product';
import BookingForPayoutPage from './pages/BookingForPayout';
import InvoicePage from './pages/Invoice';
import PaymentAndTaxDetailPage from './pages/PaymentAndTaxDetail';
import DocumentPage from './pages/Document';
import LogActivityPage from './pages/LogActivity';
import FinancePage from './pages/Finance';
import PartnersListPage from './pages/PartnersListPage'; // Página que lista todos os parceiros

function App() {
  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
    marginLeft: '20px',
    fontWeight: 'bold'
  };

  const hoverStyle = {
    color: 'blue',
    fontWeight: 'bold'
  };

  return (
    <Router>
      <div className="App">
        <AppBar position="static" color="inherit">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My App
            </Typography>
          </Toolbar>
          <Divider sx={{ margin: '0 20px' }}/>
          <Toolbar>
            <Link 
              to="/users" 
              style={linkStyle} 
              onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, linkStyle)}
            >
              Users
            </Link>
            <Link 
              to="/employees" 
              style={linkStyle} 
              onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, linkStyle)}
            >
              Employees
            </Link>
            <Link 
              to="/contracts" 
              style={linkStyle} 
              onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, linkStyle)}
            >
              Contracts
            </Link>
            <Link 
              to="/resources" 
              style={linkStyle} 
              onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, linkStyle)}
            >
              Resources
            </Link>
            <Link 
              to="/products" 
              style={linkStyle} 
              onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, linkStyle)}
            >
              Products
            </Link>
            <Link 
              to="/renovation" 
              style={linkStyle} 
              onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, linkStyle)}
            >
              Renovation
            </Link>
            <Link 
              to="/documents" 
              style={linkStyle} 
              onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, linkStyle)}
            >
              Documents
            </Link>
            <Link 
              to="/partners" 
              style={linkStyle} 
              onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, linkStyle)}
            >
              Partners
            </Link>
            <Link 
              to="/finance" 
              style={linkStyle} 
              onMouseEnter={(e) => Object.assign(e.target.style, hoverStyle)}
              onMouseLeave={(e) => Object.assign(e.target.style, linkStyle)}
            >
              Finance
            </Link>
          </Toolbar>
        </AppBar>

        <div className="content" style={{ margin: '20px' }}> {/* Adicionando margem de 20px */}
          <Routes>
            <Route path="/contractTypes" element={<ContractTypePage />} />
            <Route path="/resourceTypes" element={<ResourceTypePage />} />
            <Route path="/users/" element={<UserPage />} />
            <Route path="/employees" element={<EmployeePage />} />
            <Route path="/partners" element={<PartnersListPage />} />
            <Route path="/partners/:id" element={<PartnerPage />} />
            <Route path="/contracts" element={<ContractPage />} />
            <Route path="/resources" element={<ResourcePage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/renovation" element={<RenovationPage />} />
            <Route path="/documents" element={<DocumentPage />} />
            <Route path="/logActivity" element={<LogActivityPage />} />
            <Route path="/finance" element={<FinancePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;