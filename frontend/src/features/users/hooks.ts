// src/features/users/hooks.ts
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getUsers, createUser, updateUser, deleteUser } from './api';

export const useUsers = () => {
  return useQuery('users', getUsers);
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(createUser, {
    onSuccess: () => queryClient.invalidateQueries('users'),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id, user }) => updateUser(id, user), {
    onSuccess: () => queryClient.invalidateQueries('users'),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteUser, {
    onSuccess: () => queryClient.invalidateQueries('users'),
  });
};