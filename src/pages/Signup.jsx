import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthenticationStatus, useSignUpEmailPassword } from '@nhost/react';

const Signup = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuthenticationStatus();
  const { signUpEmailPassword, isLoading, isError, error } = useSignUpEmailPassword();

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

    const response = await signUpEmailPassword(formData.email, formData.password, {
      redirectTo: `${window.location.origin}/login`
    });

    if (response?.error) {
      setSubmitError(response.error.message || 'Signup failed.');
      return;
    }

    navigate('/todos', { replace: true });
  };

  return (
    <div className="page-shell">
      <div className="card auth-card">
        <h1>Create Account</h1>
        <p className="muted">Sign up to start managing your todos.</p>

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
            placeholder="At least 6 characters"
          />

          {(submitError || isError || error) && (
            <p className="error-text">{submitError || error?.message || 'Signup failed.'}</p>
          )}

          <button type="submit" disabled={isLoading || authLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footnote">
          Already registered? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
