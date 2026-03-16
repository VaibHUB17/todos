import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthenticationStatus, useSignInEmailPassword } from '@nhost/react';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuthenticationStatus();
  const { signInEmailPassword, isLoading, isError, error } = useSignInEmailPassword();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/todos', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    const response = await signInEmailPassword(formData.email, formData.password);

    if (response?.error) {
      setSubmitError(response.error.message || 'Login failed.');
      return;
    }

    navigate('/todos', { replace: true });
  };

  return (
    <div className="page-shell">
      <div className="card auth-card">
        <h1>Log In</h1>
        <p className="muted">Access your todos with your email and password.</p>

        <form onSubmit={handleSubmit} className="form-grid">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Your password"
          />

          {(submitError || isError || error) && (
            <p className="error-text">{submitError || error?.message || 'Login failed.'}</p>
          )}

          <button type="submit" disabled={isLoading || authLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="auth-footnote">
          Need an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
