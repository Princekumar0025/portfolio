import { useState, useCallback } from 'react';
import { taskService } from '../services/api';
import toast from 'react-hot-toast';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination & Filtering state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks({ page, search, status, limit: 5 });
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Failed to fetch tasks');
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  const createTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      toast.success('Task created successfully!');
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      await taskService.updateTask(id, taskData);
      toast.success('Task updated successfully!');
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted successfully!');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task');
      throw err;
    }
  };

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      // Optimistic update
      setTasks(tasks.map(t => t._id === task._id ? { ...t, status: newStatus } : t));
      
      await taskService.updateTask(task._id, { status: newStatus });
      toast.success(`Task marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
      fetchTasks(); // Revert on failure
    }
  };

  return {
    tasks,
    loading,
    error,
    page, setPage,
    totalPages,
    search, setSearch,
    status, setStatus,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus
  };
};
