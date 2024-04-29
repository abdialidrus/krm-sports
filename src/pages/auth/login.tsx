import LoginView from '@/components/views/auth/Login';
import { Dispatch, SetStateAction } from 'react';

type PropTypes = {
  setToaster: Dispatch<
    SetStateAction<{
      variant: string;
      message: string;
    }>
  >;
};

const LoginPage = ({ setToaster }: PropTypes) => {
  return (
    <div>
      <LoginView setToaster={setToaster} />
    </div>
  );
};

export default LoginPage;
