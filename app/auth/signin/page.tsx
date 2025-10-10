'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import React from 'react';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;

    await login(name);

    router.push('/');
  };

  return (
    <div className="p-4 lg:p-8">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold">Login</h1>
        <Input type="text" placeholder="Your Name" name="name" required />
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default LoginPage;
