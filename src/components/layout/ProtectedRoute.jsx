import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-gray-500">
        Memuat...
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
