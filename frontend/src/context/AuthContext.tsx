import React, { createContext, useContext, useState } from "react";

interface Module {
  module_id: string;
  module_name: string;
  parent_module_id: string | null;
  children?: Module[];
}

interface AuthContextType {
  modules: Module[];
  setModules: (modules: Module[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<Module[]>([]);

  return (
    <AuthContext.Provider value={{ modules, setModules }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};