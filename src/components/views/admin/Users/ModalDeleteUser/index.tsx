/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import userServices from '@/services/user';
import styles from './ModalDeleteUser.module.scss';
import { Dispatch, SetStateAction, useState } from 'react';
import { User } from '@/types/user.type';

type PropTypes = {
  deletedUser: User | null;
  setDeletedUser: Dispatch<SetStateAction<User | null>>;
  setUsersData: Dispatch<SetStateAction<User[]>>;
  setToaster: Dispatch<
    SetStateAction<{
      variant: string;
      message: string;
    }>
  >;
  session: any;
};

const ModalDeleteUser = (props: PropTypes) => {
  const { deletedUser, setDeletedUser, setUsersData, setToaster, session } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!deletedUser) {
      return;
    }
    setIsLoading(true);
    const result = await userServices.deleteUser(session.data?.accessToken, deletedUser.id);

    if (result.status === 200) {
      setDeletedUser(null);
      const { data } = await userServices.getAllUsers(session.data?.accessToken);
      setUsersData(data.data);
      setToaster({
        variant: 'success',
        message: 'User deleted successfully.',
      });
    } else {
      setIsLoading(false);
      setToaster({
        variant: 'error',
        message: 'There was a problem when deleting user. Please try again later.',
      });
    }
  };
  return (
    <Modal onClose={() => setDeletedUser(null)}>
      <h1 className={styles.modal__title}>Are you sure?</h1>
      <Button type="button" onClick={handleDelete}>
        {isLoading ? 'Deleting...' : 'Delete'}
      </Button>
    </Modal>
  );
};

export default ModalDeleteUser;
