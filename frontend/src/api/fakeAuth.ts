/**
 * This represents some generic auth provider API, like Firebase.
 */
const fakeAuthProvider = {
  isAuthenticated: false,

  login(callback : VoidFunction) {
    fakeAuthProvider.isAuthenticated = true;
    setTimeout(callback, 1000); // Fake async
  },

  logout(callback : VoidFunction) {
    fakeAuthProvider.isAuthenticated = false;
    setTimeout(callback, 100)  // Fake async
  }

};

export { fakeAuthProvider };