/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import userServices from '@/services/user';
import styles from './ModalDeleteUser.module.scss';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const ModalDeleteUser = (props: any) => {
  const { deletedUser, setDeletedUser, setUsersData } = props;
  const session: any = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const result = await userServices.deleteUser(session.data?.accessToken, deletedUser.id);

    if (result.status === 200) {
      setDeletedUser({});
      const { data } = await userServices.getAllUsers(session.data?.accessToken);
      setUsersData(data.data);
    } else {
      setIsLoading(false);
    }
  };
  return (
    <Modal onClose={() => setDeletedUser({})}>
      <h1 className={styles.modal__title}>Are you sure?</h1>
      <Button type="button" onClick={handleDelete}>
        {isLoading ? 'Deleting...' : 'Delete'}
      </Button>
    </Modal>
  );
};

export default ModalDeleteUser;
