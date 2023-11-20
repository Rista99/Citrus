'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    let jwt = localStorage.getItem('jwt');
    let username = localStorage.getItem('username');
    if (!!jwt || !!username) router.push('/');
  }, []);

  return <>{children}</>;
}
