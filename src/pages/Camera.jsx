import React, { useState } from "react";
import MainLayout from "../components/Layout/MainLayout";
import "../styles/camera.css";

function Camera() {
    const [mode, setMode] = useState("menu");
    const [image, setImage] = useState(null);

    return (
        <MainLayout>
            <div className="camera-page">
                <div className="camera-container">

                    {/* MENU MODE */}
                    {mode === "menu" && (
                        <div className="camera-menu">
                            <h1 className="camera-title">🌾 Plant Disease Detection</h1>
                            <p className="camera-subtitle">
                                Analyze your plants for diseases
                            </p>

                            <div className="cards-grid">

                                {/* Take Picture Card */}
                                <div className="camera-card">
                                    <div className="card-icon">📷</div>
                                    <h2>Take Picture</h2>
                                    <p>Use your device camera to capture a plant photo</p>
                                    <button
                                        className="btn-primary"
                                        onClick={() => setMode("camera")}
                                    >
                                        Open Camera
                                    </button>
                                </div>

                                {/* Upload Picture Card */}
                                <div className="camera-card">
                                    <div className="card-icon">📁</div>
                                    <h2>Upload Picture</h2>
                                    <p>Choose an existing photo from your gallery</p>
                                    <button
                                        className="btn-primary"
                                        onClick={() => setMode("upload")}
                                    >
                                        Choose Image
                                    </button>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* CAMERA MODE */}
                    {mode === "camera" && (
                        <div className="camera-view">
                            <h2>Camera Feed</h2>

                            <div
                                style={{
                                    width: "100%",
                                    maxWidth: "600px",
                                    height: "400px",
                                    backgroundColor: "#000",
                                    borderRadius: "8px",
                                    margin: "20px auto",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white"
                                }}
                            >
                                📷 Camera Feed (Camera API integration needed)
                            </div>

                            <div className="camera-controls">
                                <button
                                    className="btn-secondary"
                                    onClick={() => setMode("menu")}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn-primary"
                                    onClick={() => setMode("results")}
                                >
                                    Capture Photo
                                </button>
                            </div>
                        </div>
                    )}

                    {/* UPLOAD MODE */}
                    {mode === "upload" && (
                        <div className="results-view">
                            <h2>Upload Photo</h2>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setImage(URL.createObjectURL(file));
                                    }
                                }}
                            />

                            {/* IMAGE PREVIEW */}
                            {image && (
                                <div style={{ marginTop: "20px" }}>
                                    <img
                                        src={image}
                                        alt="preview"
                                        style={{
                                            width: "300px",
                                            borderRadius: "8px",
                                            border: "2px solid #ccc"
                                        }}
                                    />
                                </div>
                            )}

                            <div className="analysis-controls">

                                {image && (
                                    <button
                                        className="btn-primary"
                                        onClick={() => setMode("results")}
                                    >
                                        Analyze Image
                                    </button>
                                )}

                                <button
                                    className="btn-secondary"
                                    onClick={() => {
                                        setMode("menu");
                                        setImage(null);
                                    }}
                                >
                                    Back to Menu
                                </button>

                            </div>
                        </div>
                    )}

                    {/* RESULTS MODE */}
                    {mode === "results" && (
                        <div className="results-view">
                            <h2>Analysis Results</h2>

                            <div
                                style={{
                                    background: "#f0f0f0",
                                    padding: "20px",
                                    borderRadius: "8px",
                                    marginBottom: "20px"
                                }}
                            >
                                <p>Mock AI Analysis Result</p>
                                <p>🌿 Disease: Healthy Plant</p>
                                <p>📊 Confidence: 92%</p>
                            </div>

                            <div className="analysis-controls">
                                <button
                                    className="btn-secondary"
                                    onClick={() => setMode("menu")}
                                >
                                    Back to Menu
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </MainLayout>
    );
}

export default Camera;