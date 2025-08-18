import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faLeaf, faEye, faEyeSlash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateBuyerForm } from '../../utils/validators';

function BuyerRegistrationForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        shippingAddress: '',
        contactNumber: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

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
        
        const { isValid, newErrors } = validateBuyerForm(formData);
        setErrors(newErrors);
        
        if (!isValid) {
            toast.error('Please fix the form errors');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const response = await fetch('http://localhost:8080/api/auth/register/buyer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    address: formData.shippingAddress,
                    contactNumber: formData.contactNumber,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Registration failed');

            toast.success('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/signin'), 2000);
        } catch (error) {
            toast.error(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex justify-center items-center p-4 md:p-10">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 max-w-md w-full animate-fade-in">
                <div className="flex items-center mb-4">
                    <button onClick={() => navigate('/')} className="text-blue-500 hover:text-blue-700 mr-2">
                        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                    </button>
                    <div className="text-center flex-grow">
                        <FontAwesomeIcon icon={faLeaf} size="2x" className="text-green-600 mb-2 animate-pulse shadow-md rounded-full bg-white p-2" />
                        <h1 className="text-2xl font-bold text-green-700">CropBoom</h1>
                        <div className="flex items-center justify-center mt-2">
                            <FontAwesomeIcon icon={faShoppingCart} size="lg" className="text-blue-500 mr-2" />
                            <h2 className="text-xl font-bold text-gray-800">Buyer Registration</h2>
                        </div>
                    </div>
                    <div className="w-8"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {['name', 'email', 'password', 'shippingAddress', 'contactNumber'].map((field) => (
                        <div key={field}>
                            <div className="flex items-center">
                                <label className="block text-gray-700 text-sm font-bold w-1/3 text-right mr-3 capitalize">
                                    {field.replace(/([A-Z])/g, ' $1').trim()}:
                                </label>
                                <div className="w-2/3 relative">
                                    <input
                                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                                            errors[field] ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                                        }`}
                                        id={field}
                                        name={field}
                                        type={field === 'password' ? (showPassword ? 'text' : 'password') : 
                                              field === 'email' ? 'email' : 
                                              field === 'contactNumber' ? 'tel' : 'text'}
                                        placeholder={
                                            field === 'name' ? 'Your Full Name' :
                                            field === 'email' ? 'Email Address' :
                                            field === 'password' ? 'Password' :
                                            field === 'shippingAddress' ? 'Street, City, Postal Code' :
                                            '10-digit number'
                                        }
                                        value={formData[field]}
                                        onChange={handleChange}
                                    />
                                    {field === 'password' && (
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 focus:outline-none"
                                            onClick={() => setShowPassword(!showPassword)}
                                            title={showPassword ? 'Hide Password' : 'Show Password'}
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="lg" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {errors[field] && <p className="text-red-500 text-xs italic text-right pr-3 mt-1">{errors[field]}</p>}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-4 ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                    
                    <div className="text-center mt-3">
                        <Link to="/signin" className="inline-block align-baseline font-bold text-xs text-blue-500 hover:text-blue-800">
                            Already have an account? Sign In
                        </Link>
                    </div>
                </form>
                <ToastContainer position="top-right" autoClose={5000} />
            </div>
        </div>
    );
}

export default BuyerRegistrationForm;