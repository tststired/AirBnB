import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './Auth/Login';
import Register from './Auth/Register';
import Dashboard from './Dashboards/Dashboard';
import UserListings from './Dashboards/UserListing';
import ButtonAppBar from './Dashboards/Header';
import ViewListing from './Dashboards/ViewListing';
import UserListingsEdit from './Dashboards/UserListingManage';
import ManageBookings from './Dashboards/BookingRequests';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function App () {
  const initialToken = localStorage.getItem('token') || null;
  const [token, setToken] = React.useState(initialToken);
  const initialEmail = localStorage.getItem('email') || null;
  const [email, setEmail] = React.useState(initialEmail);

  return (
    <>
    <ThemeProvider theme={createTheme()}>
      <Router>
        <ButtonAppBar token={token} setToken={setToken} setEmail={setEmail} email={email}/>
        <Routes>
          <Route path="/register" element={<Register token={token} setToken={setToken} email={email} setEmail={setEmail}/>} />
          <Route path="/login" element={<SignIn token={token} setToken={setToken} email={email} setEmail={setEmail}/>} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/userListingsEdit/:id" element={<UserListingsEdit token={token} setToken={setToken} email={email} setEmail={setEmail}/>} />
          <Route path="/userListings" element={<UserListings token={token} setToken={setToken} email={email} setEmail={setEmail}/>} />
          <Route path="/viewListing/:id" element={<ViewListing token={token} setToken={setToken} email={email} setEmail={setEmail}/>} />
          <Route path="/manageBooking/:id" element={<ManageBookings token={token} setToken={setToken} email={email} setEmail={setEmail}/>} />
        </Routes>
      </Router>
    </ThemeProvider>
    </>
  );
}
