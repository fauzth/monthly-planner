import { Link } from "react-router-dom";

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}) {
  const btn =
    "mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-semibold text-on-primary hover:bg-primary-hover active:bg-primary-hover";

  return (
    <div className="flex flex-col items-center rounded-2xl border border-line bg-surface px-6 py-10 text-center shadow-sm">
      <div aria-hidden="true" className="text-4xl">
        {icon}
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-fg-muted">{description}</p>
      )}
      {actionLabel && actionTo && (
        <Link to={actionTo} className={btn}>
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button type="button" onClick={onAction} className={btn}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
