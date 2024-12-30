import React, { useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login,isAuthenticated} = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:6789/api/v1/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
       const data = await response.json();
       const {token} = data.payload.User
       console.log(token)
        login(token);
        navigate('/');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      setError('Error logging in. Please try again.');
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Redirect to the dashboard
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container maxWidth="xs" style={{ marginTop: '5rem' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Login
      </Typography>
      {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Coordinator ID"
          name="username"
          value={credentials.username}
          onChange={handleInputChange}
        />
        <TextField
          fullWidth
          margin="normal"
          type="password"
          label="Password"
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '1rem' }}>
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;