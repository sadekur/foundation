// src/components/ProjectControls.js
import React from 'react';
import { Plus } from 'lucide-react';

const ProjectControls = ({ 
  currentProject, 
  setCurrentProject, 
  selectedYear, 
  setSelectedYear, 
  projects, 
  availableYears, 
  onAddProject 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Project</label>
            <select
              value={currentProject}
              onChange={(e) => setCurrentProject(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {Object.keys(projects).map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={onAddProject}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Add Project
        </button>
      </div>
    </div>
  );
};

export default ProjectControls;