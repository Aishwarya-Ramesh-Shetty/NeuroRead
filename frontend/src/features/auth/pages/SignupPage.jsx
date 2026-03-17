import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorBanner from '../../../components/feedback/ErrorBanner.jsx';
import Button from '../../../components/ui/Button.jsx';
import Input from '../../../components/ui/Input.jsx';
import { registerStudent } from '../api/authApi.js';
import { useAuth } from '../hooks/useAuth.js';
import { extractApiErrorMessage } from '../../../utils/api.js';

function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: '',
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
      const session = await registerStudent(form);
      login(session);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrorMessage(extractApiErrorMessage(error, 'Unable to create your account right now.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sand">Get started</p>
        <h2 className="font-display text-3xl text-ink">Create your learner account</h2>
        <p className="text-sm text-slate-500">
          Create a student account to unlock the games and progress dashboard.
        </p>
      </div>
      <ErrorBanner message={errorMessage} />
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Full name"
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          placeholder="Enter your name"
          required
          type="text"
          value={form.name}
        />
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
          placeholder="Create a password"
          required
          type="password"
          value={form.password}
        />
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </Button>
      </form>
      <p className="text-sm text-slate-500">
        Already registered?{' '}
        <Link className="font-semibold text-sea" to="/login">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default SignupPage;
