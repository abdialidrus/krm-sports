import UsersAdminView from '@/components/views/admin/Users';
import userServices from '@/services/user';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session: any = useSession();
  useEffect(() => {
    const getAllUsers = async () => {
      const { data } = await userServices.getAllUsers(session.data?.accessToken);
      setUsers(data.data);
    };

    getAllUsers();
  }, [session.data?.accessToken]);

  return (
    <>
      <UsersAdminView users={users} />
    </>
  );
};

export default AdminUsersPage;
