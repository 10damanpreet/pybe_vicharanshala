import React, { useState, useEffect, useRef } from 'react';
import { Brain, Search } from 'lucide-react';
import useAppStore from '../store/useAppStore.js';
import ScenarioList from './ScenarioList.jsx';

function Sidebar({ scenarios, concepts, selectedId, onSelect }) {
  const filters = useAppStore((s) => s.filters);
  const setFilters = useAppStore((s) => s.setFilters);

  // Debounced search — waits 350ms after last keystroke before updating filter
  const [searchInput, setSearchInput] = useState(filters.q);
  const debounceTimer = useRef(null);

  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setFilters({ q: searchInput });
    }, 350);
    return () => clearTimeout(debounceTimer.current);
  }, [searchInput, setFilters]);

  return (
    <aside className="sidebar">
      <div className="brand">
        <Brain size={30} />
        <div>
          <strong>PyBe</strong>
          <span>Scenario-first Python</span>
        </div>
      </div>

      <label className="search">
        <Search size={18} />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search scenarios"
        />
      </label>

      <select
        value={filters.difficulty}
        onChange={(e) => setFilters({ difficulty: e.target.value })}
      >
        <option value="">All levels</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      <select
        value={filters.concept}
        onChange={(e) => setFilters({ concept: e.target.value })}
      >
        <option value="">All concepts</option>
        {concepts.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <ScenarioList
        scenarios={scenarios}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </aside>
  );
}

export default Sidebar;
