/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from '@/lib/axios/instance';

const userServices = {
  getAllUsers: () => instance.get('/api/user'),
  updateUser: (id: string, data: { role: string }) => instance.put('/api/user', { id, data }),
  deleteUser: (id: string) => instance.delete('/api/user', { data: { id } }),
};

export default userServices;
