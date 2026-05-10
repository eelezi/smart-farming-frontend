import React, { useState, useRef, useEffect } from "react";
import MainLayout from "../components/Layout/MainLayout";
import { getPlantDiseaseInfo, formatDiseaseStatus } from "../services/plantDiseaseService";
import "../styles/camera.css";

function Camera() {
    const [mode, setMode] = useState("menu");
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startCamera = async () => {
        setError(null);
        try {
            // facingMode: "environment" prefers the back (main) camera on mobile devices
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access the camera. Please ensure permissions are granted.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            setStream(null);
        }
    };

    useEffect(() => {
        if (mode === "camera") {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera(); // Cleanup on unmount
    }, [mode]);

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext("2d");
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
                    setImageFile(file);
                    setImage(URL.createObjectURL(file));
                    handleAnalyze(file);
                }
            }, "image/jpeg");
        }
    };

    const handleAnalyze = async (file) => {
        if (!file) return;
        setMode("results");
        setLoading(true);
        setError(null);
        setResults(null);
        
        try {
            const data = await getPlantDiseaseInfo(file);
            setResults(data);
        } catch (err) {
            setError("Failed to analyze the image. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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

                            {error && <p style={{ color: "red" }}>{error}</p>}

                            <div
                                style={{
                                    position: "relative",
                                    width: "100%",
                                    maxWidth: "600px",
                                    margin: "20px auto"
                                }}
                            >
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        borderRadius: "8px",
                                        backgroundColor: "#000",
                                        minHeight: "300px",
                                        objectFit: "cover"
                                    }}
                                />
                                {/* Hidden canvas for capturing the frame */}
                                <canvas ref={canvasRef} style={{ display: "none" }} />
                            </div>

                            <div className="camera-controls">
                                <button
                                    className="btn-secondary"
                                    onClick={() => {
                                        stopCamera();
                                        setMode("menu");
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn-primary"
                                    onClick={capturePhoto}
                                    disabled={!stream}
                                >
                                    Capture & Analyze
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
                                        setImageFile(file);
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
                                        onClick={() => handleAnalyze(imageFile)}
                                    >
                                        Analyze Image
                                    </button>
                                )}

                                <button
                                    className="btn-secondary"
                                    onClick={() => {
                                        setMode("menu");
                                        setImage(null);
                                        setImageFile(null);
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

                            {loading && (
                                <div style={{ padding: "40px", textAlign: "center", background: "#f8f9fa", borderRadius: "12px", marginBottom: "20px" }}>
                                    <div style={{ fontSize: "40px", marginBottom: "15px" }}>⚙️</div>
                                    <h3 style={{ color: "#555", margin: 0 }}>Analyzing your plant...</h3>
                                    <p style={{ color: "#777" }}>Please wait while our AI examines the image.</p>
                                </div>
                            )}
                            
                            {error && (
                                <div style={{ background: "#ffebee", color: "#c62828", padding: "20px", borderRadius: "12px", marginBottom: "20px", textAlign: "left" }}>
                                    <h3 style={{ margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span>⚠️</span> Error
                                    </h3>
                                    <p style={{ margin: 0 }}>{error}</p>
                                </div>
                            )}

                            {!loading && !error && results && (
                                <div style={{ textAlign: "left", background: "#fff", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", marginBottom: "20px" }}>
                                    <div style={{ 
                                        display: "flex", 
                                        alignItems: "center", 
                                        gap: "12px", 
                                        marginBottom: "20px",
                                        paddingBottom: "20px",
                                        borderBottom: "1px solid #eee"
                                    }}>
                                        <span style={{ fontSize: "2.5rem" }}>
                                            {results.status === "DISEASE_FOUND" ? "🩺" : results.status === "DISEASE_NOT_FOUND" ? "🌿" : "❓"}
                                        </span>
                                        <div>
                                            <p style={{ margin: "0 0 4px 0", fontSize: "0.9rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.5px" }}>Detection Status</p>
                                            <h3 style={{ 
                                                margin: 0, 
                                                fontSize: "1.4rem",
                                                color: results.status === "DISEASE_FOUND" ? "#d32f2f" : 
                                                       results.status === "DISEASE_NOT_FOUND" ? "#2e7d32" : "#f57c00" 
                                            }}>
                                                {formatDiseaseStatus(results.status)}
                                            </h3>
                                        </div>
                                    </div>
                                    
                                    <div style={{ lineHeight: "1.6", color: "#444" }}>
                                        <h4 style={{ margin: "0 0 12px 0", color: "#2c3e50", fontSize: "1.1rem" }}>📋 Analysis Details</h4>
                                        <p style={{ margin: 0, whiteSpace: "pre-line", fontSize: "1rem" }}>{results.analysis}</p>
                                    </div>
                                </div>
                            )}

                            <div className="analysis-controls">
                                <button
                                    className="btn-secondary"
                                    onClick={() => {
                                        setMode("menu");
                                        setImage(null);
                                        setImageFile(null);
                                        setResults(null);
                                    }}
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