import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./hooks/useAuth";
import { firebaseConfigured } from "./firebase/config";
import { Root } from "./App";
import "./styles.css";

function ConfigWarning() {
  return (
    <div className="splash">
      <div className="config-warning">
        <h1>Notes</h1>
        <p>Configurá las variables de Firebase en <code>.env</code> para iniciar la aplicación.</p>
        <p>Copiá <code>.env.example</code> como <code>.env</code> y completá los datos de tu proyecto Firebase.</p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {firebaseConfigured ? <AuthProvider><Root /></AuthProvider> : <ConfigWarning />}
  </React.StrictMode>
);