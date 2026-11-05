const SyncIndicator = () => {
  return (
    <span
      className="inline-flex items-center whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
      title="Data is shared across all admin devices"
    >
      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse shrink-0" />
      Real-time sync active
    </span>
  );
};

export default SyncIndicator;
