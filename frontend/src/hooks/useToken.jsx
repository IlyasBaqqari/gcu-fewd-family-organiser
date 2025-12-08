import { useState } from 'react';

function useToken() {
  // Get token helper function
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    if (!tokenString) return undefined;

    try {
      const userToken = JSON.parse(tokenString);
      return userToken?.token || userToken;
    } catch {
      return tokenString;
    }
  };

  // Initialise state with token from local storage if present
  const [token, setToken] = useState(getToken());

  // Wrapper to save token to localStorage and State
  const saveToken = (userToken) => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  };

  return {
    setToken: saveToken,
    token,
  };
}

export default useToken;
