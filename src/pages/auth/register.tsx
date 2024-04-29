import RegisterView from '@/components/views/auth/Register';
import { Dispatch, SetStateAction } from 'react';

type PropTypes = {
  setToaster: Dispatch<
    SetStateAction<{
      variant: string;
      message: string;
    }>
  >;
};

const RegisterPage = ({ setToaster }: PropTypes) => {
  return (
    <>
      <RegisterView setToaster={setToaster} />
    </>
  );
};

export default RegisterPage;
