import { useState, useCallback } from 'react';
import { getUser, setuser } from '../services/userApi';
import { useEffect } from 'react';

const useUserActions = (shouldFetchAutomatically = false) => {
  const [user, setUser] = useState(null);
  const [getUserloading, setGetUserLoading] = useState(false);
  const [getUserError, setGetUserError] = useState(null);
  const [updateUserloading, setUpdateUserLoading] = useState(false);
  const [updateUserError, setUpdateUserError] = useState(null);

  const fetchUser = useCallback(async () => {
    setGetUserLoading(true);
    try {
      const response = await getUser();
      if (response.data.success) {
        const { User } = response.data;
        const userDataJSON = JSON.stringify(User);
        localStorage.setItem('userData', userDataJSON);
        setUser(User);
        return User;
      }
    } catch (error) {
      setGetUserError(error.message);
    } finally {
      setGetUserLoading(false);
    }
  }, []);

  const setUserWithProfile = useCallback(async (formData) => {
    setUpdateUserLoading(true);
    try {
      const response = await setuser(formData);
      if (response.data.success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      setUpdateUserError(error.message);
    } finally {
      setUpdateUserLoading(false);
    }
  }, []);

  useEffect(() => {
    if (shouldFetchAutomatically) {
      fetchUser();
    }
  }, [fetchUser, shouldFetchAutomatically]);

  return {
    user,
    getUserloading,
    getUserError,
    updateUserloading,
    updateUserError,
    fetchUser,
    setUserWithProfile,
  };
};

export default useUserActions;
