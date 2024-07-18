export const login = (username: string, password: string, role: 'admin' | 'customer') => {
  // Implement your login logic here
  // For now, we'll just simulate a successful login
  return new Promise<{ token: string; role: 'admin' | 'customer' }>((resolve) => {
    setTimeout(() => {
      resolve({ token: 'fake-token', role });
    }, 1000);
  });
};

export const signup = (username: string, password: string) => {
  // Implement your signup logic here
  // For now, we'll just simulate a successful signup
  return new Promise<{ token: string }>((resolve) => {
    setTimeout(() => {
      resolve({ token: 'fake-token' });
    }, 1000);
  });
};
