import React from 'react';
import { Trash2, Edit2, CheckCircle, Circle } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';

const TaskItem = ({ task, onDelete, onToggleStatus, onEdit }) => {
  return (
    <Card className="mb-4 flex justify-between items-start" style={{ borderLeft: task.status === 'completed' ? '4px solid var(--success)' : '4px solid var(--warning)' }}>
      <div style={{ flex: 1, marginRight: '1rem' }}>
        <h3 className="flex items-center gap-2 mb-2" style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none', color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
          {task.status === 'completed' ? <CheckCircle size={18} color="var(--success)" /> : <Circle size={18} color="var(--warning)" />}
          {task.title}
        </h3>
        {task.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{task.description}</p>}
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="icon" onClick={() => onToggleStatus(task)} title={task.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}>
          {task.status === 'completed' ? <Circle size={18} /> : <CheckCircle size={18} />}
        </Button>
        <Button variant="icon" onClick={() => onEdit(task)} title="Edit Task">
          <Edit2 size={18} />
        </Button>
        <Button variant="icon" onClick={() => onDelete(task._id)} style={{ color: 'var(--danger)' }} title="Delete Task">
          <Trash2 size={18} />
        </Button>
      </div>
    </Card>
  );
};

export default TaskItem;
