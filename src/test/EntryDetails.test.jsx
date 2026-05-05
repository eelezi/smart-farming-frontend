import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EntryDetails from "../pages/EntryDetails.jsx";

vi.mock("../components/Layout/MainLayout", () => ({
    default: ({ children }) => <div data-testid="main-layout">{children}</div>,
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: "1" }),
    };
});

describe("Details Screen UI tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        const mockEntries = [
            {
                id: 1,
                userId: "user1",
                cropType: "Wheat",
                location: "North Field",
                area: 50,
                plantingDate: "2025-03-15",
                expectedHarvest: "2025-08-15",
                soilType: "Loamy",
                irrigationType: "Drip",
                status: "Healthy",
                notes: "Needs weekly monitoring",
            },
        ];

        vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
            if (key === "farm_entries") {
                return JSON.stringify(mockEntries);
            }
            return null;
        });

        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
        vi.spyOn(window, "dispatchEvent").mockImplementation(() => true);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    function renderDetails() {
        return render(
            <MemoryRouter>
                <EntryDetails />
            </MemoryRouter>
        );
    }

    it("renders entry details correctly", async () => {
        renderDetails();

        expect(await screen.findByText(/entry information/i)).toBeInTheDocument();
        expect(screen.getByTestId("main-layout")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /back to dashboard/i })).toBeInTheDocument();
        expect(screen.getByText(/wheat\s*entry details/i)).toBeInTheDocument();
        expect(screen.getByText("Wheat")).toBeInTheDocument();
        expect(screen.getByText("North Field")).toBeInTheDocument();
        expect(screen.getByText("50")).toBeInTheDocument();
        expect(screen.getByText("Loamy")).toBeInTheDocument();
        expect(screen.getByText("Drip")).toBeInTheDocument();
        expect(screen.getByText("Healthy")).toBeInTheDocument();
        expect(screen.getByText("Needs weekly monitoring")).toBeInTheDocument();
        expect(screen.getByText(/weather forecast for/i)).toBeInTheDocument();
        expect(screen.getByText(/ai-generated tips & instructions/i)).toBeInTheDocument();
        expect(screen.getByText(/environmental trends/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /generate pdf report/i })).toBeInTheDocument();
    });

    it("navigates back to dashboard when back button is clicked", async () => {
        renderDetails();

        const backButton = await screen.findByRole("button", { name: /back to dashboard/i });
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith("/");
    });
    it("starts pdf generation when generate pdf button is clicked", async () => {
        renderDetails();

        await screen.findByText(/entry information/i);

        const pdfButton = screen.getByRole("button", { name: /generate pdf report/i });

        vi.useFakeTimers();

        fireEvent.click(pdfButton);

        expect(
            screen.getByRole("button", { name: /generating pdf/i })
        ).toBeDisabled();
    });

    it("shows success feedback after pdf generation completes", async () => {
        renderDetails();

        await screen.findByText(/entry information/i);

        const pdfButton = screen.getByRole("button", { name: /generate pdf report/i });

        vi.useFakeTimers();

        fireEvent.click(pdfButton);

        await act(async () => {
            vi.advanceTimersByTime(2000);
        });

        expect(
            screen.getByText(/pdf generated successfully! download will start automatically\./i)
        ).toBeInTheDocument();
    });

    it("shows entry not found when there is no matching entry", async () => {
        Storage.prototype.getItem.mockImplementation((key) => {
            if (key === "farm_entries") {
                return JSON.stringify([
                    {
                        id: 2,
                        cropType: "Corn",
                        location: "South Field",
                    },
                ]);
            }
            return null;
        });

        renderDetails();

        expect(await screen.findByText(/entry not found/i)).toBeInTheDocument();
    });
});