import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Camera from "../pages/Camera.jsx";

vi.mock("../components/Layout/MainLayout", () => ({
    default: ({ children }) => <div data-testid="main-layout">{children}</div>,
}));

const mockGetUserMedia = vi.fn();
const mockStop = vi.fn();

describe("Disease Detection Screen UI tests", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        const mockStream = {
            getTracks: () => [{ stop: mockStop }],
        };

        Object.defineProperty(global.navigator, "mediaDevices", {
            writable: true,
            value: {
                getUserMedia: mockGetUserMedia.mockResolvedValue(mockStream),
            },
        });

        global.URL.createObjectURL = vi.fn(() => "blob:mock-image-url");

        HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
            drawImage: vi.fn(),
        }));

        HTMLCanvasElement.prototype.toDataURL = vi.fn(
            () => "data:image/png;base64,mocked-image"
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    function renderCamera() {
        return render(
            <MemoryRouter>
                <Camera />
            </MemoryRouter>
        );
    }

    it("renders the disease detection menu correctly", () => {
        renderCamera();

        expect(screen.getByTestId("main-layout")).toBeInTheDocument();
        expect(screen.getByText(/plant disease detection/i)).toBeInTheDocument();
        expect(screen.getByText(/analyze your plants for diseases/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /open camera/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /choose image/i })).toBeInTheDocument();
    });

    it("does not start the live camera feed on initial render", () => {
        renderCamera();

        expect(mockGetUserMedia).not.toHaveBeenCalled();
    });

    it("starts live camera feed after clicking open camera", async () => {
        renderCamera();

        fireEvent.click(screen.getByRole("button", { name: /open camera/i }));

        await waitFor(() => {
            expect(mockGetUserMedia).toHaveBeenCalled();
        });
    });

    it("requests environment camera when opening the camera", async () => {
        renderCamera();

        fireEvent.click(screen.getByRole("button", { name: /open camera/i }));

        await waitFor(() => {
            expect(mockGetUserMedia).toHaveBeenCalledWith(
                expect.objectContaining({
                    video: expect.objectContaining({
                        facingMode: "environment",
                    }),
                })
            );
        });
    });

    it("shows a camera error after open camera fails", async () => {
        navigator.mediaDevices.getUserMedia = vi
            .fn()
            .mockRejectedValueOnce(new Error("Camera access denied"));

        renderCamera();

        fireEvent.click(screen.getByRole("button", { name: /open camera/i }));

        await waitFor(() => {
            expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
        });

        expect(
            screen.getByText(/could not access the camera\. please ensure permissions are granted\./i)
        ).toBeInTheDocument();
    });

    it("opens upload workflow after clicking choose image", () => {
        renderCamera();

        fireEvent.click(screen.getByRole("button", { name: /choose image/i }));

        expect(screen.getByText(/upload|image|photo|gallery/i)).toBeInTheDocument();
    });
});