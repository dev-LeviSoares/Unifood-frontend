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
import { Home as SellerHome } from '../pages/seller/Home';
import { Home as AdminHome } from '../pages/admin/Home';

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
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
        <Route element={<StudentLayout />}>
          <Route path={ROUTES.STUDENT_HOME} element={<StudentHome />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.SELLER]} />}>
        <Route element={<SellerLayout />}>
          <Route path={ROUTES.SELLER_HOME} element={<SellerHome />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.ADMIN_HOME} element={<AdminHome />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}
