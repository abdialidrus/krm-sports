/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from '@/lib/axios/instance';

const userServices = {
  getAllUsers: (token: string) =>
    instance.get('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  updateUser: (token: string, id: string, data: { role: string }) => {
    return instance.put(
      `/api/users/${id}`,
      { data },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
  deleteUser: (token: string, id: string) =>
    instance.delete(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default userServices;
