/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './Login.module.scss';
import { useRouter } from 'next/router';
import { Dispatch, FormEvent, SetStateAction, useState } from 'react';
import { signIn } from 'next-auth/react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthLayout from '@/components/layouts/AuthLayout';

type PropTypes = {
  setToaster: Dispatch<
    SetStateAction<{
      variant: string;
      message: string;
    }>
  >;
};

const LoginView = (props: PropTypes) => {
  const { setToaster } = props;
  const [isLoading, setIsLoading] = useState(false);

  const [emailFieldError, setEmailFieldError] = useState('');
  const [passwordFieldError, setPasswordFieldError] = useState('');

  const { push, query } = useRouter();

  const callbackUrl: any = query.callbackUrl || '/';

  const validateFields = (email: string, password: string) => {
    let isValid = true;
    if (!email) {
      setEmailFieldError('Email is required');
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
    setPasswordFieldError('');
    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;

    const isValid = validateFields(email, password);

    if (!isValid) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
        callbackUrl,
      });

      if (!res?.error) {
        setIsLoading(false);
        form.reset();
        push(callbackUrl);
      } else {
        setToaster({ variant: 'error', message: 'Email or password is incorrect' });
        setIsLoading(false);
      }
    } catch (error: any) {
      setToaster({ variant: 'error', message: error.message + '. Please try again later' });
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Login" link="/auth/register" linkText="Don't have an account? Sign up ">
      <form onSubmit={handleSubmit}>
        <Input label="Email" name="email" type="email" error={emailFieldError} />
        <Input label="Password" name="password" type="password" error={passwordFieldError} />
        <Button type="submit" className={styles.login__button}>
          {isLoading ? 'Loading...' : 'Login'}
        </Button>
      </form>
      <hr className={styles.login__divider} />
      <div className={styles.login__other}>
        <Button
          type="button"
          onClick={() => signIn('google', { callbackUrl, redirect: false })}
          className={styles.login__other__button}
        >
          <i className="bx bxl-google" /> Login With Google
        </Button>
      </div>
    </AuthLayout>
  );
};

export default LoginView;
