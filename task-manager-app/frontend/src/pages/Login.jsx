import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      // Error is handled by toast in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-8">
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Login to manage your tasks</p>
        </div>

        <form onSubmit={onSubmit}>
          <Input
            label="Email"
            id="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            required
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            id="password"
            type="password"
            value={formData.password}
            onChange={onChange}
            required
            placeholder="Enter your password"
            className="mb-8"
          />
          <Button type="submit" variant="primary" icon={LogIn} fullWidth disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <p className="text-center mt-4" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </Card>
    </div>
  );
};

export default Login;
