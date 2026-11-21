import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "@/pages/LoginPage"
import DirectorioPage from "@/pages/DirectorioPage"
import DetallePage from "@/pages/DetallePage"
import NotFoundPage from "@/pages/NotFoundPage"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/empleados" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/empleados"
        element={
          <ProtectedRoute>
            <DirectorioPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/empleados/:id"
        element={
          <ProtectedRoute>
            <DetallePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}