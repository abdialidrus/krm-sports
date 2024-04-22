/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteData, retrieveDataById, updateData } from '@/lib/firebase/service';
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt, { VerifyErrors } from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1] || '';
    jwt.verify(token, process.env.NEXTAUTH_SECRET || '', async (err: VerifyErrors | null, decoded: any) => {
      if (decoded) {
        const { id }: any = req.query;
        const data = await retrieveDataById('users', id);
        res.status(200).json({ status: true, statusCode: 200, message: 'success', data });
      } else {
        res.status(403).json({ status: false, statusCode: 403, message: 'Access denied' });
      }
    });
  } else if (req.method === 'PUT') {
    const token = req.headers.authorization?.split(' ')[1] || '';

    jwt.verify(token, process.env.NEXTAUTH_SECRET || '', async (err: VerifyErrors | null, decoded: any) => {
      if (decoded) {
        const { id }: any = req.query;
        const { data } = req.body;
        await updateData('users', id, data, (result: boolean) => {
          if (result) {
            res.status(200).json({ status: true, statusCode: 200, message: 'success' });
          } else {
            res.status(400).json({ status: false, statusCode: 400, message: 'failed' });
          }
        });
      } else {
        res.status(403).json({ status: false, statusCode: 403, message: 'Access denied' });
      }
    });
  } else if (req.method === 'DELETE') {
    const token = req.headers.authorization?.split(' ')[1] || '';
    jwt.verify(token, process.env.NEXTAUTH_SECRET || '', async (err: VerifyErrors | null, decoded: any) => {
      if (decoded && decoded.role === 'admin') {
        const { id }: any = req.query;
        await deleteData('users', id, (result: boolean) => {
          if (result) {
            res.status(200).json({ status: true, statusCode: 200, message: 'success' });
          } else {
            res.status(400).json({ status: false, statusCode: 400, message: 'failed' });
          }
        });
      } else {
        res.status(403).json({ status: false, statusCode: 403, message: 'Access denied' });
      }
    });
  } else {
    res.status(405).json({ status: false, statusCode: 405, message: 'method not allowed' });
  }
}
