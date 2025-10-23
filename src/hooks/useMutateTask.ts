import axios, { AxiosError } from 'axios'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import type { Task } from '../types'
import useStore from '../store'
import { useError } from '../hooks/useError'

export const useMutateTask = () => {
  const queryClient = useQueryClient()
  const { switchErrorHandling } = useError()
  const resetEditedTask = useStore((state) => state.resetEditedTask)

  const createTaskMutation = useMutation<Task, AxiosError, Omit<Task, 'id' | 'created_at' | 'updated_at'>>({
  mutationFn: async (task) => {
    const { data } = await axios.post<Task>(`${import.meta.env.VITE_APP_API_URL}/tasks`, task);
    return data;
  },
  onSuccess: (createdTask) => {
    const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
    if (previousTasks) {
      queryClient.setQueryData(['tasks'], [...previousTasks, createdTask]);
    }
    resetEditedTask();
  },
  onError: (err) => {
    const message = (err?.response?.data as any)?.message || err?.message || 'Unknown error';
    switchErrorHandling(message);
  },
});


  const updateTaskMutation = useMutation<Task, AxiosError, Omit<Task, 'created_at' | 'updated_at'>>({
  mutationFn: async (task) => {
    const { data } = await axios.put<Task>(
      `${import.meta.env.VITE_APP_API_URL}/tasks/${task.id}`,
      { title: task.title }
    );
    return data;
  },
  onSuccess: (updatedTask, variables) => {
    const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
    if (previousTasks) {
      queryClient.setQueryData<Task[]>(
        ['tasks'],
        previousTasks.map((task) =>
          task.id === variables.id ? updatedTask : task
        )
      );
    }
    resetEditedTask();
  },
  onError: (err) => {
    const message = (err?.response?.data as any)?.message || err?.message || 'Unknown error';
    switchErrorHandling(message);
  },
});

 const deleteTaskMutation = useMutation<void, AxiosError, number>({
  mutationFn: async (id) => {
    await axios.delete(`${import.meta.env.VITE_APP_API_URL}/tasks/${id}`);
  },
  onSuccess: (_, id) => {
    const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
    if (previousTasks) {
      queryClient.setQueryData<Task[]>(
        ['tasks'],
        previousTasks.filter((task) => task.id !== id)
      );
    }
    resetEditedTask();
  },
  onError: (err) => {
    const message = (err?.response?.data as any)?.message || err?.message || 'Unknown error';
    switchErrorHandling(message);
  },
});

  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  }
}