import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { userApi } from '../api/user.api';
import { errorMessage } from '../api/client';
import { formatDate } from '../utils/format';
import type { User } from '../types';

const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    userApi
      .list()
      .then(setUsers)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Users</Typography>
        <Typography color="text.secondary">
          All registered users in the system
        </Typography>
      </Box>

      {error && <Card sx={{ p: 2, bgcolor: '#fef2f2', color: '#b91c1c' }}>{error}</Card>}

      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card sx={{ overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Verified</TableCell>
                <TableCell>Joined</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14 }}>
                        {initials(u.name)}
                      </Avatar>
                      <Typography sx={{ fontWeight: 600 }}>{u.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={u.role === 'admin' ? 'Admin' : 'User'}
                      size="small"
                      color={u.role === 'admin' ? 'primary' : 'default'}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.is_verified ? 'Verified' : 'Pending'}
                      size="small"
                      color={u.is_verified ? 'success' : 'warning'}
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>{formatDate(u.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </Stack>
  );
}
