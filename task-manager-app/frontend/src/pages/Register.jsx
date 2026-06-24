import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      // Error handled by toast in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex justify-center items-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-8">
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Sign up to start managing tasks</p>
        </div>

        <form onSubmit={onSubmit}>
          <Input label="Name" id="name" value={formData.name} onChange={onChange} required placeholder="Enter your name" />
          <Input label="Email" id="email" type="email" value={formData.email} onChange={onChange} required placeholder="Enter your email" />
          <Input label="Password" id="password" type="password" value={formData.password} onChange={onChange} required placeholder="Enter password" />
          <Input label="Confirm Password" id="confirmPassword" type="password" value={formData.confirmPassword} onChange={onChange} required placeholder="Confirm password" className="mb-8" />
          
          <Button type="submit" variant="primary" icon={UserPlus} fullWidth disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
        
        <p className="text-center mt-4" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
