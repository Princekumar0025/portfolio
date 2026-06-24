import React, { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import FilterBar from '../components/FilterBar';
import { ChevronLeft, ChevronRight, CheckCircle, Loader } from 'lucide-react';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const {
    tasks, loading, error,
    page, setPage, totalPages,
    search, setSearch, status, setStatus,
    fetchTasks, createTask, updateTask, deleteTask, toggleTaskStatus
  } = useTasks();

  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateOrUpdate = async (taskData) => {
    if (taskData._id) {
      await updateTask(taskData._id, taskData);
      setEditingTask(null);
    } else {
      await createTask(taskData);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  return (
    <div className="container mt-8 pb-12">
      <div className="flex justify-between items-center mb-8 flex-col md:flex-row gap-4">
        <div>
          <h1 className="flex items-center gap-2" style={{ fontSize: '2.5rem' }}>My Tasks</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your daily goals and objectives.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div>
          <TaskForm 
            onSubmit={handleCreateOrUpdate} 
            initialData={editingTask} 
            onCancel={() => setEditingTask(null)} 
          />
        </div>
        
        <div>
          <FilterBar 
            search={search} setSearch={setSearch} 
            status={status} setStatus={setStatus} 
          />
          
          <div className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center p-12 text-secondary">
                <Loader className="animate-spin" size={32} />
              </div>
            ) : error ? (
              <div className="p-4 bg-danger text-center rounded-md text-white">{error}</div>
            ) : tasks.length === 0 ? (
              <div className="text-center p-8 card" style={{ border: '1px dashed var(--bg-tertiary)', backgroundColor: 'transparent' }}>
                <CheckCircle size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
                <p style={{ color: 'var(--text-secondary)' }}>No tasks found. Try a different search or create one!</p>
              </div>
            ) : (
              <>
                {tasks.map((task) => (
                  <TaskItem 
                    key={task._id} 
                    task={task} 
                    onDelete={handleDelete} 
                    onToggleStatus={toggleTaskStatus} 
                    onEdit={setEditingTask} 
                  />
                ))}
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <Button variant="icon" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                      <ChevronLeft size={20} />
                    </Button>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
                      Page {page} of {totalPages}
                    </span>
                    <Button variant="icon" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
