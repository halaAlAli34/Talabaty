import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthUser } from "../types";
import authLogo from "../assets/logoo.png";
import "../styles/Login.css";

export default function GoogleOAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { persistAuthUser } = useAuth();
  const [message, setMessage] = useState("Signing you in with Google...");

  useEffect(() => {
    const userPayload = searchParams.get("user");

    if (!userPayload) {
      navigate("/login?googleError=missing_user", { replace: true });
      return;
    }

    try {
      const authUser = JSON.parse(userPayload) as AuthUser;
      persistAuthUser(authUser);
      navigate(authUser.role === "admin" ? "/admin" : authUser.role === "partner" ? "/partner" : "/", { replace: true });
    } catch (error) {
      setMessage("Google login could not be completed.");
      navigate("/login?googleError=invalid_user", { replace: true });
    }
  }, [navigate, persistAuthUser, searchParams]);

  return (
    <main className="login-page">
      <section className="container">
        <div className="row min-vh-100 align-items-center justify-content-center py-4 py-md-5">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <div className="login-card text-center">
              <img src={authLogo} alt="Talabati" className="auth-logo" />
              <p className="auth-kicker mb-2">Google login</p>
              <h1 className="auth-title mb-2">Almost there</h1>
              <p className="auth-subtitle mb-4">{message}</p>
              <Link to="/login" className="auth-outline-btn">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
