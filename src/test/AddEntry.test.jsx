import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import AddEntry from "../pages/AddEntry.jsx";

vi.mock("../components/Layout/MainLayout", () => ({
    default: ({ children }) => <div data-testid="main-layout">{children}</div>,
}));

describe("Data Entry Form UI tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
            if (key === "farm_entries") {
                return JSON.stringify([]);
            }
            return null;
        });

        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
        vi.spyOn(window, "dispatchEvent").mockImplementation(() => true);
        vi.spyOn(window.history, "back").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    function renderAddEntry() {
        return render(<AddEntry />);
    }

    it("renders the data entry form correctly", () => {
        renderAddEntry();

        expect(screen.getByTestId("main-layout")).toBeInTheDocument();
        expect(screen.getByText(/add new entry/i)).toBeInTheDocument();
        expect(screen.getByText(/record a new agricultural entry to your dashboard/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /add entry/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    });

    it("marks required fields correctly", () => {
        renderAddEntry();

        expect(screen.getByLabelText(/crop type/i)).toBeRequired();
        expect(screen.getByLabelText(/location/i)).toBeRequired();
        expect(screen.getByLabelText(/planting date/i)).toBeRequired();
        expect(screen.getByLabelText(/field size/i)).toBeRequired();
    });

    it("accepts text input, date input, and textarea values", () => {
        renderAddEntry();

        fireEvent.change(screen.getByLabelText(/crop type/i), {
            target: { value: "Wheat" },
        });
        fireEvent.change(screen.getByLabelText(/location/i), {
            target: { value: "North Field" },
        });
        fireEvent.change(screen.getByLabelText(/planting date/i), {
            target: { value: "2025-03-15" },
        });
        fireEvent.change(screen.getByLabelText(/expected harvest date/i), {
            target: { value: "2025-08-15" },
        });
        fireEvent.change(screen.getByLabelText(/field size/i), {
            target: { value: "50" },
        });
        fireEvent.change(screen.getByLabelText(/notes/i), {
            target: { value: "Needs weekly monitoring" },
        });

        expect(screen.getByLabelText(/crop type/i)).toHaveValue("Wheat");
        expect(screen.getByLabelText(/location/i)).toHaveValue("North Field");
        expect(screen.getByLabelText(/planting date/i)).toHaveValue("2025-03-15");
        expect(screen.getByLabelText(/expected harvest date/i)).toHaveValue("2025-08-15");
        expect(screen.getByLabelText(/field size/i)).toHaveValue(50);
        expect(screen.getByLabelText(/notes/i)).toHaveValue("Needs weekly monitoring");
    });

    it("updates dropdown fields correctly", () => {
        renderAddEntry();

        fireEvent.change(screen.getByLabelText(/unit/i), {
            target: { value: "hectares" },
        });
        fireEvent.change(screen.getByLabelText(/soil type/i), {
            target: { value: "loamy" },
        });
        fireEvent.change(screen.getByLabelText(/irrigation type/i), {
            target: { value: "drip" },
        });
        fireEvent.change(screen.getByLabelText(/current status/i), {
            target: { value: "Healthy" },
        });

        expect(screen.getByLabelText(/unit/i)).toHaveValue("hectares");
        expect(screen.getByLabelText(/soil type/i)).toHaveValue("loamy");
        expect(screen.getByLabelText(/irrigation type/i)).toHaveValue("drip");
        expect(screen.getByLabelText(/current status/i)).toHaveValue("Healthy");
    });

    it("submits successfully and stores the new entry", async () => {
        renderAddEntry();

        fireEvent.change(screen.getByLabelText(/crop type/i), {
            target: { value: "Wheat" },
        });
        fireEvent.change(screen.getByLabelText(/location/i), {
            target: { value: "North Field" },
        });
        fireEvent.change(screen.getByLabelText(/planting date/i), {
            target: { value: "2025-03-15" },
        });
        fireEvent.change(screen.getByLabelText(/field size/i), {
            target: { value: "50" },
        });
        fireEvent.change(screen.getByLabelText(/expected harvest date/i), {
            target: { value: "2025-08-15" },
        });
        fireEvent.change(screen.getByLabelText(/soil type/i), {
            target: { value: "loamy" },
        });
        fireEvent.change(screen.getByLabelText(/irrigation type/i), {
            target: { value: "drip" },
        });
        fireEvent.change(screen.getByLabelText(/current status/i), {
            target: { value: "Healthy" },
        });
        fireEvent.change(screen.getByLabelText(/notes/i), {
            target: { value: "Needs weekly monitoring" },
        });

        fireEvent.click(screen.getByRole("button", { name: /add entry/i }));

        await waitFor(() => {
            expect(Storage.prototype.setItem).toHaveBeenCalled();
        });

        expect(window.dispatchEvent).toHaveBeenCalledWith(expect.any(Event));
        expect(
            screen.getByText(/entry added successfully! it will appear in your dashboard\./i)
        ).toBeInTheDocument();
    });

    it("saves default status as Healthy when current status is not selected", async () => {
        renderAddEntry();

        fireEvent.change(screen.getByLabelText(/crop type/i), {
            target: { value: "Corn" },
        });
        fireEvent.change(screen.getByLabelText(/location/i), {
            target: { value: "South Field" },
        });
        fireEvent.change(screen.getByLabelText(/planting date/i), {
            target: { value: "2025-04-01" },
        });
        fireEvent.change(screen.getByLabelText(/field size/i), {
            target: { value: "75" },
        });

        fireEvent.click(screen.getByRole("button", { name: /add entry/i }));

        await waitFor(() => {
            expect(Storage.prototype.setItem).toHaveBeenCalled();
        });

        const lastCallArgs = Storage.prototype.setItem.mock.calls.at(-1);
        const savedEntries = JSON.parse(lastCallArgs[1]);
        const savedEntry = savedEntries[0];

        expect(savedEntry.status).toBe("Healthy");
    });

    it("triggers browser back when cancel is clicked", () => {
        renderAddEntry();

        fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

        expect(window.history.back).toHaveBeenCalled();
    });
});