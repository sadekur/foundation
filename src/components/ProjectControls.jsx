// src/components/ProjectControls.js
import React from 'react';
import { BarChart3, Plus } from 'lucide-react';

const ProjectControls = ({ 
  currentProject, 
  setCurrentProject, 
  selectedYear, 
  setSelectedYear, 
  projects, 
  availableYears, 
  onAddProject,
  onShowYearlySummary 
}) => {
  // Helper function to get project info
  const getProjectInfo = (projectName) => {
    if (!projects[projectName]) return null;
    
    const project = projects[projectName];
    const allYears = new Set([
      ...Object.keys(project.income || {}),
      ...Object.keys(project.expenses || {})
    ]);
    
    return {
      totalYears: allYears.size,
      years: Array.from(allYears).map(Number).sort((a, b) => b - a),
      createdYear: project.createdYear || 'Unknown'
    };
  };

  const projectInfo = currentProject ? getProjectInfo(currentProject) : null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-wrap gap-4 items-start justify-between">
        <div className="flex flex-wrap gap-4 items-start">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Project</label>
            <select
              value={currentProject}
              onChange={(e) => setCurrentProject(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 min-w-48"
            >
              <option value="">Select a project</option>
              {Object.keys(projects).map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
            {projectInfo && (
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                <div>Active Years: {projectInfo.years.join(', ') || 'No data'}</div>
                <div>Total Years: {projectInfo.totalYears}</div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Viewing Year
              {currentProject && (
                <span className="ml-1 text-xs text-gray-500">
                  ({availableYears.length} year{availableYears.length !== 1 ? 's' : ''} available)
                </span>
              )}
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              disabled={!currentProject}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>
                  {year}
                  {projectInfo && !projectInfo.years.includes(year) ? ' (No data)' : ''}
                </option>
              ))}
            </select>
            {currentProject && availableYears.length > 1 && (
              <div className="mt-2 text-xs text-gray-500">
                Switch years to view different periods of the project
              </div>
            )}
          </div>

          {/* Quick Year Navigation */}
          {currentProject && projectInfo && projectInfo.years.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick Navigation</label>
              <div className="flex gap-1 flex-wrap">
                {projectInfo.years.slice(0, 5).map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                      selectedYear === year 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {year}
                  </button>
                ))}
                {projectInfo.years.length > 5 && (
                  <span className="px-2 py-1 text-xs text-gray-500">
                    +{projectInfo.years.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={onShowYearlySummary}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <BarChart3 size={20} />
            <span className="hidden sm:inline">Yearly Summary</span>
            <span className="sm:hidden">Summary</span>
          </button>
          <button
            onClick={onAddProject}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Project</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Project Status Indicator */}
      {currentProject && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  projectInfo && projectInfo.years.includes(selectedYear) 
                    ? 'bg-green-500' 
                    : 'bg-yellow-500'
                }`}></div>
                <span className="text-gray-600">
                  {projectInfo && projectInfo.years.includes(selectedYear) 
                    ? `Active year - showing ${selectedYear} data` 
                    : `No transactions in ${selectedYear} yet`
                  }
                </span>
              </div>
            </div>
            
            {projectInfo && projectInfo.years.length > 0 && (
              <div className="text-gray-500">
                Latest activity: {Math.max(...projectInfo.years)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectControls;