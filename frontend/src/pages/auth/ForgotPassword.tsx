import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Button, Link, Stack, TextField } from '@mui/material';
import { AuthShell } from '../../components/auth/AuthShell';
import { authApi } from '../../api/auth.api';
import { errorMessage } from '../../api/client';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const res = await authApi.forgotPassword({ email });
      setInfo(res.message ?? 'If that email exists, a reset link has been sent.');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Forgot password"
      subtitle="We'll email you a link to reset it"
      footer={
        <Link component={RouterLink} to="/login" underline="hover">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={submit}>
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}
          {info && <Alert severity="success">{info}</Alert>}
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth>
            {loading ? 'Sending…' : 'Send reset link'}
          </Button>
        </Stack>
      </form>
    </AuthShell>
  );
}
