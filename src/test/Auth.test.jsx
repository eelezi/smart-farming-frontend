import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import * as authService from "../services/authService.js";

vi.mock("../services/authService.js", () => ({
    login: vi.fn(),
    register: vi.fn(),
}));

function renderWithAuth(route, ui, authOverrides = {}) {
    const authValue = {
        user: null,
        authenticated: false,
        setUser: vi.fn(),
        setAuthenticated: vi.fn(),
        ...authOverrides,
    };

    render(
        <AuthContext.Provider value={authValue}>
            <MemoryRouter initialEntries={[route]}>
                <Routes>
                    {ui}
                    <Route path="/" element={<div>Dashboard Screen</div>} />
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>
    );

    return authValue;
}

describe("Authentication UI tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows required field errors on empty login submit", async () => {
        renderWithAuth("/login", <Route path="/login" element={<Login />} />);

        await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

        expect(await screen.findByText(/email is required\./i)).toBeInTheDocument();
        expect(await screen.findByText(/^password is required\.$/i)).toBeInTheDocument();
        expect(authService.login).not.toHaveBeenCalled();
    });

    it("shows invalid email error on login", async () => {
        renderWithAuth("/login", <Route path="/login" element={<Login />} />);

        await userEvent.type(screen.getByLabelText(/email address/i), "bad-email");
        await userEvent.type(screen.getByLabelText(/password/i), "Password1!");
        await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

        expect(await screen.findByText(/please enter a valid email address\./i)).toBeInTheDocument();
        expect(authService.login).not.toHaveBeenCalled();
    });

    it("shows invalid credentials message when login fails", async () => {
        authService.login.mockRejectedValue(new Error("Unauthorized"));

        renderWithAuth("/login", <Route path="/login" element={<Login />} />);

        await userEvent.type(screen.getByLabelText(/email address/i), "farmer@example.com");
        await userEvent.type(screen.getByLabelText(/password/i), "Password1!");
        await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

        expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    });

    it("navigates to dashboard after successful login", async () => {
        authService.login.mockResolvedValue({
            userId: 1,
            name: "Jane Farmer",
            email: "farmer@example.com",
        });

        const authValue = renderWithAuth("/login", <Route path="/login" element={<Login />} />);

        await userEvent.type(screen.getByLabelText(/email address/i), "farmer@example.com");
        await userEvent.type(screen.getByLabelText(/password/i), "Password1!");
        await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

        expect(await screen.findByText(/dashboard screen/i)).toBeInTheDocument();
        expect(authService.login).toHaveBeenCalledWith({
            email: "farmer@example.com",
            password: "Password1!",
        });
        expect(authValue.setAuthenticated).toHaveBeenCalledWith(true);
    });

    it("shows required errors on empty register submit", async () => {
        renderWithAuth("/register", <Route path="/register" element={<Register />} />);

        await userEvent.click(screen.getByRole("button", { name: /create account/i }));

        expect(await screen.findByText(/^name is required\.$/i)).toBeInTheDocument();
        expect(await screen.findByText(/^email is required\.$/i)).toBeInTheDocument();
        expect(await screen.findByText(/^password is required\.$/i)).toBeInTheDocument();
        expect(await screen.findByText(/^confirm password is required\.$/i)).toBeInTheDocument();
        expect(authService.register).not.toHaveBeenCalled();
    });

    it("shows invalid email error on register", async () => {
        renderWithAuth("/register", <Route path="/register" element={<Register />} />);

        await userEvent.type(screen.getByLabelText(/full name/i), "Jane Farmer");
        await userEvent.type(screen.getByLabelText(/email address/i), "bad-email");
        await userEvent.type(screen.getByLabelText(/^password$/i), "Password1!");
        await userEvent.type(screen.getByLabelText(/confirm password/i), "Password1!");
        await userEvent.click(screen.getByRole("button", { name: /create account/i }));

        expect(await screen.findByText(/please enter a valid email address\./i)).toBeInTheDocument();
        expect(authService.register).not.toHaveBeenCalled();
    });

    it("shows weak password error on register", async () => {
        renderWithAuth("/register", <Route path="/register" element={<Register />} />);

        await userEvent.type(screen.getByLabelText(/full name/i), "Jane Farmer");
        await userEvent.type(screen.getByLabelText(/email address/i), "farmer@example.com");
        await userEvent.type(screen.getByLabelText(/^password$/i), "abcdefg");
        await userEvent.type(screen.getByLabelText(/confirm password/i), "abcdefg");
        await userEvent.click(screen.getByRole("button", { name: /create account/i }));

        expect(
            await screen.findByText(/password is too weak\. add uppercase letters, numbers, or symbols\./i)
        ).toBeInTheDocument();
        expect(authService.register).not.toHaveBeenCalled();
    });

    it("navigates to dashboard after successful registration", async () => {
        authService.register.mockResolvedValue({
            userId: 2,
            name: "Jane Farmer",
            email: "farmer@example.com",
        });

        const authValue = renderWithAuth("/register", <Route path="/register" element={<Register />} />);

        await userEvent.type(screen.getByLabelText(/full name/i), "Jane Farmer");
        await userEvent.type(screen.getByLabelText(/email address/i), "farmer@example.com");
        await userEvent.type(screen.getByLabelText(/^password$/i), "Password1!");
        await userEvent.type(screen.getByLabelText(/confirm password/i), "Password1!");
        await userEvent.click(screen.getByRole("button", { name: /create account/i }));

        expect(await screen.findByText(/dashboard screen/i)).toBeInTheDocument();
        expect(authService.register).toHaveBeenCalledWith({
            name: "Jane Farmer",
            email: "farmer@example.com",
            password: "Password1!",
        });
        expect(authValue.setAuthenticated).toHaveBeenCalledWith(true);
    });

    it("shows confirm password mismatch error", async () => {
        renderWithAuth("/register", <Route path="/register" element={<Register />} />);

        await userEvent.type(screen.getByLabelText(/full name/i), "Jane Farmer");
        await userEvent.type(screen.getByLabelText(/email address/i), "farmer@example.com");
        await userEvent.type(screen.getByLabelText(/^password$/i), "Password1!");
        await userEvent.type(screen.getByLabelText(/confirm password/i), "Password2!");
        await userEvent.click(screen.getByRole("button", { name: /create account/i }));

        expect(await screen.findByText(/passwords do not match\./i)).toBeInTheDocument();
        expect(authService.register).not.toHaveBeenCalled();
    });
});