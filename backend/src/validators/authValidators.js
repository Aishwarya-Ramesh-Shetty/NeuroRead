const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

export const registerValidator = (req) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return { error: { field: 'name', message: 'Name must be at least 2 characters' } };
  }

  if (!email || typeof email !== 'string' || !isEmail(email)) {
    return { error: { field: 'email', message: 'Valid email is required' } };
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return { error: { field: 'password', message: 'Password must be at least 8 characters' } };
  }

  return {
    value: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    }
  };
};

export const loginValidator = (req) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !isEmail(email)) {
    return { error: { field: 'email', message: 'Valid email is required' } };
  }

  if (!password || typeof password !== 'string') {
    return { error: { field: 'password', message: 'Password is required' } };
  }

  return {
    value: {
      email: email.trim().toLowerCase(),
      password
    }
  };
};
