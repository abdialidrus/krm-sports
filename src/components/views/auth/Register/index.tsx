import styles from './Register.module.scss';
import { useRouter } from 'next/router';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import authServices from '@/services/auth';
import AuthLayout from '@/components/layouts/AuthLayout';

type PropTypes = {
  setToaster: Dispatch<
    SetStateAction<{
      variant: string;
      message: string;
    }>
  >;
};

const RegisterView = (props: PropTypes) => {
  const { setToaster } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [emailFieldError, setEmailFieldError] = useState('');
  const [fullnameFieldError, setFullnameFieldError] = useState('');
  const [passwordFieldError, setPasswordFieldError] = useState('');

  const { push } = useRouter();

  const validateFields = (email: string, fullname: string, password: string) => {
    let isValid = true;
    if (!email) {
      setEmailFieldError('Email is required');
      isValid = false;
    }

    if (!fullname) {
      setFullnameFieldError('Fullname is required');
      isValid = false;
    }

    if (!password) {
      setPasswordFieldError('Password is required');
      isValid = false;
    }

    return isValid;
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setEmailFieldError('');
    setFullnameFieldError('');
    setPasswordFieldError('');

    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    const fullname = form.fullname.value;
    const phone = form.phone.value;
    const password = form.password.value;

    const isValid = validateFields(email, fullname, password);

    if (!isValid) {
      return;
    }

    setIsLoading(true);

    const data = {
      email: email,
      fullname: fullname,
      phone: phone,
      password: password,
    };

    try {
      const result = await authServices.registerAccount(data);

      setIsLoading(false);

      if (result.status === 200) {
        form.reset();
        push('/auth/login');
      } else {
        setToaster({ variant: 'error', message: result.data.message });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setIsLoading(false);
      setToaster({ variant: 'error', message: error.message + '. Please try again later' });
    }
  };

  return (
    <AuthLayout title="Register" link="/auth/login" linkText="Have an account? Sign in ">
      <form onSubmit={handleSubmit}>
        <Input type="email" label="Email" name="email" error={emailFieldError} />
        <Input type="text" label="Fullname" name="fullname" error={fullnameFieldError} />
        <Input type="text" label="Phone" name="phone" />
        <Input type="password" label="Password" name="password" error={passwordFieldError} />

        <Button type="submit" className={styles.register__button}>
          {isLoading ? 'Loading...' : 'Register'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default RegisterView;
