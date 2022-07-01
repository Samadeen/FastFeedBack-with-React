import React, { useState, useEffect, useContext, createContext } from 'react';

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signInWithGitHub = (redirect) => {
    setLoading(true);
    return firebase
      .auth()
      .signInWithPopup(new firebase.auth.GithubAuthProvider())
      .then((response) => {
        setUser(response.user);
        return response.user;

        // if (redirect) {
        //   Router.push(redirect);
        // }
      });
  };

  // const signup = (email, password) => {
  //   return firebase
  //     .auth()
  //     .createUserWithEmailAndPassword(email, password)
  //     .then((response) => {
  //       setUser(response.user);
  //       return response.user;
  //     });
  // };

  const signOut = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(false);
      });
  };

  const sendPasswordResetEmail = (email) => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true;
      });
  };

  const confirmPasswordReset = (password, code) => {
    const resetCode = code || getFromQueryString('oobCode');

    return firebase
      .auth()
      .confirmPasswordReset(resetCode, password)
      .then(() => {
        return true;
      });
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    signInWithGitHub,
    signOut,
  };
}

const getFromQueryString = (key) => {
  return queryString.parse(window.location.search)[key];
};
