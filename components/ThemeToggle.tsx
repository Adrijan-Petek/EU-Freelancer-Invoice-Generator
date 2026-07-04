type ThemeToggleProps = {
  isDark: boolean;
  onToggle: () => void;
};

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-full border border-slate-300/70 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
    >
      {isDark ? "Light" : "Dark"} mode
    </button>
  );
}
