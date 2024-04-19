import Link from 'next/link';
import styles from './Register.module.scss';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import authServices from '@/services/auth';
import AuthLayout from '@/components/layouts/AuthLayout';

const RegisterView = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { push } = useRouter();
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        const form = event.target as HTMLFormElement;
        const data = {
            email: form.email.value,
            fullname: form.fullname.value,
            phone: form.phone.value,
            password: form.password.value
        };

        const result = await authServices.registerAccount(data);

        setIsLoading(false);

        if (result.status === 200) {
            form.reset();
            push('/auth/login');
        } else if (result.status === 400) {
            setError('Email already registered');
        } else {
            setError('Something went wrong');
            console.log('error');
        }
    }

    return (
        <AuthLayout
            title='Register'
            link='/auth/login'
            linkText="Have an account? Sign in "
        >
            <form onSubmit={handleSubmit}>
                <Input type="email" label="Email" name="email" />
                <Input type="text" label="Fullname" name="fullname" />
                <Input type="text" label="Phone" name="phone" />
                <Input type="password" label="Password" name="password" />

                <Button
                    type='submit'
                    className={styles.register__button}>
                    {isLoading ? 'Loading...' : 'Register'}
                </Button>
            </form>
        </AuthLayout>
    )
} 

export default RegisterView;