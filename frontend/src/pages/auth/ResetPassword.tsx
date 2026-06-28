import { useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Button, Link, Stack, TextField } from '@mui/material';
import { AuthShell } from '../../components/auth/AuthShell';
import { authApi } from '../../api/auth.api';
import { errorMessage } from '../../api/client';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [token, setToken] = useState(params.get('token') ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.resetPassword({ token, password });
      navigate('/login');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset password"
      subtitle="Choose a new password for your account"
      footer={
        <Link component={RouterLink} to="/login" underline="hover">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={submit}>
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}
          {!params.get('token') && (
            <TextField
              label="Reset token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              fullWidth
            />
          )}
          <TextField
            label="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            helperText="At least 6 characters"
          />
          <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth>
            {loading ? 'Resetting…' : 'Reset password'}
          </Button>
        </Stack>
      </form>
    </AuthShell>
  );
}
