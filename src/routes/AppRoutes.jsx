import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/Login';
import DashboardPage from '../pages/DashboardPage';
import RegisterPage from '../pages/RegisterPage';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminPage from '../pages/AdminPage';
import AdminRoute from '../components/AdminRoute';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import AddModule from '../pages/addModule';
import AddProject from '../pages/AddProject';
import AddSubModule from '../pages/addSubModule';
import ProfileView from '../pages/profileView';


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
         <Route path="/register" element={<ProtectedRoute>
          <RegisterPage />
          </ProtectedRoute>} 
          /> 
            <Route path="/addModule" element={<ProtectedRoute>
          <AddModule />
          </ProtectedRoute>} 
          /> 
             <Route path="/addSubModule" element={<ProtectedRoute>
          <AddSubModule />
          </ProtectedRoute>} 
          /> 
             <Route path="/addProject" element={<ProtectedRoute>
          <AddProject />
          </ProtectedRoute>} 
          /> 
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
  <Route
            path="/profile-view"
            element={
              <ProtectedRoute>
                <ProfileView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
        </Route>
        <Route
  path="/change-password"
  element={
    <ProtectedRoute>
      <ChangePasswordPage />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;