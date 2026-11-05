import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

const PageHeader = ({ title, description, actions }: PageHeaderProps) => (
  <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <div className="min-w-0">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-0.5 text-sm text-gray-500">{description}</p>
    </div>
    {actions && <div className="shrink-0">{actions}</div>}
  </div>
);

export default PageHeader;
