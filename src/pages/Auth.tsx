
import { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };

    // Don't redirect away from update-password route even if logged in
    if (!location.pathname.includes("/auth/update-password")) {
      checkAuth();
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && !location.pathname.includes("/auth/update-password")) {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  // Redirect to login if the user navigates directly to /auth
  useEffect(() => {
    if (location.pathname === "/auth") {
      navigate("/auth/login");
    }
  }, [location.pathname, navigate]);

  return (
    <AuthLayout>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/update-password" element={<UpdatePasswordForm />} />
      </Routes>
    </AuthLayout>
  );
}
