import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Camera from "./pages/Camera.jsx";
import AddEntry from "./pages/AddEntry.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import EntryDetails from "./pages/EntryDetails.jsx";
import NotFound from "./pages/NotFound.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { PrivateRoute } from "./components/Common/PrivateRoute.jsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    {/* <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}
                    <Route path="/camera" element={<PrivateRoute><Camera /></PrivateRoute>} />
                    <Route path="/add-entry" element={<PrivateRoute><AddEntry /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
                    <Route path="/entry/:id" element={<PrivateRoute><EntryDetails /></PrivateRoute>} />

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
