/* eslint-disable @typescript-eslint/no-explicit-any */
import { retrieveData } from '@/lib/firebase/service';
import { signUp } from '@/services/auth/services';
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt, { VerifyErrors } from 'jsonwebtoken';

type UserDto = {
  id: string;
  password?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1] || '';
    jwt.verify(token, process.env.NEXTAUTH_SECRET || '', async (err: VerifyErrors | null, decoded: any) => {
      if (decoded && decoded.role === 'admin') {
        const users: UserDto[] = await retrieveData('users');
        const data = users.map((user) => {
          delete user.password;
          return user;
        });
        res.status(200).json({ status: true, statusCode: 200, message: 'success', data });
      } else {
        res.status(403).json({ status: false, statusCode: 403, message: 'Access denied' });
      }
    });
  } else if (req.method === 'POST') {
    await signUp(req.body, (status: boolean) => {
      if (status) {
        res.status(200).json({ status: true, statusCode: 200, message: 'success' });
      } else {
        res.status(400).json({ status: false, statusCode: 400, message: 'failed' });
      }
    });
  } else {
    res.status(405).json({ status: false, statusCode: 405, message: 'method not allowed' });
  }
}
