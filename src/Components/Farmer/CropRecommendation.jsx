import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faArrowLeft, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CropRecommendation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });
  const [errors, setErrors] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    const fields = ['nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity', 'ph', 'rainfall'];
    
    fields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      } else if (isNaN(formData[field])) {
        newErrors[field] = 'Must be a number';
      }
    });

    if (formData.ph && (formData.ph < 0 || formData.ph > 14)) {
      newErrors.ph = 'pH must be between 0-14';
    }
    if (formData.humidity && (formData.humidity < 0 || formData.humidity > 100)) {
      newErrors.humidity = 'Humidity must be between 0-100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mockAPICall = async (data) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const crops = ['Rice', 'Wheat', 'Maize', 'Soybean', 'Cotton'];
        const randomCrop = crops[Math.floor(Math.random() * crops.length)];
        resolve({ predicted_crop: randomCrop });
      }, 1500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        const response = await mockAPICall(formData);
        setPrediction(response.predicted_crop);
        showSuccessToast('Crop recommendation generated!');
      } catch (error) {
        console.error("Prediction error:", error);
        showErrorToast('Failed to get recommendation. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formFields = [
    { name: 'nitrogen', label: 'Nitrogen (N)', placeholder: 'Enter N' },
    { name: 'phosphorus', label: 'Phosphorus (P)', placeholder: 'Enter P' },
    { name: 'potassium', label: 'Potassium (K)', placeholder: 'Enter K' },
    { name: 'temperature', label: 'Temperature (°C)', placeholder: 'Enter temp' },
    { name: 'humidity', label: 'Humidity (%)', placeholder: 'Enter %', min: 0, max: 100 },
    { name: 'ph', label: 'Soil pH', placeholder: '0-14', min: 0, max: 14, step: 0.1 },
    { name: 'rainfall', label: 'Rainfall (mm)', placeholder: 'Enter mm', min: 0 }
  ];

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={handleBackClick}
            className="text-green-600 hover:text-green-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </button>
          <h2 className="text-xl font-bold text-green-700 flex items-center">
            <FontAwesomeIcon icon={faChartLine} className="mr-2" />
            Crop Recommendation
          </h2>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>

        {prediction ? (
          <div className="text-center py-4">
            <h3 className="text-lg font-semibold text-green-700 mb-3">Recommended Crop</h3>
            <div className="text-3xl font-bold text-green-800 mb-5 p-3 bg-green-100 rounded-lg">
              {prediction}
            </div>
            <button
              onClick={() => setPrediction(null)}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg w-full"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {formFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={`w-full p-2 text-sm rounded border ${
                        errors[field.name] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={field.placeholder}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg w-full mt-4 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  'GET RECOMMENDATION'
                )}
              </button>
            </form>

            <div className="grid grid-cols-3 gap-2 mt-6 text-center text-xs">
              <div className="bg-green-50 p-2 rounded">
                <p className="font-medium text-green-700">AI-Powered</p>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <p className="font-medium text-green-700">Instant</p>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <p className="font-medium text-green-700">Accurate</p>
              </div>
            </div>
          </>
        )}
      </div>
      <ToastContainer position="bottom-center" />
    </div>
  );
}

export default CropRecommendation;