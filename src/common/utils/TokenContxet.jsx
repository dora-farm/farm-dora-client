import { createContext, useContext, useState, useEffect } from 'react';
import { getCookie } from './Cookies';

const TokenContext = createContext(null);

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const jwt = getCookie('jwt_token');
    if (jwt) setToken(jwt);
  }, []);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useToken = () => useContext(TokenContext);