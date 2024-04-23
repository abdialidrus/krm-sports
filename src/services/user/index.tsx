/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from '@/lib/axios/instance';

const userServices = {
  getAllUsers: (token: string) =>
    instance.get('/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  updateUserRole: (token: string, id: string, data: { role: string }) => {
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
  updateUserProfile: (
    token: string,
    id: string,
    data: {
      fullname: string;
      phone: string;
    }
  ) => {
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
  updateUserImage: (
    token: string,
    id: string,
    data: {
      image: string;
    }
  ) => {
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
  updateUserPassword: (
    token: string,
    id: string,
    data: {
      password: string;
      oldPassword: string;
    }
  ) => {
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
  getProfile: (token: string, id: string) =>
    instance.get(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
};

export default userServices;
