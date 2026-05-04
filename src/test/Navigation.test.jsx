import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
    MemoryRouter,
    Routes,
    Route,
} from "react-router-dom";

import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import EntryDetails from "../pages/EntryDetails.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

vi.mock("../services/authService.js", () => ({
    login: vi.fn(),
    register: vi.fn(),
}));

vi.mock("../components/Layout/MainLayout", () => ({
    default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../components/Dashboard/DashboardHeader", () => ({
    default: ({ entriesCount }) => <div>Dashboard Header {entriesCount}</div>,
}));

vi.mock("../components/Dashboard/FilterBar", () => ({
    default: () => <div>Filter Bar</div>,
}));

vi.mock("../components/Dashboard/SortOptions", () => ({
    default: () => <div>Sort Options</div>,
}));

vi.mock("../components/AITips/TipsList", () => ({
    default: () => <div>Tips List</div>,
}));

vi.mock("../hooks/useFilters", () => ({
    useFilters: () => ({
        filters: { status: "" },
        sortBy: "date-desc",
        setFilters: vi.fn(),
        setSortBy: vi.fn(),
    }),
}));

vi.mock("../hooks/useEntries", () => ({
    useEntries: () => ({
        entries: [
            {
                id: 1,
                cropType: "Wheat",
                plantingDate: "2025-03-15",
                expectedHarvest: "2025-08-15",
                location: "North Field",
                area: 50,
                soilType: "Loamy",
                irrigationType: "Drip irrigation",
                status: "Healthy",
                notes: "Healthy crop",
            },
        ],
        loading: false,
        error: null,
        setEntries: vi.fn(),
    }),
}));

vi.mock("../components/Dashboard/EntryList", () => ({
    default: ({ entries, onSelectEntry }) => (
        <div>
            <div>Entry List</div>
            <button onClick={() => onSelectEntry(entries[0])}>
                Open First Entry
            </button>
        </div>
    ),
}));

const { login, register } = await import("../services/authService.js");

function renderWithAuth(ui, { route = "/login" } = {}) {
    const authValue = {
        user: null,
        authenticated: false,
        setUser: vi.fn(),
        setAuthenticated: vi.fn(),
    };

    return render(
        <AuthContext.Provider value={authValue}>
            <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </AuthContext.Provider>
    );
}

describe("Cross-screen navigation", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it("navigates from login to dashboard after successful sign in", async () => {
        login.mockResolvedValue({
            userId: 1,
            name: "Jane Farmer",
            email: "farmer@example.com",
        });

        const authValue = {
            user: null,
            authenticated: false,
            setUser: vi.fn(),
            setAuthenticated: vi.fn(),
        };

        render(
            <AuthContext.Provider value={authValue}>
                <MemoryRouter initialEntries={["/login"]}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<div>Dashboard Screen</div>} />
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        );

        await userEvent.type(
            screen.getByLabelText(/email address/i),
            "farmer@example.com"
        );
        await userEvent.type(
            screen.getByLabelText(/password/i),
            "Password1!"
        );
        await userEvent.click(
            screen.getByRole("button", { name: /sign in/i })
        );

        await waitFor(() => {
            expect(screen.getByText("Dashboard Screen")).toBeInTheDocument();
        });

        expect(login).toHaveBeenCalledWith({
            email: "farmer@example.com",
            password: "Password1!",
        });
        expect(authValue.setAuthenticated).toHaveBeenCalledWith(true);
    });

    it("navigates from register to dashboard after successful account creation", async () => {
        register.mockResolvedValue({
            userId: 2,
            name: "Jane Farmer",
            email: "farmer@example.com",
        });

        const authValue = {
            user: null,
            authenticated: false,
            setUser: vi.fn(),
            setAuthenticated: vi.fn(),
        };

        render(
            <AuthContext.Provider value={authValue}>
                <MemoryRouter initialEntries={["/register"]}>
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<div>Dashboard Screen</div>} />
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        );

        await userEvent.type(
            screen.getByLabelText(/full name/i),
            "Jane Farmer"
        );
        await userEvent.type(
            screen.getByLabelText(/email address/i),
            "farmer@example.com"
        );
        await userEvent.type(
            screen.getByLabelText(/^password$/i),
            "Password1!"
        );
        await userEvent.click(
            screen.getByRole("button", { name: /create account/i })
        );

        await waitFor(() => {
            expect(screen.getByText("Dashboard Screen")).toBeInTheDocument();
        });

        expect(register).toHaveBeenCalledWith({
            name: "Jane Farmer",
            email: "farmer@example.com",
            password: "Password1!",
        });
        expect(authValue.setAuthenticated).toHaveBeenCalledWith(true);
    });

    it("navigates from dashboard to entry details and back to dashboard", async () => {
        localStorage.setItem(
            "farm_entries",
            JSON.stringify([
                {
                    id: 1,
                    cropType: "Wheat",
                    plantingDate: "2025-03-15",
                    expectedHarvest: "2025-08-15",
                    location: "North Field",
                    area: 50,
                    soilType: "Loamy",
                    irrigationType: "Drip irrigation",
                    status: "Healthy",
                    notes: "Healthy crop",
                },
            ])
        );

        render(
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/entry/:id" element={<EntryDetails />} />
                </Routes>
            </MemoryRouter>
        );

        await userEvent.click(
            screen.getByRole("button", { name: /open first entry/i })
        );

        expect(
            await screen.findByRole("heading", { name: /wheat entry details/i })
        ).toBeInTheDocument();

        await userEvent.click(
            screen.getByRole("button", { name: /back to dashboard/i })
        );

        await waitFor(() => {
            expect(screen.getByText(/your entries/i)).toBeInTheDocument();
        });
    });
});