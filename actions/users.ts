import { User } from '@/lib/types/user';

export const getUserById = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`
  );

  return response.json() as Promise<User>;
};

export const createUser = async (name: string) => {
  const user = await getUserByName(name);
  if (user) {
    return user;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  });

  return response.json() as Promise<User>;
};

export const getUserByName = async (name: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users?name=${name}`
  );
  return response.json() as Promise<User>;
};

export const deleteUser = async (id: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }

  return response.json();
};

export const deleteAllUsers = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
    method: 'DELETE',
    body: JSON.stringify({ id: 'all' }),
  });

  return response.json();
};
