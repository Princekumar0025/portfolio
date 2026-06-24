import React from 'react';
import { Search, Filter } from 'lucide-react';

const FilterBar = ({ search, setSearch, status, setStatus }) => {
  return (
    <div className="flex gap-4 mb-6 animate-fade-in flex-col md:flex-row" style={{ flexWrap: 'wrap' }}>
      <div className="form-group mb-0" style={{ flex: 1, position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="form-input"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>
      <div className="form-group mb-0" style={{ position: 'relative', minWidth: '200px' }}>
        <Filter size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <select
          className="form-input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ paddingLeft: '2.5rem', appearance: 'none' }}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
