import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUserEdit, faMapMarkerAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditUserProfile() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [buyer, setBuyer] = useState({ 
    name: '', 
    email: '', 
    contactNumber: '', 
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(true); // default to edit mode when opened directly
  const [updatedBuyer, setUpdatedBuyer] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    address: ''
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    phone: '',
    address: ''
  });

 useEffect(() => {
  const email = localStorage.getItem("email");
  const userRole = localStorage.getItem("role");
  setRole(userRole); // <-- This sets the state

  if (!email || !userRole) {
    setError("Email or role not found in localStorage. Please sign in.");
    setLoading(false);
    return;
  }

  fetch(`http://localhost:8080/api/${userRole}/${email}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Failed to fetch profile: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      setBuyer(data);
      setUpdatedBuyer({
        name: data.name || '',
        email: data.email || '',
        phone: data.contactNumber || '',
        address: data.address || ''
      });
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
}, []);


  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!updatedBuyer.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!updatedBuyer.phone.trim()) {      // ✅ changed from contactNumber
      errors.phone = 'Phone is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(updatedBuyer.phone)) {
      errors.phone = 'Phone must be 10 digits';
      isValid = false;
    }

    if (!updatedBuyer.address.trim()) {
      errors.address = 'Address is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleBack = () => {
    navigate('/buyer/profile');
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setFormErrors({
      name: '',
      phone: '',
      address: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBuyer({ ...updatedBuyer, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const email = localStorage.getItem("email");
      fetch(`http://localhost:8080/api/${role}/${email}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: updatedBuyer.name,
        email: updatedBuyer.email,
        contactNumber: updatedBuyer.phone,
        address: updatedBuyer.address
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update profile');
        }
        return response.json();
      })
      .then(data => {
        setBuyer(data);
        toast.success(`${updatedBuyer.name} Profile updated successfully!`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        localStorage.setItem("role", data.role);
        localStorage.setItem("email",data.email);
        navigate(`/${role}/profile`); // ✅ redirect to profile view page
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        toast.error("Failed to update profile. Please try again.", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500 p-4">
        <p className="text-lg font-medium mb-4">Error: {error}</p>
        <button 
          onClick={handleBack}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12 px-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-green-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBack} 
              className="flex items-center hover:text-green-100 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back
            </button>
            <h2 className="text-xl font-bold">
              {role === 'farmer' ? 'Farmer Profile' : 'Buyer Profile'}
            </h2>

            {!editMode && (
              <button 
                onClick={handleEditToggle}
                className="flex items-center hover:text-green-100 transition-colors"
              >
                <FontAwesomeIcon icon={faUserEdit} className="mr-2" />
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {editMode ? (
            <div className="space-y-4">
              {/* Form inputs */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={updatedBuyer.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your full name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={updatedBuyer.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  readOnly
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-500" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={updatedBuyer.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter 10-digit phone number"
                />
                {formErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-500" />
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={updatedBuyer.address}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                  rows="3"
                  placeholder="Enter your full address"
                />
                {formErrors.address && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  onClick={() => setEditMode(false)} 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Profile Display */}
              <div className="pb-4 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-lg font-medium text-gray-900">{buyer.name || 'Not provided'}</p>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p className="text-lg font-medium text-gray-900">{buyer.email || 'Not provided'}</p>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-500" />
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                </div>
                <p className="text-lg font-medium text-gray-900 ml-6">{buyer.phone || 'Not provided'}</p>
              </div>
              <div className="pb-4">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-500" />
                  <p className="text-sm font-medium text-gray-500">Address</p>
                </div>
                <p className="text-lg font-medium text-gray-900 ml-6 whitespace-pre-line">
                  {buyer.address || 'Not provided'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default EditUserProfile;
