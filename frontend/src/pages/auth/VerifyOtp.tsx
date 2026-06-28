import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Button, Link, Stack, TextField } from '@mui/material';
import { AuthShell } from '../../components/auth/AuthShell';
import { authApi } from '../../api/auth.api';
import { errorMessage } from '../../api/client';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const presetEmail = (location.state as { email?: string } | null)?.email ?? '';

  const [email, setEmail] = useState(presetEmail);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      await authApi.verifyOtp({ email, otp });
      navigate('/login');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError('');
    setInfo('');
    try {
      await authApi.resendOtp({ email });
      setInfo('A new code has been sent to your email.');
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <AuthShell
      title="Verify your email"
      subtitle="Enter the 6-digit code we emailed you"
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
          <TextField
            label="6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            fullWidth
            slotProps={{
              htmlInput: { inputMode: 'numeric', style: { letterSpacing: 8, fontWeight: 600 } },
            }}
          />
          <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth>
            {loading ? 'Verifying…' : 'Verify'}
          </Button>
          <Button onClick={resend} variant="text" size="small">
            Resend code
          </Button>
        </Stack>
      </form>
    </AuthShell>
  );
}
