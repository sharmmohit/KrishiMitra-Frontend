import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faEye, faEyeSlash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateLoginForm } from '../utils/validators';

function SignInForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('registered') === 'true') {
            toast.success('Successfully registered! Please sign in.');
        }
    }, [location.search]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const { isValid, newErrors } = validateLoginForm(formData);
        setErrors(newErrors);
        
        if (!isValid) return;

        setIsSubmitting(true);
        
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Login failed');

            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('email', data.email);
            
            toast.success('Login successful!');
            
            setTimeout(() => {
                navigate(data.role === 'farmer' ? '/farmer-dashboard' : '/buyer-dashboard');
            }, 1500);
        } catch (error) {
            toast.error(error.message || 'Login failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex justify-center items-center p-4 md:p-10">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 max-w-md w-full animate-fade-in">
                <div className="flex items-center mb-4">
                    <button onClick={() => navigate('/')} className="text-green-600 hover:text-green-800 mr-2">
                        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                    </button>
                    <div className="text-center flex-grow">
                        <FontAwesomeIcon
                            icon={faLeaf}
                            size="2x"
                            className="text-green-600 mb-2 animate-pulse shadow-md rounded-full bg-white p-2"
                        />
                        <h1 className="text-2xl font-bold text-green-700">CropBoom</h1>
                        <p className="text-gray-600">It's good to have you back!</p>
                    </div>
                    <div className="w-8"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {['email', 'password'].map((field) => (
                        <div key={field}>
                            <label className="block text-gray-700 text-sm font-bold mb-2 capitalize">
                                {field === 'email' ? 'Email Address' : 'Password'}
                            </label>
                            <div className="relative">
                                <input
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                        errors[field] ? 'border-red-500' : 'border-gray-300 focus:border-green-500'
                                    }`}
                                    id={field}
                                    name={field}
                                    type={field === 'password' ? (showPassword ? 'text' : 'password') : 'email'}
                                    placeholder={field === 'email' ? 'Email Address' : 'Password'}
                                    value={formData[field]}
                                    onChange={handleChange}
                                />
                                {field === 'password' && (
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                            {errors[field] && <p className="text-red-500 text-xs italic">{errors[field]}</p>}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Signing In...' : 'Sign In'}
                    </button>
                    <div className="text-center mt-4">
                        <span className="text-gray-600">New user? </span>
                        <Link to="/" className="font-bold text-sm text-green-500 hover:text-green-800">
                            Register here
                        </Link>
                    </div>
                </form>
                <ToastContainer position="top-right" autoClose={5000} />
            </div>
        </div>
    );
}

export default SignInForm;