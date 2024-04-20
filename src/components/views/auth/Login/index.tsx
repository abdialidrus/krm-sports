/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './Login.module.scss';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthLayout from '@/components/layouts/AuthLayout';

const LoginView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { push, query } = useRouter();

  const callbackUrl: any = query.callbackUrl || '/';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    const form = event.target as HTMLFormElement;
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: form.email.value,
        password: form.password.value,
        callbackUrl,
      });

      if (!res?.error) {
        setIsLoading(false);
        form.reset();
        push(callbackUrl);
      } else {
        setError('Email or password is incorrect');
        setIsLoading(false);
      }
    } catch (error) {
      setError('Email or password is incorrect');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Login" link="/auth/register" linkText="Don't have an account? Sign up " error={error}>
      <form onSubmit={handleSubmit}>
        <Input label="Email" name="email" type="email" />
        <Input label="Password" name="password" type="password" />
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
