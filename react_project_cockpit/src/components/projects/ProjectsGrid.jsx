import React from 'react';
import ProjectCard from './ProjectCard.jsx';

export default function ProjectsGrid({
  projects,
  expandedProjects,
  onToggleExpand,
  onOpenDetails,
  onTaskStatusChange,
  onTaskPriorityChange,
  onAddTaskClick,
  onResetFilters
}) {
  if (projects.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-850 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
        <span className="text-4xl mb-3 block">🔍</span>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          No projects found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          No projects matched your current search and filter criteria.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="mt-4 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          isExpanded={!!expandedProjects[project.id]}
          onToggleExpand={onToggleExpand}
          onOpenDetails={onOpenDetails}
          onTaskStatusChange={onTaskStatusChange}
          onTaskPriorityChange={onTaskPriorityChange}
          onAddTaskClick={onAddTaskClick}
        />
      ))}
    </div>
  );
}
