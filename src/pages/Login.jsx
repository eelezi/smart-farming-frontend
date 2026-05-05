import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { login } from "../services/authService.js";
import { AuthContext } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setUser, setAuthenticated } = useContext(AuthContext);

    const validate = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
            general: "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const data = await login({
                email: formData.email,
                password: formData.password,
            });

            setUser({
                userId: data.userId,
                name: data.name,
                email: data.email,
            });
            setAuthenticated(true);
            navigate("/");
        } catch (err) {
            setErrors({ general: "Invalid credentials" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-card-header">
                    <div className="auth-icon">🌱</div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to your Smart Farming Dashboard</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    <div className={`form-group ${errors.email ? "has-error" : ""}`}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="farmer@example.com"
                            className="form-input"
                            autoComplete="email"
                        />
                        {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>

                    <div className={`form-group ${errors.password ? "has-error" : ""}`}>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="form-input"
                            autoComplete="current-password"
                        />
                        {errors.password && <span className="field-error">{errors.password}</span>}
                    </div>

                    {errors.general && <div className="field-error">{errors.general}</div>}

                    <button
                        type="submit"
                        className="btn-auth"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="btn-loading">
                                <span className="spinner"></span> Signing in…
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{" "}
                        <Link to="/register" className="auth-link">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;