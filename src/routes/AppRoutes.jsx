import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { ROLES } from '../constants/roles';
import { ROUTES } from '../constants/routes';
import { PublicLayout } from '../layouts/PublicLayout';
import { StudentLayout } from '../layouts/StudentLayout';
import { SellerLayout } from '../layouts/SellerLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { Home as PublicHome } from '../pages/public/Home';
import { Login } from '../pages/public/Login';
import { Register } from '../pages/public/Register';
import { StudentRegister } from '../pages/public/StudentRegister';
import { SellerRegister } from '../pages/public/SellerRegister';
import { PasswordRecovery } from '../pages/public/PasswordRecovery';
import { Home as StudentHome } from '../pages/student/Home';
import { Home as AdminHome } from '../pages/admin/Home';
import { Marketplace } from '../pages/student/marketplace/Marketplace';
import { SellerProfile as MarketplaceSellerProfile } from '../pages/student/marketplace/SellerProfile';
import { SellerMenu } from '../pages/student/marketplace/SellerMenu';
import { ProductDetail } from '../pages/student/marketplace/ProductDetail';
import { Cart } from '../pages/student/Cart';
import { Dashboard } from '../pages/seller/Dashboard';
import { Profile } from '../pages/seller/Profile';
import { Products } from '../pages/seller/Products';
import { ProductForm } from '../pages/seller/ProductForm';
import { Menus } from '../pages/seller/Menus';
import { MenuForm } from '../pages/seller/MenuForm';
import { Orders } from '../pages/seller/Orders';
import { OrderDetail } from '../pages/seller/OrderDetail';
import { History } from '../pages/seller/History';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME} element={<PublicHome />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.STUDENT_REGISTER} element={<StudentRegister />} />
        <Route path={ROUTES.SELLER_REGISTER} element={<SellerRegister />} />
        <Route path={ROUTES.PASSWORD_RECOVERY} element={<PasswordRecovery />} />
        <Route path={ROUTES.SELLERS} element={<Marketplace />} />
        <Route path={`${ROUTES.SELLERS}/:sellerId`} element={<MarketplaceSellerProfile />} />
        <Route path={`${ROUTES.SELLERS}/:sellerId/cardapio`} element={<SellerMenu />} />
        <Route path={`${ROUTES.PRODUCT}/:productId`} element={<ProductDetail />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
        <Route element={<StudentLayout />}>
          <Route path={ROUTES.STUDENT_HOME} element={<StudentHome />} />
          <Route path={ROUTES.CART} element={<Cart />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.SELLER]} />}>
        <Route element={<SellerLayout />}>
          <Route path={ROUTES.SELLER_HOME} element={<Dashboard />} />
          <Route path={ROUTES.SELLER_PROFILE} element={<Profile />} />
          <Route path={ROUTES.SELLER_PRODUCTS} element={<Products />} />
          <Route path={ROUTES.SELLER_PRODUCT_NEW} element={<ProductForm />} />
          <Route path={ROUTES.SELLER_PRODUCT_EDIT} element={<ProductForm />} />
          <Route path={ROUTES.SELLER_MENUS} element={<Menus />} />
          <Route path={ROUTES.SELLER_MENU_NEW} element={<MenuForm />} />
          <Route path={ROUTES.SELLER_ORDERS} element={<Orders />} />
          <Route path={ROUTES.SELLER_ORDER_DETAIL} element={<OrderDetail />} />
          <Route path={ROUTES.SELLER_HISTORY} element={<History />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<AdminLayout />}><Route path={ROUTES.ADMIN_HOME} element={<AdminHome />} /></Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}
