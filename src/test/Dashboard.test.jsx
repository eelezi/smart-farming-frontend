import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Dashboard from "../pages/Dashboard.jsx";
import { useEntries } from "../hooks/useEntries";
import { useFilters } from "../hooks/useFilters";

vi.mock("../hooks/useEntries", () => ({
    useEntries: vi.fn(),
}));

vi.mock("../hooks/useFilters", () => ({
    useFilters: vi.fn(),
}));

vi.mock("../components/Layout/MainLayout", () => ({
    default: ({ children }) => <div data-testid="main-layout">{children}</div>,
}));

vi.mock("../components/Dashboard/DashboardHeader", () => ({
    default: ({ entriesCount }) => <div>Entries count: {entriesCount}</div>,
}));

vi.mock("../components/AITips/TipsList", () => ({
    default: () => <div>Tips Panel</div>,
}));

vi.mock("../components/Dashboard/FilterBar", () => ({
    default: ({ filters, onFiltersChange }) => (
        <div>
            <label htmlFor="status-filter">Status Filter</label>
            <select
                id="status-filter"
                value={filters.status}
                onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
            >
                <option value="">All</option>
                <option value="Healthy">Healthy</option>
                <option value="Warning">Warning</option>
                <option value="Critical">Critical</option>
            </select>
        </div>
    ),
}));

vi.mock("../components/Dashboard/SortOptions", () => ({
    default: ({ sortBy, onSortChange }) => (
        <div>
            <label htmlFor="sort-by">Sort By</label>
            <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
            >
                <option value="date-asc">Date Asc</option>
                <option value="date-desc">Date Desc</option>
                <option value="name-asc">Name Asc</option>
                <option value="name-desc">Name Desc</option>
            </select>
        </div>
    ),
}));

vi.mock("../components/Dashboard/EntryList", () => ({
    default: ({ entries, loading, error, onSelectEntry, onDelete, onUpdate }) => {
        if (loading) return <div>Loading entries...</div>;
        if (error) return <div>Error loading entries</div>;

        return (
            <div>
                <div data-testid="entry-list">
                    {entries.map((entry) => (
                        <div key={entry.id} data-testid="entry-card">
                            <span>{entry.cropType}</span>
                            <span>{entry.status}</span>
                            <span>{entry.plantingDate}</span>
                            <button onClick={() => onSelectEntry(entry)}>Open</button>
                            <button onClick={() => onDelete(entry.id)}>Delete</button>
                            <button onClick={() => onUpdate({ ...entry, cropType: `${entry.cropType}-updated` })}>
                                Update
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    },
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe("Dashboard Screen UI tests", () => {
    const mockSetEntries = vi.fn();
    const mockSetFilters = vi.fn();
    const mockSetSortBy = vi.fn();

    const mockEntries = [
        {
            id: 1,
            cropType: "Wheat",
            status: "Healthy",
            plantingDate: "2025-03-15",
        },
        {
            id: 2,
            cropType: "Corn",
            status: "Warning",
            plantingDate: "2025-04-01",
        },
        {
            id: 3,
            cropType: "Rice",
            status: "Critical",
            plantingDate: "2025-02-10",
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        useEntries.mockReturnValue({
            entries: mockEntries,
            loading: false,
            error: null,
            setEntries: mockSetEntries,
        });

        useFilters.mockReturnValue({
            filters: { status: "" },
            sortBy: "date-asc",
            setFilters: mockSetFilters,
            setSortBy: mockSetSortBy,
        });
    });

    function renderDashboard() {
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );
    }

    it("renders dashboard entries correctly", () => {
        renderDashboard();

        expect(screen.getByText(/your entries/i)).toBeInTheDocument();
        expect(screen.getByText(/entries count: 3/i)).toBeInTheDocument();
        expect(screen.getByText("Wheat")).toBeInTheDocument();
        expect(screen.getByText("Corn")).toBeInTheDocument();
        expect(screen.getByText("Rice")).toBeInTheDocument();
        expect(screen.getAllByTestId("entry-card")).toHaveLength(3);
    });

    it("filters entries by status", () => {
        useFilters.mockReturnValue({
            filters: { status: "Healthy" },
            sortBy: "date-asc",
            setFilters: mockSetFilters,
            setSortBy: mockSetSortBy,
        });

        renderDashboard();

        expect(screen.getByText("Wheat")).toBeInTheDocument();
        expect(screen.queryByText("Corn")).not.toBeInTheDocument();
        expect(screen.queryByText("Rice")).not.toBeInTheDocument();
        expect(screen.getAllByTestId("entry-card")).toHaveLength(1);
        expect(screen.getByText(/entries count: 1/i)).toBeInTheDocument();
    });

    it("sorts entries by name ascending", () => {
        useFilters.mockReturnValue({
            filters: { status: "" },
            sortBy: "name-asc",
            setFilters: mockSetFilters,
            setSortBy: mockSetSortBy,
        });

        renderDashboard();

        const items = screen.getAllByTestId("entry-card");
        expect(items[0]).toHaveTextContent("Corn");
        expect(items[1]).toHaveTextContent("Rice");
        expect(items[2]).toHaveTextContent("Wheat");
    });

    it("sorts entries by name descending", () => {
        useFilters.mockReturnValue({
            filters: { status: "" },
            sortBy: "name-desc",
            setFilters: mockSetFilters,
            setSortBy: mockSetSortBy,
        });

        renderDashboard();

        const items = screen.getAllByTestId("entry-card");
        expect(items[0]).toHaveTextContent("Wheat");
        expect(items[1]).toHaveTextContent("Rice");
        expect(items[2]).toHaveTextContent("Corn");
    });

    it("calls setFilters when filter changes", () => {
        renderDashboard();

        fireEvent.change(screen.getByLabelText(/status filter/i), {
            target: { value: "Critical" },
        });

        expect(mockSetFilters).toHaveBeenCalledWith({ status: "Critical" });
    });

    it("calls setSortBy when sort option changes", () => {
        renderDashboard();

        fireEvent.change(screen.getByLabelText(/sort by/i), {
            target: { value: "name-desc" },
        });

        expect(mockSetSortBy).toHaveBeenCalledWith("name-desc");
    });

    it("navigates to entry details when an entry is selected", () => {
        renderDashboard();

        const openButtons = screen.getAllByRole("button", { name: /open/i });
        fireEvent.click(openButtons[0]);

        expect(mockNavigate).toHaveBeenCalledWith("/entry/3");
    });

    it("removes an entry when delete is triggered", () => {
        renderDashboard();

        const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
        fireEvent.click(deleteButtons[0]);

        expect(mockSetEntries).toHaveBeenCalled();
    });

    it("updates an entry when update is triggered", () => {
        renderDashboard();

        const updateButtons = screen.getAllByRole("button", { name: /update/i });
        fireEvent.click(updateButtons[0]);

        expect(mockSetEntries).toHaveBeenCalled();
    });

    it("shows loading state correctly", () => {
        useEntries.mockReturnValue({
            entries: [],
            loading: true,
            error: null,
            setEntries: mockSetEntries,
        });

        renderDashboard();

        expect(screen.getByText(/loading entries/i)).toBeInTheDocument();
    });

    it("shows error state correctly", () => {
        useEntries.mockReturnValue({
            entries: [],
            loading: false,
            error: "Failed to load",
            setEntries: mockSetEntries,
        });

        renderDashboard();

        expect(screen.getByText(/error loading entries/i)).toBeInTheDocument();
    });

    it("renders correctly on desktop and mobile widths", () => {
        window.innerWidth = 1280;
        window.dispatchEvent(new Event("resize"));
        renderDashboard();

        expect(screen.getByTestId("main-layout")).toBeInTheDocument();
        expect(screen.getByTestId("entry-list")).toBeInTheDocument();

        window.innerWidth = 375;
        window.dispatchEvent(new Event("resize"));

        expect(screen.getByTestId("main-layout")).toBeInTheDocument();
        expect(screen.getByTestId("entry-list")).toBeInTheDocument();
    });
});