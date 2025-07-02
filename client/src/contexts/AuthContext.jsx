import { createContext, useContext, useState } from "react";

const AuthCtx = createContext();
export const useAuthCtx = () => useContext(AuthCtx);

const AuthCtxProvider = ({ children }) => {
  const [auth, setAuth] = useState();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AuthCtx.Provider value={{ auth, setAuth, isLoading, setIsLoading }}>
      {children}
    </AuthCtx.Provider>
  );
};

export default AuthCtxProvider;
