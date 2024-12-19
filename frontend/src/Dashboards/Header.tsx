import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Props } from '../Types';
import { useNavigate } from 'react-router-dom';

export default function ButtonAppBar (props: Props) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    props.setToken(null);
    localStorage.removeItem('email');
    props.setEmail(null);
    navigate('/');
  }

  const handleLogin = () => {
    navigate('/login');
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">z
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            NotAirBnb
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
          {(props.token !== null) ? (<Button color="inherit" onClick={() => navigate('/userListings')}>Listings</Button>) : (<></>)}
          {(props.token !== null) ? (<Button color="inherit" onClick={handleLogout}>Logout</Button>) : (<Button color="inherit" onClick={handleLogin}>Login</Button>)}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
