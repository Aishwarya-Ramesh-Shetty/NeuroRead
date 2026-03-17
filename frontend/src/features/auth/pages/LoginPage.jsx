import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ErrorBanner from '../../../components/feedback/ErrorBanner.jsx';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import { loginStudent } from '../api/authApi.js';
import { useAuth } from '../hooks/useAuth.js';
import { extractApiErrorMessage } from '../../../utils/api.js';

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const session = await loginStudent(form);
      login(session);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      setErrorMessage(extractApiErrorMessage(error, 'Unable to log in right now.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sea">Welcome back</p>
        <h2 className="font-display text-3xl text-ink">Log in to continue learning</h2>
        <p className="text-sm text-slate-500">
          Use your student credentials to continue into the game dashboard.
        </p>
      </div>
      <ErrorBanner message={errorMessage} />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Email"
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="student@example.com"
          required
          type="email"
          value={form.email}
        />
        <Input
          label="Password"
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
          placeholder="Enter your password"
          required
          type="password"
          value={form.password}
        />
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <p className="text-sm text-slate-500">
        New here?{' '}
        <Link className="font-semibold text-sea" to="/signup">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
