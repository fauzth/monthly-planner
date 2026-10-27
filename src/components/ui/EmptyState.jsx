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
    "mt-4 inline-block rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white";

  return (
    <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-10 text-center shadow-sm">
      <div className="text-4xl">{icon}</div>
      <p className="mt-3 font-semibold">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      {actionLabel && actionTo && (
        <Link to={actionTo} className={btn}>
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && (
        <button onClick={onAction} className={btn}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
