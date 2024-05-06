/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminLayout from '@/components/layouts/AdminLayout';
import Button from '@/components/ui/Button';
import styles from './Users.module.scss';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ModalUpdateUser from './ModalUpdateUser';
import ModalDeleteUser from './ModalDeleteUser';

type PropTypes = {
  users: {
    id: string;
    fullname: string;
    email: string;
    phone: string;
    role: string;
  }[];
  setToaster: Dispatch<
    SetStateAction<{
      variant: string;
      message: string;
    }>
  >;
};

const AdminUsersView = (props: PropTypes) => {
  const { users, setToaster } = props;
  const [updatedUser, setUpdateUser] = useState<any>({});
  const [deletedUser, setDeletedUser] = useState<any>({});
  const [usersData, setUsersData] = useState<any>([]);

  useEffect(() => {
    setUsersData(users);
  }, [users]);

  return (
    <>
      <AdminLayout>
        <div className={styles.users}>
          <h1>User Management</h1>
          <table className={styles.users__table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Fullname</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user: any, index: number) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td>
                    <div className={styles.users__table__action}>
                      <Button
                        type="button"
                        onClick={() => setUpdateUser(user)}
                        className={styles.users__table__action__edit}
                      >
                        <i className="bx bx-edit" />
                      </Button>
                      <Button
                        type="button"
                        className={styles.users__table__action__delete}
                        onClick={() => setDeletedUser(user)}
                      >
                        <i className="bx bx-trash" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminLayout>
      {Object.keys(updatedUser).length && (
        <ModalUpdateUser
          updatedUser={updatedUser}
          setUpdatedUser={setUpdateUser}
          setUsersData={setUsersData}
          setToaster={setToaster}
        />
      )}
      {Object.keys(deletedUser).length && (
        <ModalDeleteUser
          deletedUser={deletedUser}
          setDeletedUser={setDeletedUser}
          setUsersData={setUsersData}
          setToaster={setToaster}
        />
      )}
    </>
  );
};

export default AdminUsersView;
