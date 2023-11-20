'use client';

import Form from '@/components/form/Form';
import Input from '@/components/form/fields/Input';
import { FORM_FIELDS } from '@/constants';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

type Props = {};

const Register = (props: Props) => {
  const { push } = useRouter();
  const methods = useForm({
    defaultValues: useMemo(() => {
      return {
        [FORM_FIELDS.username.name]: '',
        [FORM_FIELDS.password.name]: '',
      };
    }, []),
  });

  const onSubmit = async (input: any) => {
    console.log(input);
    try {
      const result = await axios.post(
        'http://localhost:4000/users/registration',
        input
      );

      push('/auth/login');
    } catch (e: any) {
      console.log(e.message);
    }
  };
  return (
    <div className='relative flex flex-col justify-center h-screen overflow-hidden'>
      <div className='w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl'>
        <h1 className='text-3xl font-semibold text-center text-purple-700'>
          Register
        </h1>
        <Form {...methods} className='space-y-4'>
          <Input
            name={FORM_FIELDS.username.name}
            id={FORM_FIELDS.username.name}
            label={'First Name'}
            rules={{ validate: FORM_FIELDS.username.validate }}
            required
          />

          <Input
            name={FORM_FIELDS.password.name}
            id={FORM_FIELDS.password.name}
            label={'Password'}
            rules={{ validate: FORM_FIELDS.password.validate }}
            required
          />

          <span className='text-xs text-gray-600'>
            Already have an account?{' '}
            <a
              href='/auth/login'
              className='text-xs text-gray-600 hover:underline hover:text-blue-600'
            >
              Sign in
            </a>
          </span>
          <div className='flex justify-center'>
            <button
              className='btn  btn-primary'
              onClick={methods.handleSubmit(onSubmit)}
            >
              Sign Up
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
