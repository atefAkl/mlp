import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import LandingPage from "./pages/LandingPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import DashboardLayout from "./components/templates/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import UserList from "./pages/UserList";
import RoleList from "./pages/RoleList";
import PermissionList from "./pages/PermissionList";
import SubscribersPage from "./pages/SubscribersPage";
import SubscriberDetails from "./pages/SubscriberDetails";
import GeneralSettings from "./pages/GeneralSettings";
import ProfileSettings from "./pages/ProfileSettings";
import TrainingPrograms from "./pages/TrainingPrograms";
import { getThemeSettings, applyThemeSettings } from "./utils/themeHelper";

// Placeholders for now
const DashboardHome = () => (
    <div className="p-4">
        <h1 className="text-2xl font-bold">Dashboard Home</h1>
        <p className="text-slate-600">Welcome back!</p>
    </div>
);

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    const { i18n } = useTranslation();
    const routerBaseName = window.location.pathname.startsWith("/mlp")
        ? "/mlp"
        : "/";

    useEffect(() => {
        const { brand, background, font } = getThemeSettings();
        applyThemeSettings(brand, background, font);
    }, []);

    // Handle Global Direction Change
    useEffect(() => {
        document.dir = i18n.language === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    return (
        <Router basename={routerBaseName}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/subscribe" element={<SubscriptionPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Dashboard Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardHome />} />
                    <Route path="users" element={<UserList />} />
                    <Route path="roles" element={<RoleList />} />
                    <Route path="permissions" element={<PermissionList />} />
                    <Route
                        path="programs/training"
                        element={<TrainingPrograms />}
                    />
                    <Route path="subscribers" element={<SubscribersPage />} />
                    <Route
                        path="subscribers/:type/:id"
                        element={<SubscriberDetails />}
                    />
                    <Route path="profile" element={<ProfileSettings />} />
                    <Route path="settings" element={<GeneralSettings />} />
                </Route>

                {/* Fallback route for unmatched URLs */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <ToastContainer
                position={i18n.language === "ar" ? "top-left" : "top-right"}
                autoClose={3000}
                rtl={i18n.language === "ar"}
            />
        </Router>
    );
}

export default App;
