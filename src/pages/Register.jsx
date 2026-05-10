import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { register } from "../services/authService.js";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setUser, setAuthenticated } = useContext(AuthContext);

    const getPasswordStrength = (password) => {
        if (!password) return null;
        if (password.length < 6) return { label: "Too short", level: 0 };
        if (password.length < 8) return { label: "Weak", level: 1 };
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^a-zA-Z0-9]/.test(password);
        const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
        if (score === 0) return { label: "Weak", level: 1 };
        if (score === 1) return { label: "Fair", level: 2 };
        if (score === 2) return { label: "Good", level: 3 };
        return { label: "Strong", level: 4 };
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "Name is required.";
        } else if (formData.name.trim().length > 100) {
            newErrors.name = "Name must be 100 characters or fewer.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        } else if (formData.email.length > 120) {
            newErrors.email = "Email must be 120 characters or fewer.";
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        } else if (formData.password.length > 255) {
            newErrors.password = "Password must be 255 characters or fewer.";
        } else {
            const strength = getPasswordStrength(formData.password);
            if (strength && strength.level <= 1) {
                newErrors.password = "Password is too weak. Add uppercase letters, numbers, or symbols.";
            }
        }

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
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
            const data = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            if (data.token) {
                setUser({ userId: data.userId, name: data.name, email: data.email });
                setAuthenticated(true);
                navigate("/");
            } else {
                setUser(null);
                setAuthenticated(false);
                navigate("/login");
            }
        } catch (err) {
            setErrors({ general: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const strength = getPasswordStrength(formData.password);

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-card-header">
                    <div className="auth-icon">🌾</div>
                    <h1>Create Account</h1>
                    <p>Join the Smart Farming Dashboard</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    <div className={`form-group ${errors.name ? "has-error" : ""}`}>
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Jane Farmer"
                            className="form-input"
                            autoComplete="name"
                            maxLength={100}
                        />
                        {errors.name && <span className="field-error">{errors.name}</span>}
                    </div>

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
                            maxLength={120}
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
                            placeholder="At least 6 characters"
                            className="form-input"
                            autoComplete="new-password"
                            maxLength={255}
                        />
                        {errors.password && <span className="field-error">{errors.password}</span>}
                        {strength && !errors.password && (
                            <div className="password-strength">
                                <div className="strength-bars">
                                    {[1, 2, 3, 4].map((bar) => (
                                        <div
                                            key={bar}
                                            className={`strength-bar ${strength.level >= bar ? `level-${strength.level}` : ""}`}
                                        />
                                    ))}
                                </div>
                                <span className={`strength-label level-${strength.level}`}>{strength.label}</span>
                            </div>
                        )}
                    </div>

                    {errors.general && (
                        <span className="field-error">{errors.general}</span>
                    )}

                    <button
                        type="submit"
                        className="btn-auth"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="btn-loading">
                <span className="spinner"></span> Creating account…
              </span>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className="auth-link">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
