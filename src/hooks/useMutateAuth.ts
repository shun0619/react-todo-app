import axios, { type AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import useStore from '../store'
import type { Credential } from '../types'
import { useError } from '../hooks/useError'

export const useMutateAuth = () => {
  const navigate = useNavigate()
  const resetEditedTask = useStore((state) => state.resetEditedTask)
  const { switchErrorHandling } = useError()
const loginMutation = useMutation<AxiosResponse<any>, Error, Credential>({
  mutationFn: async (user: Credential) => {
    const { data } = await axios.post(`${import.meta.env.VITE_APP_API_URL}/login`, user);
    return data;
  },
  onSuccess: () => {
    navigate('/todo');
  },
  onError: (err: any) => {
    const message = err?.response?.data?.message || err?.message || 'Unknown error';
    switchErrorHandling(message);
  },
});


  const registerMutation = useMutation<AxiosResponse<any>, Error, Credential>({
  mutationFn: async (user: Credential) => {
    const { data } = await axios.post(`${import.meta.env.VITE_APP_API_URL}/signup`, user);
    return data;
  },
  onError: (err: any) => {
    const message = err?.response?.data?.message || err?.message || 'Unknown error';
    switchErrorHandling(message);
  },
});



  const logoutMutation = useMutation<AxiosResponse<any>, Error, void>({
  mutationFn: async () => {
    const { data } = await axios.post(`${import.meta.env.VITE_APP_API_URL}/logout`);
    return data;
  },
  onSuccess: () => {
    resetEditedTask();
    navigate('/');
  },
  onError: (err: any) => {
    const message = err?.response?.data?.message || err?.message || 'Unknown error';
    switchErrorHandling(message);
  },
});

  return { loginMutation, registerMutation, logoutMutation }
}