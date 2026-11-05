import { Layers, Plus, Pencil, Trash2 } from "lucide-react";
import { getProjectYearKeys } from "@/lib/utils/projectStats";
import { formatRoundDates, type RoundSummary } from "@/lib/utils/projectRounds";
import type { Projects } from "@/types";

export type ViewMode = "year" | "round";

interface ProjectControlsProps {
  currentProject: string;
  setCurrentProject: (project: string) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  projects: Projects;
  availableYears: number[];
  roundSummaries: RoundSummary[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedRoundId: string;
  setSelectedRoundId: (roundId: string) => void;
  onAddProject: () => void;
  onEditProject: () => void;
  onDeleteProject: () => void;
  onManageRounds: () => void;
}

const ProjectControls = ({
  currentProject,
  setCurrentProject,
  selectedYear,
  setSelectedYear,
  projects,
  availableYears,
  roundSummaries,
  viewMode,
  setViewMode,
  selectedRoundId,
  setSelectedRoundId,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onManageRounds,
}: ProjectControlsProps) => {
  const hasRounds = roundSummaries.length > 0;
  const roundView = hasRounds && viewMode === "round";
  // Helper function to get project info
  const getProjectInfo = (projectName: string) => {
    if (!projects[projectName]) return null;

    const project = projects[projectName];
    const allYears = getProjectYearKeys(project);

    return {
      totalYears: allYears.size,
      years: Array.from(allYears).map(Number).sort((a, b) => b - a),
      createdYear: project.createdYear || "Unknown",
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
            <div className="flex gap-1.5 xs:gap-2">
              <select
                value={currentProject}
                onChange={(e) => setCurrentProject(e.target.value)}
                className="flex-1 min-w-0 p-2 xs:p-2.5 sm:p-3 text-sm xs:text-base
                          border border-gray-300 rounded-md xs:rounded-lg
                          focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                          transition-all duration-200 hover:border-gray-400"
              >
                <option value="">Select a project</option>
                {Object.keys(projects).sort((a, b) => a.localeCompare(b)).map((project) => (
                  <option key={project} value={project}>{project}</option>
                ))}
              </select>
              {currentProject && (
                <>
                  <button
                    type="button"
                    onClick={onEditProject}
                    className="flex-shrink-0 p-2 xs:p-2.5 sm:p-3 border border-gray-300 rounded-md xs:rounded-lg
                              text-gray-500 hover:text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50
                              transition-all duration-200
                              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                    aria-label="Edit project"
                    title="Edit project"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={onManageRounds}
                    className="flex-shrink-0 p-2 xs:p-2.5 sm:p-3 border border-gray-300 rounded-md xs:rounded-lg
                              text-gray-500 hover:text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50
                              transition-all duration-200
                              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                    aria-label="Manage rounds"
                    title="Manage rounds (1st time, 2nd time, …)"
                  >
                    <Layers size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={onDeleteProject}
                    className="flex-shrink-0 p-2 xs:p-2.5 sm:p-3 border border-gray-300 rounded-md xs:rounded-lg
                              text-gray-500 hover:text-red-600 hover:border-red-400 hover:bg-red-50
                              transition-all duration-200
                              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    aria-label="Delete project"
                    title="Delete project"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Project Info - Responsive */}
            {projectInfo && (
              <div className="mt-1.5 xs:mt-2 text-xs text-gray-500 space-y-1">
                <div className="flex flex-col xs:flex-row xs:gap-4">
                  <div>Total Years: {projectInfo.totalYears}</div>
                  {hasRounds && <div>Rounds: {roundSummaries.length}</div>}
                </div>
              </div>
            )}
          </div>

          {/* Year / Round Selection */}
          <div className="flex-1 min-w-0 sm:min-w-[180px]">
            <div className="flex items-center justify-between gap-2 mb-1 xs:mb-2">
              <label className="block text-xs xs:text-sm font-medium text-gray-700">
                <span>{roundView ? "Viewing Round" : "Viewing Year"}</span>
                {currentProject && (
                  <span className="ml-1 text-xs text-gray-400 font-normal">
                    {roundView
                      ? `(${roundSummaries.length} round${roundSummaries.length !== 1 ? "s" : ""})`
                      : `(${availableYears.length} year${availableYears.length !== 1 ? "s" : ""})`}
                  </span>
                )}
              </label>

              {/* Only projects with rounds can switch; everything else stays year-only */}
              {hasRounds && (
                <div className="inline-flex rounded-md border border-gray-300 p-0.5 text-xs" role="group" aria-label="View by">
                  {(["round", "year"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        viewMode === mode ? "bg-emerald-600 text-white" : "text-gray-600 hover:bg-gray-100"
                      }`}
                      aria-pressed={viewMode === mode}
                    >
                      {mode === "round" ? "By Round" : "By Year"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {roundView ? (
              <select
                value={selectedRoundId}
                onChange={(e) => setSelectedRoundId(e.target.value)}
                className="w-full p-2 xs:p-2.5 sm:p-3 text-sm xs:text-base
                          border border-gray-300 rounded-md xs:rounded-lg
                          focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                          transition-all duration-200 hover:border-gray-400"
              >
                {[...roundSummaries].reverse().map((summary) => (
                  <option key={summary.round.id} value={summary.round.id}>
                    {summary.round.name} ({formatRoundDates(summary)})
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full p-2 xs:p-2.5 sm:p-3 text-sm xs:text-base
                          border border-gray-300 rounded-md xs:rounded-lg
                          focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                          transition-all duration-200 hover:border-gray-400
                          disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={!currentProject}
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                    {projectInfo && !projectInfo.years.includes(year) ? " (No data)" : ""}
                  </option>
                ))}
              </select>
            )}

            {/* Help Text - Mobile Optimized */}
            {currentProject && !roundView && availableYears.length > 1 && (
              <div className="mt-1.5 xs:mt-2 text-xs text-gray-500 hidden sm:block">
                Switch years to view different periods
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={onAddProject}
            className="w-full lg:w-auto flex items-center justify-center gap-2 whitespace-nowrap
                      bg-emerald-600 text-white
                      px-5 py-2.5
                      text-sm xs:text-base font-medium
                      rounded-md xs:rounded-lg
                      hover:bg-emerald-700 active:bg-emerald-800
                      transition-all duration-200 ease-in-out
                      focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50
                      shadow-sm hover:shadow-md"
            aria-label="Add new project"
          >
            <Plus size={18} className="flex-shrink-0" />
            <span className="text-sm xs:text-base">Add Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectControls;
