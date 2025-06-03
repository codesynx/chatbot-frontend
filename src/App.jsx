import { Route, Routes } from "react-router-dom";

import StaticPage from "./pages/StaticPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";

import { Toaster } from "react-hot-toast";

const App = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br
    from-blue-900 via-sky-900 to-blue-700 flex items-center justify-center relative overflow-hidden">


            <Routes>
                <Route path="/" element={<StaticPage />} />  {/* Добавили этот маршрут */}
                <Route path="/dashboard" element={<DashboardPage />} /> {/* Теперь DashboardPage на /dashboard */}
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/verify-email" element={<EmailVerificationPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            </Routes>

            <Toaster />
        </div>
    );
}

export default App;
