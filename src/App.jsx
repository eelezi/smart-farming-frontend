import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Camera from "./pages/Camera.jsx";
import AddEntry from "./pages/AddEntry.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import EntryDetails from "./pages/EntryDetails.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {

    return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/add-entry" element={<AddEntry />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/entry/:id" element={<EntryDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// function App() {
//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={<div>TEST DASHBOARD</div>} />
//                 <Route path="/add-entry" element={<AddEntry />} />
//             </Routes>
//         </Router>
//     );
// }

export default App;