/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from '@/lib/axios/instance';

const authServices = {
  registerAccount: (data: any) => instance.post('/api/users', data),
};

export default authServices;
