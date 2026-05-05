import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

function renderWithAuth(route, routes, authOverrides = {}) {
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
                <Routes>{routes}</Routes>
            </MemoryRouter>
        </AuthContext.Provider>
    );

    return authValue;
}

describe("Cross-screen navigation", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockNavigate.mockReset();
    });

    it("navigates from login to dashboard after successful sign in", async () => {
        authService.login.mockResolvedValue({
            userId: 1,
            name: "Jane Farmer",
            email: "farmer@example.com",
        });

        renderWithAuth(
            "/login",
            <>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<div>Dashboard Screen</div>} />
            </>
        );

        await userEvent.type(screen.getByLabelText(/email address/i), "farmer@example.com");
        await userEvent.type(screen.getByLabelText(/password/i), "Password1!");
        await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledWith({
                email: "farmer@example.com",
                password: "Password1!",
            });
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("navigates from register to dashboard after successful account creation", async () => {
        authService.register.mockResolvedValue({
            userId: 2,
            name: "Jane Farmer",
            email: "farmer@example.com",
        });

        renderWithAuth(
            "/register",
            <>
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<div>Dashboard Screen</div>} />
            </>
        );

        await userEvent.type(screen.getByLabelText(/full name/i), "Jane Farmer");
        await userEvent.type(screen.getByLabelText(/email address/i), "farmer@example.com");
        await userEvent.type(screen.getByLabelText(/^password$/i), "Password1!");
        await userEvent.type(screen.getByLabelText(/confirm password/i), "Password1!");
        await userEvent.click(screen.getByRole("button", { name: /create account/i }));

        await waitFor(() => {
            expect(authService.register).toHaveBeenCalledWith({
                name: "Jane Farmer",
                email: "farmer@example.com",
                password: "Password1!",
            });
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });

    it("navigates from dashboard to entry details and back to dashboard", async () => {
        function DashboardScreen() {
            return (
                <div>
                    <h1>Dashboard Screen</h1>
                    <button onClick={() => mockNavigate("/entry/1")}>Open Details</button>
                </div>
            );
        }

        function EntryDetailsScreen() {
            return (
                <div>
                    <h1>Entry Details Screen</h1>
                    <button onClick={() => mockNavigate("/")}>Back to Dashboard</button>
                </div>
            );
        }

        renderWithAuth(
            "/",
            <>
                <Route path="/" element={<DashboardScreen />} />
                <Route path="/entry/1" element={<EntryDetailsScreen />} />
            </>
        );

        expect(screen.getByText(/dashboard screen/i)).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: /open details/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/entry/1");
        });

        renderWithAuth(
            "/entry/1",
            <>
                <Route path="/" element={<DashboardScreen />} />
                <Route path="/entry/1" element={<EntryDetailsScreen />} />
            </>
        );

        expect(screen.getByText(/entry details screen/i)).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: /back to dashboard/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });
});