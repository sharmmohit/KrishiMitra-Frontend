import React, { useState, useEffect } from 'react';
import '../../index.css';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faEye, faEyeSlash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import backgroundImage from '../../assets/signin.png';

function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('farmer'); // NEW ROLE STATE
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('registered') === 'true') {
            toast.success('Successfully registered! Please sign in.', {
                autoClose: 3000,
            });
        }
    }, [location.search]);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validatePassword = (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

    const handleSignIn = async (e) => {
        e.preventDefault();

        let isValid = true;

        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email.");
            isValid = false;
        } else setEmailError('');

        if (!password) {
            setPasswordError("Password is required.");
            isValid = false;
        } else setPasswordError('');

        if (!isValid) return;

        try {
            // 🔥 Correct API endpoint based on role
            const response = await fetch(`https://krishimitra-backend-1-zjwf.onrender.com/api/login/${role}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || "Login failed.");
                return;
            }

            // Buyer sends { buyer: {} }   | Farmer sends { data: {} }
            const user = result.buyer || result.data;

            localStorage.setItem("email", user.email);
            localStorage.setItem("role", user.role);
            localStorage.setItem("token", result.token);

            toast.success("Login successful!", { autoClose: 1500 });

            setTimeout(() => {
                if (user.role === "farmer") {
                    navigate("/FarmerHomePage", { state: { email: user.email } });
                } else {
                    navigate("/BuyerHomePage", { state: { email: user.email } });
                }
            }, 1500);

        } catch (err) {
            console.error(err);
            toast.error("Something went wrong. Try again.");
        }
    };

    return (
        <div
            className="min-h-screen flex justify-center items-center p-4 md:p-10 relative"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 max-w-md w-full animate-fade-in z-10">

                {/* Header */}
                <div className="flex items-center mb-4">
                    <button onClick={() => navigate('/')} className="text-green-600 hover:text-green-800 mr-2">
                        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                    </button>
                    <div className="text-center flex-grow">
                        <div className="flex items-center justify-center mb-2">
                            <FontAwesomeIcon 
                                icon={faLeaf} 
                                size="2x" 
                                className="text-green-600 animate-pulse shadow-md rounded-full bg-white p-2" 
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-green-700">Krishiमित्र</h1>
                        <p className="text-gray-600">It's good to have you back!</p>
                    </div>
                    <div className="w-8"></div>
                </div>

                {/* LOGIN FORM */}
                <form onSubmit={handleSignIn} className="space-y-4">

                    {/* Role Dropdown */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Login As
                        </label>
                        <select
                            className="border p-2 rounded w-full border-green-300 focus:border-green-500"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="farmer">Farmer</option>
                            <option value="buyer">Buyer</option>
                        </select>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${
                                emailError ? 'border-red-500' : 'border-green-300 focus:border-green-500'
                            }`}
                            type="email"
                            placeholder="Email Id"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <p className="text-red-500 text-xs">{emailError}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <div className="relative">
                            <input
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${
                                    passwordError ? 'border-red-500' : 'border-green-300 focus:border-green-500'
                                }`}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
                    </div>

                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                    >
                        Sign In
                    </button>

                    <div className="text-center mt-4">
                        <span className="text-gray-600">New user? </span>
                        <Link to="/" className="font-bold text-sm text-green-500 hover:text-green-800">
                            Register here
                        </Link>
                    </div>

                </form>

                <ToastContainer />

            </div>
        </div>
    );
}

export default SignInForm;
