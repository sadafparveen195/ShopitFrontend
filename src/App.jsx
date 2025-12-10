import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./contexts/AuthContext.jsx";
import MainLayout from "./components/MainLayout.jsx";

const HomePage = lazy(() => import("./Pages/HomePage.jsx"));
const ProductDetailPage = lazy(() => import("./Pages/ProductDetail.jsx"));
const CartPage = lazy(() => import("./Pages/CartPage.jsx"));
const LoginPage = lazy(() => import("./Pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./Pages/RegisterPage.jsx"));
const NotFoundPage = lazy(() => import("./Pages/NotFoundPage.jsx"));
const ContactPage = lazy(()=> import("./Pages/ContactPage.jsx"));
const ProfilePage = lazy(()=> import ("./Pages/ProfilePage.jsx"));
const CheckoutPage = lazy(()=> import ("./Pages/CheckoutPage.jsx"));
const ShopComponent = lazy(()=> import ("./components/Shop.jsx"));
// ✅ ProtectedRoute component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const location = useLocation();


  const noHeaderRoutes = ["/login", "/register"];
  const hideHeader = noHeaderRoutes.includes(location.pathname);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        {hideHeader ? (
          
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        ) : (
          <MainLayout>
            <Routes>
              {/* 🟢 Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/contact" element= {<ContactPage/>}/>
              <Route path="/profile" element= {<ProfilePage/>}/>
              <Route path="/checkout" element= {<CheckoutPage/>}/>
              <Route path="/shop" element= {<ShopComponent/>}/>
              
              

              {/* 🔒 Protected Route (Cart) */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />

              {/* ❌ 404 Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </MainLayout>
        )}
      </Suspense>

      {/* ✅ Toast Notifications */}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;
