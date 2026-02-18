import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import StackRoutes from "./src/routes/StackRoutes";

export default function App() {
  return (
    <AuthProvider>
      <StackRoutes />
    </AuthProvider>
  );
}