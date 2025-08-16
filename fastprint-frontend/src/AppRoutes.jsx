import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserDashboard from './pages/UserDashboard';
import StartProject from './pages/StartProject';
import DesignProject from './pages/DesignProject'; // ✅ Add this at the top
import BookPricing from './pages/BookPricing';
import Shop from './pages/Shop'
import CoverExpert from './pages/CoverExpert';
import Payment from './pages/Payment';
import Products from './pages/Products';
import Services from './pages/Services';
// Products
import PrintBook from './pages/products/PrintBook';
import ComicBook from './pages/products/ComicBook';
import Cookbook from './pages/products/CookBook';
import Ebook from './pages/products/Ebook';
import PhotoBook from './pages/products/PhotoBook';
import PrintMagzine from './pages/products/PrintMagzine';
import YearBook from './pages/products/YearBook';

// Resources
import GuideTemplates from './pages/resources/GuideTemplate';
import Blog from './pages/resources/Blog';
import PublishingResources from './pages/resources/PublishingResources';
import ContactResources from './pages/resources/ContactResources';
import HireProfessional from './pages/resources/HireProfessional';
import OrderLookup from './pages/resources/OrderLookup';
import PlanProject from './pages/resources/PlanProject';

// Main Pages
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import PricingCalculator from './pages/PricingCalculator';
import Portfolio from './pages/Portfolio';
import PrintShop from './pages/PrintShop';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Orders from './pages/Orders'

// Calculators
import PrintBookCalculator from './pages/PrintBookCalculator';
import ComicBookCalculator from './pages/ComicBookCalculator';
import PhotoBookCalculator from './pages/PhotoBookCalculator';
import MagazineCalculator from './pages/MagazineCalculator';
import YearBookCalculator from './pages/YearBookCalculator';
import CalenderCalculator from './pages/CalenderCalculator';
import AdminDashboard from './pages/AdminDashboard';

// ✅ Auth & Account Pages
import ResetPassword from './pages/ResetPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm'; // ✅ Create this file
import VerifyEmail from './pages/VerifyEmail'; // ✅ Create this file
import AccountSettings from './pages/AccountSettings';

//ADMIN PAGES
import ManageUsers from './pages/ManageUsers';
import ManageBooks from './pages/ManageBooks';
import EditComicBook from './pages/MangeBook/EditComicBook';
import EditCalendarSettings from './pages/MangeBook/EditCalendarSettings';
import EditPhotoBookSettings from './pages/MangeBook/EditPhotoBookSettings';
import PrintBookEditSettings from './pages/MangeBook/PrintBookEditSettings';
import YearBookEditSettings from './pages/MangeBook/YearBookEditSettings';
import MagazineEditSettings from './pages/MangeBook/MagazineEditSettings';
import ThesisEditSettings from './pages/MangeBook/ThesisEditSettings';
import ManageOrders from './pages/ManageOrders';
import OrderInfo from './pages/OrderInfo';
import ManageShipping from './pages/ManageShipping';
import AdminPaymentSettings from './pages/AdminPaymentSettings';

//payment getway
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/userdashboard" element={<UserDashboard />} /> {/* ✅ added */}
      <Route path="/start-project" element={<StartProject />} /> {/* ✅ Add this */}
      <Route path="/design-project" element={<DesignProject />} /> {/* ✅ Add this */}
      <Route path="/Shop" element={<Shop />} /> {/* ✅ Add this */}
      <Route path="/cover-expert" element={<CoverExpert />} /> {/* ✅ Add this */}
      <Route path="/payment" element={<Payment />} /> {/* ✅ Add this */}
      <Route path="/admin" element={<AdminDashboard />} /> {/* ✅ Add this */}
      <Route path="/orders" element={<Orders />} /> {/* ✅ Add this */}



      {/*ADMIN PAGES */}
      <Route path="/manage-users" element={<ManageUsers />} />
      <Route path="/manage-books" element={<ManageBooks />} />
      <Route path="/admin/books/comic/edit" element={<EditComicBook />} />
      <Route path="/admin/books/calendar/edit" element={<EditCalendarSettings />} />
      <Route path="/admin/books/photo/edit" element={<EditPhotoBookSettings />} />
      <Route path="/admin/books/printbook/edit" element={<PrintBookEditSettings />} />
      <Route path="/admin/books/yearbook/edit" element={<YearBookEditSettings />} />
      <Route path="/admin/books/magazinebook/edit" element={<MagazineEditSettings />} />
      <Route path="/admin/books/thesis/edit" element={<ThesisEditSettings />} />
      <Route path="/admin/orders" element={<ManageOrders />} />
      <Route path="/admin/payment" element={<AdminPaymentSettings />} />
      <Route path="/admin/order-info" element={<OrderInfo />} />
      <Route path="/admin/shipping" element={<ManageShipping />} />

      <Route path="/pricing" element={<Pricing />} />
      <Route path="/pricing-calculator" element={<PricingCalculator />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/print-shop" element={<PrintShop />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/account-settings" element={<AccountSettings />} /> {/* ✅ added */}

      {/* Pricing Calculators */}
      <Route path="/calculator/printbook" element={<PrintBookCalculator />} />
      <Route path="/calculator/comicbook" element={<ComicBookCalculator />} />
      <Route path="/calculator/photobook" element={<PhotoBookCalculator />} />
      <Route path="/calculator/magazine" element={<MagazineCalculator />} />
      <Route path="/calculator/yearbook" element={<YearBookCalculator />} />
      <Route path="/calculator/calender" element={<CalenderCalculator />} />

      {/* Products */}
      <Route path="/products/print-book" element={<PrintBook />} />
      <Route path="/products/comic-book" element={<ComicBook />} />
      <Route path="/products/cookbook" element={<Cookbook />} />
      <Route path="/products/ebook" element={<Ebook />} />
      <Route path="/products/photo-book" element={<PhotoBook />} />
      <Route path="/products/print-magazine" element={<PrintMagzine />} />
      <Route path="/products/yearbook" element={<YearBook />} />
      <Route path="/products" element={<Products />} />

      {/* Resources */}
      <Route path="/resources/guide-templates" element={<GuideTemplates />} />
      <Route path="/resources/blog" element={<Blog />} />
      <Route path="/resources/publishing-resources" element={<PublishingResources />} />
      <Route path="/resources/contact-resources" element={<ContactResources />} />
      <Route path="/resources/hire-professional" element={<HireProfessional />} />
      <Route path="/resources/order-lookup" element={<OrderLookup />} />
      <Route path="/resources/plan-project" element={<PlanProject />} />
      <Route path="/book-pricing" element={<BookPricing />} />
      <Route path="/services" element={<Services />} />

      {/* Auth & Verification Routes */}
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordConfirm />} /> {/* ✅ added */}
      <Route path="/verify-email/:uidb64/:token" element={<VerifyEmail />} /> {/* ✅ added */}

      {/*;Paymet Getway */}
      <Route path="/success" element={<PaymentSuccess />} />
      <Route path="/cancel" element={<PaymentCancel />} />





    </Routes>
  );
};

export default AppRoutes;
