import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    faLeaf,
    faArrowLeft,
    faMapMarkerAlt,
    faCalendarAlt,
    faMoneyBillWave,
} from '@fortawesome/free-solid-svg-icons';

function BuyNowPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [crops, setCrops] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [deliveryAddress, setDeliveryAddress] = useState('');
    // Set default delivery date to tomorrow
    const [deliveryDate, setDeliveryDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    });
    const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Added loading state for submission

    const unitConversionToKg = {
        kg: 1,
        quintal: 100,
        ton: 1000
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const cropId = searchParams.get('cropId');

        const fetchCropDetails = async (id) => {
            try {
                const response = await fetch(`http://localhost:8080/api/crops/${id}`);
                if(response.ok){
                    console.log("data of crop id is successfully fetched [buynowpage]");
                }
                if (!response.ok) throw new Error('Failed to fetch crop details');
                const data = await response.json();
                setCrops([data]);
                setQuantities({ [data.id]: 1 });
            } catch (err) {
                console.error('Error fetching crop:', err);
                setError('Failed to load crop details');
            } finally {
                setLoading(false);
            }
        };

        if (cropId) {
            fetchCropDetails(cropId);
        } else if (location.state?.cartItems?.length > 0) {
            setCrops(location.state.cartItems);
            const initialQuantities = {};
            location.state.cartItems.forEach(item => {
                initialQuantities[item.id] = item.selectedQuantity || item.quantity || 1;
            });
            setQuantities(initialQuantities);
            setLoading(false);
        } else {
            setError('No crop or cart data provided');
            setLoading(false);
        }
    }, [location.search, location.state]);

    const calculateTotal = () => {
        return crops.reduce((sum, item) => {
            const quantity = quantities[item.id] || 1;
            let numericPrice = 0;

            if (item.price && item.price > 0) {
                numericPrice = item.price;
            } else if (item.priceRange) {
                const parts = item.priceRange.split('-').map(p => parseFloat(p));
                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                    numericPrice = (parts[0] + parts[1]) / 2;
                }
            }

            return sum + numericPrice * quantity;
        }, 0).toFixed(2);
    };

    const validateForm = () => {
        const errors = [];
        if (!deliveryAddress.trim()) errors.push('Delivery address is required');
        if (!deliveryDate) errors.push('Delivery date is required');
        if (crops.some(crop => !quantities[crop.id] || quantities[crop.id] < 1)) {
            errors.push('Invalid quantities');
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
           // Check if crop exists and is valid
        if (!crops.length || !crops[0]?.id) {
            toast.error('Invalid crop selection. Please refresh the page.');
            setIsSubmitting(false);
            return;
        }
            // Validate form before submission
        const formErrors = validateForm();
        if (formErrors.length > 0) {
            toast.error(formErrors.join('\n'));
            setIsSubmitting(false);
            return;
        }

        const buyerEmail = localStorage.getItem('email');
        if (!buyerEmail) {
            toast.error('Please login to place an order');
            navigate('/signin');
            setIsSubmitting(false);
            return;
        }

        try {
            const crop = crops[0];
            const unit = crop.unit.toLowerCase();
            const conversionFactor = unitConversionToKg[unit] || 1;
            const quantityInKg = (quantities[crop.id] || 1) * conversionFactor;

            // Calculate price
            let numericPrice;
            if (crop.price && crop.price > 0) {
                numericPrice = crop.price;
            } else if (crop.priceRange) {
                const parts = crop.priceRange.split('-').map(p => parseFloat(p));
                numericPrice = parts.length === 2 ? (parts[0] + parts[1]) / 2 : parseFloat(crop.priceRange);
            } else {
                numericPrice = 0;
            }

            const orderData = {
                cropId: crop.id,
                farmerId: crop.farmer.id,
                buyerEmail: buyerEmail,
                quantity: quantityInKg,
                totalPrice: (numericPrice * quantityInKg).toFixed(2),
                deliveryAddress: deliveryAddress,
                deliveryDate: deliveryDate,
                paymentMethod: paymentMethod
            };

            console.log("Sending order data:", orderData);

            const response = await fetch('http://localhost:8080/api/orders', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(orderData)
            });

            // First read the response as text
            const responseText = await response.text();
            
            if (!response.ok) {
                let errorMessage = 'Order failed';
                try {
                    // Try to parse as JSON to get detailed error messages
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.message || 
                                  (errorData.errors ? errorData.errors.join('\n') : responseText);
                } catch {
                    // If not JSON, use the raw text
                    errorMessage = responseText;
                }
                throw new Error(errorMessage);
            }

            // If successful, parse the response
            const responseData = JSON.parse(responseText);
            console.log("Order successful:", responseData);

            // Show success message
            toast.success(
                <div>
                    <p>Order placed successfully!</p>
                    <p>Order ID: {responseData.id}</p>
                    <button
                        onClick={() => {
                            navigate('/buyer/orders');
                            toast.dismiss();
                        }}
                        className="mt-2 text-sm underline text-blue-600"
                    >
                        View Order Status
                    </button>
                </div>,
                {
                    autoClose: false,
                    closeButton: true
                }
            );

            // Clear cart if coming from cart
            if (location.state?.fromCart) {
                localStorage.removeItem(`cart-${buyerEmail}`);
            }

            // Redirect after 3 seconds
            setTimeout(() => navigate('/buyer/orders'), 3000);
        } catch (err) {
            console.error('Error placing order:', {
                error: err,
                message: err.message,
                stack: err.stack
            });
            
            // User-friendly error messages
            let userMessage = err.message || 'Failed to place order. Please try again.';
            if (err.message.includes('deliveryDate')) {
                userMessage = 'Invalid delivery date. Please choose a future date.';
            } else if (err.message.includes('quantity')) {
                userMessage = 'Invalid quantity. Please check your input.';
            }
            
            toast.error(userMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-green-50">
                <div>Loading crop details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-green-50">
                <div className="p-6 bg-white shadow rounded text-center">
                    <p className="text-red-600 font-semibold">{error}</p>
                    <button 
                        onClick={() => navigate('/BuyerHomePage')} 
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50">
            <header className="bg-white shadow px-6 py-4">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-green-700 font-bold text-xl flex items-center hover:opacity-80"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                        Back
                    </button>
                    <div className="text-green-700 font-bold text-2xl flex items-center">
                        <FontAwesomeIcon icon={faLeaf} className="mr-2 text-green-600" />
                        CropBoom
                    </div>
                    <div className="w-8"></div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Purchase</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        {crops.map(crop => (
                            <div key={crop.id} className="bg-white p-4 rounded shadow mb-4">
                                <div className="flex items-start mb-4">
                                    <img
                                        src={`data:image/jpeg;base64,${crop.cropImage}`}
                                        alt={crop.cropName}
                                        className="w-24 h-24 rounded object-cover mr-4"
                                    />
                                    <div>
                                        <h3 className="font-bold">{crop.cropName}</h3>
                                        <p className="text-sm text-gray-600">Sold by: {crop.farmer.name}</p>
                                        <p className="text-sm text-gray-600">Location: {crop.address}</p>
                                        {(!crop.price || crop.price <= 0) && !crop.priceRange ? (
                                            '⚠ Price not available'
                                        ) : (
                                            `Price per ${crop.unit}: ₹${
                                                crop.price > 0
                                                    ? crop.price
                                                    : (() => {
                                                        const parts = crop.priceRange?.split('-').map(p => parseFloat(p));
                                                        return parts && parts.length === 2
                                                            ? ((parts[0] + parts[1]) / 2).toFixed(2)
                                                            : crop.priceRange || 'N/A';
                                                    })()
                                            }`
                                        )}
                                    </div>
                                </div>

                                <div className="mt-2 text-sm text-gray-700 flex items-center">
                                    <label htmlFor={`qty-${crop.id}`} className="mr-2 font-semibold">Quantity:</label>
                                    <input
                                        type="number"
                                        id={`qty-${crop.id}`}
                                        min="1"
                                        max={crop.availableQuantity}
                                        value={quantities[crop.id] || 1}
                                        onChange={(e) => {
                                            let val = parseInt(e.target.value, 10);
                                            if (isNaN(val) || val < 1) val = 1;
                                            if (val > crop.availableQuantity) val = crop.availableQuantity;
                                            setQuantities(prev => ({ ...prev, [crop.id]: val }));
                                        }}
                                        className="border border-gray-300 rounded px-2 py-1 w-20"
                                        required
                                    />
                                    <span className="ml-2">{crop.unit}</span>
                                </div>

                                <p className="text-xs text-green-600 mt-1 ml-1">
                                    Please confirm your quantity. Maximum available: {crop.availableQuantity} {crop.unit}.
                                </p>
                            </div>
                        ))}

                        <div className="mt-6 text-right text-lg font-semibold">
                            Total: ₹{calculateTotal()}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="address">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                                Delivery Address
                            </label>
                            <textarea
                                id="address"
                                className="w-full border p-2 rounded"
                                rows="3"
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                required
                                placeholder="Enter your complete delivery address"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="date">
                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                Delivery Date
                            </label>
                            <input
                                type="date"
                                id="date"
                                className="w-full border p-2 rounded"
                                value={deliveryDate}
                                onChange={(e) => {
                                    const selectedDate = new Date(e.target.value);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    
                                    if (selectedDate >= today) {
                                        setDeliveryDate(e.target.value);
                                    } else {
                                        toast.error('Delivery date must be today or in the future');
                                    }
                                }}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">
                                <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                                Payment Method
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash_on_delivery"
                                        checked={paymentMethod === 'cash_on_delivery'}
                                        onChange={() => setPaymentMethod('cash_on_delivery')}
                                        className="mr-2"
                                        required
                                    />
                                    Cash on Delivery
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="online_payment"
                                        disabled
                                        className="mr-2"
                                    />
                                    Online Payment (Coming Soon)
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white py-3 px-4 rounded-md font-medium transition duration-200`}
                        >
                            {isSubmitting ? 'Placing Order...' : `Place Order (₹${calculateTotal()})`}
                        </button>
                    </div>
                </form>
            </main>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default BuyNowPage;