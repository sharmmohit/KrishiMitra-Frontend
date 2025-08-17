import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Components/Landing';
import SignIn from './Components/SignIn';
import FarmerRegistrationForm from './Components/FarmerRegistrationForm';
import BuyerRegistrationForm from './Components/BuyerRegistrationForm';
import BuyerHomePage from './Components/BuyerHomePage';
import FarmerHomePage from './Components/FarmerHomePage';
import UploadCropForm from './Components/UploadCropForm';
import MyCropListings from './Components/MyCropListings';
import BuyerCart from './Components/BuyerCart';
import BuyNowPage from './Components/BuyNowPage'; // Import BuyNowPage
import BuyerProfile from './Components/BuyerProfile';
import EditBuyerProfile from './Components/EditBuyerProfile';
import BuyerOrders from './Components/BuyerOrders';
import BookingsPage from './Components/BookingsPage';
import FarmerProfile from './Components/FarmerProfile'; // add this import as it is used below
import ViewListing from './Components/ViewListing';
import EditListing from './Components/EditListing';
import BuyerChat from './Components/BuyerChat'; 

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
