import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { ROLES } from '../constants/roles';

import { PublicLayout } from '../layouts/PublicLayout';
import { StudentLayout } from '../layouts/StudentLayout';
import { SellerLayout } from '../layouts/SellerLayout';
import { AdminLayout } from '../layouts/AdminLayout';

import { Home as PublicHome } from '../pages/public/Home';
import { Login } from '../pages/public/Login';
import { Register } from '../pages/public/Register';

import { Home as StudentHome } from '../pages/student/Home';
import { SellerMenu } from '../pages/student/SellerMenu';
import { ProductDetails } from '../pages/student/ProductDetails';
import { Cart } from '../pages/student/Cart';
import { OrderConfirmation } from '../pages/student/OrderConfirmation';
import { OrderTracking } from '../pages/student/OrderTracking';
import { OrderHistory } from '../pages/student/OrderHistory';
import { Profile as StudentProfile } from '../pages/student/Profile';

import { Dashboard as SellerDashboard } from '../pages/seller/Dashboard';
import { Products as SellerProducts } from '../pages/seller/Products';
import { ProductCreate } from '../pages/seller/ProductCreate';
import { ProductEdit } from '../pages/seller/ProductEdit';
import { Menu as SellerMenuManage } from '../pages/seller/Menu';
import { Orders as SellerOrders } from '../pages/seller/Orders';
import { OrderDetails as SellerOrderDetails } from '../pages/seller/OrderDetails';
import { Profile as SellerProfile } from '../pages/seller/Profile';

import { Dashboard as AdminDashboard } from '../pages/admin/Dashboard';
import { Users as AdminUsers } from '../pages/admin/Users';
import { Sellers as AdminSellers } from '../pages/admin/Sellers';
import { Products as AdminProducts } from '../pages/admin/Products';
import { Menus as AdminMenus } from '../pages/admin/Menus';
import { Orders as AdminOrders } from '../pages/admin/Orders';
import { Metrics as AdminMetrics } from '../pages/admin/Metrics';

export function AppRoutes() {
  return (
    <Routes>
      {/* Público */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<PublicHome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Estudante */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
        <Route element={<StudentLayout />}>
          <Route path="/app" element={<StudentHome />} />
          <Route path="/app/sellers/:sellerId" element={<SellerMenu />} />
          <Route path="/app/products/:productId" element={<ProductDetails />} />
          <Route path="/app/cart" element={<Cart />} />
          <Route path="/app/orders/:orderId/confirmation" element={<OrderConfirmation />} />
          <Route path="/app/orders/:orderId/tracking" element={<OrderTracking />} />
          <Route path="/app/orders" element={<OrderHistory />} />
          <Route path="/app/profile" element={<StudentProfile />} />
        </Route>
      </Route>

      {/* Vendedor */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.SELLER]} />}>
        <Route element={<SellerLayout />}>
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/products" element={<SellerProducts />} />
          <Route path="/seller/products/new" element={<ProductCreate />} />
          <Route path="/seller/products/:productId/edit" element={<ProductEdit />} />
          <Route path="/seller/menu" element={<SellerMenuManage />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
          <Route path="/seller/orders/:orderId" element={<SellerOrderDetails />} />
          <Route path="/seller/profile" element={<SellerProfile />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/sellers" element={<AdminSellers />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/menus" element={<AdminMenus />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/metrics" element={<AdminMetrics />} />
        </Route>
      </Route>
    </Routes>
  );
}
