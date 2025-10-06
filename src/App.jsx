import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Components/Landing/Landing';
import SignIn from './Components/Landing/SignIn';
import FarmerRegistrationForm from './Components/Landing/FarmerRegistrationForm';
import BuyerRegistrationForm from './Components/Landing/BuyerRegistrationForm';
import BuyerHomePage from './Components/Buyer/BuyerHomePage';
import FarmerHomePage from '../../Farmer/FarmerHomePage';
import UploadCropForm from '../../Farmer/UploadCropForm';
import MyCropListings from '../../Farmer/MyCropListings';
import BuyerCart from './Components/Buyer/BuyerCart';
import BuyNowPage from './Components/Buyer/BuyNowPage'; 
import BuyerProfile from './Components/Buyer/BuyerProfile';
import EditBuyerProfile from './Components/Buyer/EditBuyerProfile';
import BuyerOrders from './Components/Buyer/BuyerOrders';
import BookingsPage from '../../Farmer/BookingsPage';
import FarmerProfile from '../../Farmer/FarmerProfile';
import ViewListing from '../../Farmer/ViewListing';
import EditListing from '../../Farmer/EditListing';
import BuyerChat from './Components/Buyer/BuyerChat'; 
import CropRecommendation from '../../Farmer/CropRecommendation';
import PlantDiseaseDetection from '../../Farmer/PlantDiseaseDetection';
import FarmerShop from '../../Farmer/FarmerShop';
import CropPriceTracker from '../../Farmer/CropPriceTracker';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FarmerHomePage/>} />
        <Route path="/signin" element={<SignIn />} />

        {/* Registration */}
        <Route path="/register/farmer" element={<FarmerRegistrationForm />} />
        <Route path="/register/buyer" element={<BuyerRegistrationForm />} />

        {/* Home pages */}
        <Route path="/BuyerHomePage" element={<BuyerHomePage />} />
        <Route path="/FarmerHomePage" element={<FarmerHomePage />} />

        {/* Farmer routes */}
        <Route path="/farmer/upload-crop" element={<UploadCropForm />} />
        <Route path="/farmer/crop-listings" element={<MyCropListings />} />
        <Route path="/farmer/bookings" element={<BookingsPage />} />
        <Route path="/farmer/profile" element={<FarmerProfile />} />
        <Route path="/farmer/listings/:id" element={<ViewListing />} />
        <Route path="/farmer/listings/edit/:id" element={<EditListing />} />
        <Route path="/disease-prediction" element={<PlantDiseaseDetection />} />
        <Route path="/crop-recommendation" element={<CropRecommendation />} />
        <Route path="/farmer/shop" element={<FarmerShop />} />
        <Route path="/crop-price-tracker" element={<CropPriceTracker />} />

        {/* Buyer routes */}
        <Route path="/buyer/cart" element={<BuyerCart />} />
        <Route path="/buyer/checkout" element={<BuyNowPage />} />
        <Route path="/buyer/profile" element={<BuyerProfile />} />
        <Route path="/buyer/profile/edit" element={<EditBuyerProfile />} />
        <Route path="/buyer/orders" element={<BuyerOrders />} />
        <Route path="/buyer/chat" element={<BuyerChat/>} />

        {/* Common edit profile route with role param */}
        <Route path="/edit-profile/:role" element={<EditBuyerProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
