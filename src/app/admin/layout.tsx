import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ReactNode } from "react";
import "@/styles/admin-override.css";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="admin-container" suppressHydrationWarning>
        {children}
      </div>
    </ProtectedRoute>
  );
}
