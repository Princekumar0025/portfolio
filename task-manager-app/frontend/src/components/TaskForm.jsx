import React, { useState } from 'react';
import { Plus, Save, X, Edit2 } from 'lucide-react';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';

const TaskForm = ({ onSubmit, initialData, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      await onSubmit({ title, description, _id: initialData?._id });
      if (!initialData) {
        setTitle('');
        setDescription('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-8" style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', border: '1px dashed var(--bg-tertiary)' }}>
      <h3 className="mb-4 flex items-center gap-2" style={{ fontSize: '1.25rem' }}>
        {initialData ? <Edit2 size={20} /> : <Plus size={20} />}
        {initialData ? 'Edit Task' : 'Add New Task'}
      </h3>
      <form onSubmit={handleSubmit}>
        <Input 
          placeholder="Task Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <div className="form-group mb-4">
          <textarea
            className="form-input"
            placeholder="Task Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            style={{ resize: 'vertical' }}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" variant="primary" icon={initialData ? Save : Plus} disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Add Task'}
          </Button>
          {initialData && (
            <Button type="button" variant="secondary" icon={X} onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default TaskForm;
