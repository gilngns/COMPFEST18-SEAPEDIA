
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SelectRole from "./pages/auth/SelectRole";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerStore from "./pages/seller/SellerStore";
import SellerFinance from "./pages/seller/SellerFinance";
import SellerOrders from "./pages/seller/SellerOrders";
import Landing from "./pages/shop/Landing";
import SearchResults from "./pages/shop/SearchResults";
import ProductDetail from "./pages/shop/ProductDetail";
import Cart from "./pages/shop/Cart";
import Checkout from "./pages/shop/Checkout";

import BuyerLayout from "./components/buyer/BuyerLayout";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import BuyerOrders from "./pages/buyer/BuyerOrders";
import BuyerWallet from "./pages/buyer/BuyerWallet";
import BuyerAddress from "./pages/buyer/BuyerAddress";
import DriverLayout from "./components/driver/DriverLayout";
import DriverDashboard from "./pages/driver/DriverDashboard";
import DriverJobs from "./pages/driver/DriverJobs";
import DriverJobDetail from "./pages/driver/DriverJobDetail";
import DriverDeliveries from "./pages/driver/DriverDeliveries";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminVoucherPromo from "./pages/admin/AdminVoucherPromo";
import AdminOrders from "./pages/admin/AdminOrders";

import { useAuth } from "./context/AuthContext";
import { Button } from "./components/ui";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-sm w-full">
        <h1 className="text-3xl font-bold text-[#147287] mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-6">Halo, <span className="font-semibold text-gray-700">{user?.username}</span>! Kamu berhasil masuk sebagai <span className="font-semibold text-gray-700">{user?.activeRole}</span></p>
        
        <Button onClick={logout} variant="outline" className="w-full">
          Keluar (Logout)
        </Button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/select-role" element={<SelectRole />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
              path="/seller"
              element={
                <ProtectedRoute allowedRoles={["SELLER"]}>
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/products"
              element={
                <ProtectedRoute allowedRoles={["SELLER"]}>
                  <SellerProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/orders"
              element={
                <ProtectedRoute allowedRoles={["SELLER"]}>
                  <SellerOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/store"
              element={
                <ProtectedRoute allowedRoles={["SELLER"]}>
                  <SellerStore />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/finance"
              element={
                <ProtectedRoute allowedRoles={["SELLER"]}>
                  <SellerFinance />
                </ProtectedRoute>
              }
            />

          {}
          <Route
            path="/buyer"
            element={
              <ProtectedRoute allowedRoles={["BUYER"]}>
                <BuyerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<BuyerDashboard />} />
            <Route path="orders" element={<BuyerOrders />} />
            <Route path="wallet" element={<BuyerWallet />} />
            <Route path="address" element={<BuyerAddress />} />
          </Route>

          {}
          <Route
            path="/driver"
            element={
              <ProtectedRoute allowedRoles={["DRIVER"]}>
                <DriverLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DriverDashboard />} />
            <Route path="jobs" element={<DriverJobs />} />
            <Route path="jobs/:id" element={<DriverJobDetail />} />
            <Route path="deliveries" element={<DriverDeliveries />} />
          </Route>

          {}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="promos" element={<AdminVoucherPromo />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>

          <Route path="/catalog" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={
            <ProtectedRoute allowedRoles={["BUYER"]}>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={["BUYER"]}>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Landing />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}