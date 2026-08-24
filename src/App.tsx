import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthScreen from "./components/AuthScreen";
import Library from "./components/Library";
import Editor from "./components/Editor";
import { useAuth } from "./hooks/useAuth";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const user = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <AuthScreen />} />
      <Route path="/" element={<PrivateRoute><Library /></PrivateRoute>} />
      <Route path="/notebook/:notebookId" element={<PrivateRoute><Editor /></PrivateRoute>} />
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
}

export function Root() {
  return <BrowserRouter><App /></BrowserRouter>;
}