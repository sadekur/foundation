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
    <div className="bg-white rounded-lg shadow-sm p-3 xs:p-4 sm:p-6 mb-4 xs:mb-6">
      
      {/* Main Controls Container */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 xs:gap-6 lg:gap-8">
        
        {/* Left Section - Form Controls */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 xs:gap-4 sm:gap-6 flex-1 min-w-0">
          
          {/* Project Selection */}
          <div className="flex-1 min-w-0 sm:min-w-[200px] lg:min-w-[250px]">
            <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
              Current Project
            </label>
            <select
              value={currentProject}
              onChange={(e) => setCurrentProject(e.target.value)}
              className="w-full p-2 xs:p-2.5 sm:p-3 text-sm xs:text-base
                        border border-gray-300 rounded-md xs:rounded-lg 
                        focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                        transition-all duration-200 hover:border-gray-400"
            >
              <option value="">Select a project</option>
              {Object.keys(projects).map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
            
            {/* Project Info - Responsive */}
            {projectInfo && (
              <div className="mt-1.5 xs:mt-2 text-xs text-gray-500 space-y-1">
                <div className="flex flex-col xs:flex-row xs:gap-4">
                  <div>Active Years: {projectInfo.years.join(', ') || 'No data'}</div>
                  <div>Total Years: {projectInfo.totalYears}</div>
                </div>
              </div>
            )}
          </div>

          {/* Year Selection */}
          <div className="flex-1 min-w-0 sm:min-w-[180px]">
            <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
              <span>Viewing Year</span>
              {currentProject && (
                <span className="ml-1 text-xs text-gray-400 font-normal">
                  ({availableYears.length} year{availableYears.length !== 1 ? 's' : ''})
                </span>
              )}
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full p-2 xs:p-2.5 sm:p-3 text-sm xs:text-base
                        border border-gray-300 rounded-md xs:rounded-lg 
                        focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                        transition-all duration-200 hover:border-gray-400
                        disabled:bg-gray-50 disabled:cursor-not-allowed"
              disabled={!currentProject}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>
                  {year}
                  {projectInfo && !projectInfo.years.includes(year) ? ' (No data)' : ''}
                </option>
              ))}
            </select>
            
            {/* Year Help Text - Mobile Optimized */}
            {currentProject && availableYears.length > 1 && (
              <div className="mt-1.5 xs:mt-2 text-xs text-gray-500 hidden sm:block">
                Switch years to view different periods
              </div>
            )}
          </div>

          {/* Quick Year Navigation - Responsive */}
          {currentProject && projectInfo && projectInfo.years.length > 1 && (
            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
                Quick Navigation
              </label>
              <div className="flex gap-1 xs:gap-1.5 flex-wrap">
                {projectInfo.years.slice(0, window.innerWidth < 640 ? 3 : 5).map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-2 xs:px-3 py-1 xs:py-1.5 text-xs xs:text-sm rounded-md border 
                              transition-all duration-200 font-medium
                              ${selectedYear === year 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                              }
                              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
                    aria-label={`Switch to year ${year}`}
                  >
                    {year}
                  </button>
                ))}
                {projectInfo.years.length > (window.innerWidth < 640 ? 3 : 5) && (
                  <span className="px-2 py-1 text-xs text-gray-500 self-center">
                    +{projectInfo.years.length - (window.innerWidth < 640 ? 3 : 5)} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 flex-shrink-0">
          
          {/* Yearly Summary Button */}
          <button
            onClick={onShowYearlySummary}
            className="flex items-center justify-center xs:justify-start gap-2 
                      bg-green-600 text-white 
                      px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 
                      text-sm xs:text-base font-medium
                      rounded-md xs:rounded-lg 
                      hover:bg-green-700 active:bg-green-800
                      transition-all duration-200 ease-in-out
                      focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50
                      transform hover:scale-105 active:scale-95
                      shadow-sm hover:shadow-md
                      min-h-[40px] xs:min-h-[44px]"
            aria-label="View yearly summary"
          >
            <BarChart3 size={16} className="xs:w-5 xs:h-5 flex-shrink-0" />
            <span className="hidden xs:inline sm:hidden lg:inline">Summary</span>
            <span className="hidden sm:inline lg:hidden">Yearly Summary</span>
            <span className="xs:hidden">Summary</span>
          </button>

          {/* Add Project Button */}
          <button
            onClick={onAddProject}
            className="flex items-center justify-center xs:justify-start gap-2 
                      bg-indigo-600 text-white 
                      px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 
                      text-sm xs:text-base font-medium
                      rounded-md xs:rounded-lg 
                      hover:bg-indigo-700 active:bg-indigo-800
                      transition-all duration-200 ease-in-out
                      focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50
                      transform hover:scale-105 active:scale-95
                      shadow-sm hover:shadow-md
                      min-h-[40px] xs:min-h-[44px]"
            aria-label="Add new project"
          >
            <Plus size={16} className="xs:w-5 xs:h-5 flex-shrink-0" />
            <span className="hidden xs:inline sm:hidden lg:inline">Add</span>
            <span className="hidden sm:inline lg:hidden">Add Project</span>
            <span className="xs:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Project Status Indicator - Responsive */}
      {currentProject && (
        <div className="mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-gray-200">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4">
            
            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                projectInfo && projectInfo.years.includes(selectedYear) 
                  ? 'bg-green-500' 
                  : 'bg-yellow-500'
              }`}></div>
              <span className="text-xs xs:text-sm text-gray-600">
                {projectInfo && projectInfo.years.includes(selectedYear) 
                  ? `Active year - showing ${selectedYear} data` 
                  : `No transactions in ${selectedYear} yet`
                }
              </span>
            </div>
            
            {/* Latest Activity */}
            {projectInfo && projectInfo.years.length > 0 && (
              <div className="text-xs xs:text-sm text-gray-500 pl-4 xs:pl-0">
                Latest: {Math.max(...projectInfo.years)}
              </div>
            )}
          </div>

          {/* Mobile Help Text */}
          {currentProject && availableYears.length > 1 && (
            <div className="mt-2 text-xs text-gray-500 sm:hidden">
              💡 Tip: Use the year buttons above to quickly switch between periods
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ProjectControls;