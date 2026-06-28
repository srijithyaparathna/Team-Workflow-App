import { useState } from 'react';
// react-router-dom for navigation and linking
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// MUI components for UI elements
import { Alert, Button, IconButton, InputAdornment, Link, Stack, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthShell } from '../../components/auth/AuthShell';
// custom hook for authentication
import { useAuth } from '../../hooks/useAuth';
import { errorMessage } from '../../api/client';

export default function Login() {
  // get login function from auth context 
  const { login } = useAuth();
  const navigate = useNavigate(); // Use navigate for after login 
  const [email, setEmail] = useState(''); // email state for input field
  const [password, setPassword] = useState(''); // password state for input field 
  const [showPassword, setShowPassword] = useState(false); // toggle password visibility
  const [error, setError] = useState(''); // error state for displaying error messages
  const [loading, setLoading] = useState(false); // loading state for disabling the button during login

  // runs when the form is submitted
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password); // call backend login function with email and password
      navigate('/dashboard'); // navigate to dashboard after successful login
    } catch (err) { // catch any errors during login
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back" // title for the auth shell
      subtitle="Sign in to continue to your dashboard" // subtitle for the auth shell
      footer={
        <Link component={RouterLink} to="/register" underline="hover">
          Don't have an account? Sign up
        </Link>
      }
    >
      <form onSubmit={submit}>
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Link
            component={RouterLink}
            to="/forgot-password"
            underline="hover"
            sx={{ alignSelf: 'flex-end', fontSize: 14 }}
          >
            Forgot password?
          </Link>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </Stack>
      </form>
    </AuthShell>
  );
}