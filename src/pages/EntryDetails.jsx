import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import "../styles/entry-details.css";

function EntryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [aiTips, setAiTips] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  //Replace with actual API call to fetch entry details

  // useEffect(() => {
  //   const fetchEntryDetails = async () => {
  //     try {
  //       const response = await fetch(`/api/entries/${id}`, {
  //         headers: {
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //           'Content-Type': 'application/json'
  //         }
  //       });
  //       if (response.ok) {
  //         const data = await response.json();
  //         setEntry(data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching entry details:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchEntryDetails();
  // }, [id]);

  //  Replace with actual API call to fetch weather data

  // useEffect(() => {
  //   if (entry?.location) {
  //     const fetchWeather = async () => {
  //       try {
  //         const response = await fetch(`/api/weather?location=${encodeURIComponent(entry.location)}`, {
  //           headers: {
  //             'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //             'Content-Type': 'application/json'
  //           }
  //         });
  //         if (response.ok) {
  //           const weather = await response.json();
  //           setWeatherData(weather);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching weather data:', error);
  //       }
  //     };
  //     fetchWeather();
  //   }
  // }, [entry]);

  //  Replace with actual API call to fetch AI tips

  // useEffect(() => {
  //   if (entry) {
  //     const fetchAiTips = async () => {
  //       try {
  //         const response = await fetch(`/api/ai/tips/${entry.id}`, {
  //           headers: {
  //             'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //             'Content-Type': 'application/json'
  //           }
  //         });
  //         if (response.ok) {
  //           const tips = await response.json();
  //           setAiTips(tips);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching AI tips:', error);
  //       }
  //     };
  //     fetchAiTips();
  //   }
  // }, [entry]);

  //  Replace with actual API call to fetch chart data
 
  // useEffect(() => {
  //   if (entry) {
  //     const fetchChartData = async () => {
  //       try {
  //         const response = await fetch(`/api/analytics/trends/${entry.id}`, {
  //           headers: {
  //             'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //             'Content-Type': 'application/json'
  //           }
  //         });
  //         if (response.ok) {
  //           const data = await response.json();
  //           setChartData(data);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching chart data:', error);
  //       }
  //     };
  //     fetchChartData();
  //   }
  // }, [entry]);

  // Fetch actual entry data from localStorage
  useEffect(() => {
    const fetchEntryFromStorage = () => {
      try {
        const savedEntries = localStorage.getItem("farm_entries");
        if (savedEntries) {
          const allEntries = JSON.parse(savedEntries);
          const foundEntry = allEntries.find(entry => entry.id === parseInt(id));
          
          if (foundEntry) {
            setEntry(foundEntry);
            
            // Set basic fallback data for weather, AI tips, and charts
            setWeatherData({
              current: {
                temperature: 20,
                humidity: 60,
                precipitation: 0,
                windSpeed: 10,
                description: "Clear",
                icon: "☀️"
              },
              forecast: [
                { day: "Today", high: 22, low: 15, precipitation: 0, icon: "☀️" },
                { day: "Tomorrow", high: 24, low: 16, precipitation: 10, icon: "⛅" },
                { day: "Wednesday", high: 21, low: 14, precipitation: 5, icon: "☀️" },
                { day: "Thursday", high: 23, low: 15, precipitation: 0, icon: "☀️" },
                { day: "Friday", high: 20, low: 13, precipitation: 20, icon: "🌧️" }
              ]
            });
            
            setAiTips([
              {
                id: 1,
                type: "watering",
                title: "Watering Reminder",
                description: "Check soil moisture levels and water if needed.",
                priority: "medium"
              }
            ]);
            
            setChartData({
              temperature: [
                { date: "Week 1", value: 18 },
                { date: "Week 2", value: 20 },
                { date: "Week 3", value: 22 },
                { date: "Week 4", value: 19 }
              ],
              humidity: [
                { date: "Week 1", value: 65 },
                { date: "Week 2", value: 60 },
                { date: "Week 3", value: 70 },
                { date: "Week 4", value: 68 }
              ],
              precipitation: [
                { date: "Week 1", value: 5 },
                { date: "Week 2", value: 0 },
                { date: "Week 3", value: 10 },
                { date: "Week 4", value: 3 }
              ]
            });
          } else {
            console.error('Entry not found with ID:', id);
          }
        } else {
          console.error('No entries found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching entry from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntryFromStorage();
  }, [id]);

  // API: Generate PDF from /api/entries/{id}/pdf
  const generatePDF = async () => {
    setPdfGenerating(true);
    try {
      // API: POST to /api/entries/{id}/pdf
      // const response = await fetch(`/api/entries/${id}/pdf`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // Mock PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowFeedback({
        type: 'success',
        message: 'PDF generated successfully! Download will start automatically.'
      });
      
      // API: Download PDF blob
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `entry-${id}-${entry.cropType}.pdf`;
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
      // document.body.removeChild(a);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setShowFeedback({
        type: 'error',
        message: 'Failed to generate PDF. Please try again.'
      });
    } finally {
      setPdfGenerating(false);
      setTimeout(() => setShowFeedback(null), 5000);
    }
  };

  // Handle edit functionality
  const handleEdit = () => {
    setEditFormData({
      cropType: entry.cropType,
      location: entry.location,
      area: entry.area,
      plantingDate: entry.plantingDate,
      expectedHarvest: entry.expectedHarvest,
      soilType: entry.soilType,
      irrigationType: entry.irrigationType,
      status: entry.status,
      notes: entry.notes
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // API: PUT to /api/entries/{id}
      // const response = await fetch(`/api/entries/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(editFormData)
      // });
      
      // Mock update save to localStorage
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get  entries from localStorage
      const savedEntries = localStorage.getItem("farm_entries");
      let allEntries = [];
      
      if (savedEntries) {
        allEntries = JSON.parse(savedEntries);
      } else {

        allEntries = [
          {
            id: 1,
            userId: "user1",
            cropType: "wheat",
            location: "North Field",
            plantingDate: "2025-03-15",
            area: 50,
            areaUnit: "acres",
            status: "Healthy",
            soilType: "loamy",
            expectedHarvest: "2025-08-15"
          },
          {
            id: 2,
            userId: "user1",
            cropType: "corn",
            location: "South Field",
            plantingDate: "2025-04-01",
            area: 75,
            areaUnit: "acres",
            status: "Warning",
            soilType: "clay",
            expectedHarvest: "2025-10-01"
          },
          {
            id: 3,
            userId: "user1",
            cropType: "rice",
            location: "East Paddock",
            plantingDate: "2025-05-10",
            area: 40,
            areaUnit: "acres",
            status: "Critical",
            soilType: "muddy",
            expectedHarvest: "2025-09-20"
          },
          {
            id: 4,
            userId: "user1",
            cropType: "soybeans",
            location: "West Field",
            plantingDate: "2025-04-20",
            area: 60,
            areaUnit: "acres",
            status: "Healthy",
            soilType: "loamy",
            expectedHarvest: "2025-09-15"
          }
        ];
      }
      
      // Find and update the entry with matching ID
      const updatedEntries = allEntries.map(entry => 
        entry.id === parseInt(id) ? { ...entry, ...editFormData } : entry
      );
      
      // Save back to localStorage
      localStorage.setItem("farm_entries", JSON.stringify(updatedEntries));
      
      // Update local state
      setEntry(prev => ({ ...prev, ...editFormData }));
      
      // Dispatch event to update other components with the updated data
      const updateEvent = new CustomEvent("entries-updated", {
        detail: { updatedEntries, updatedEntry: { ...editFormData, id: parseInt(id) } }
      });
      window.dispatchEvent(updateEvent);
      console.log('Updated entry saved to localStorage and event dispatched:', { ...editFormData, id: parseInt(id) });
      
      setShowEditModal(false);
      setShowFeedback({
        type: 'success',
        message: 'Entry updated successfully!'
      });
      setTimeout(() => setShowFeedback(null), 3000);
      
    } catch (error) {
      console.error('Error updating entry:', error);
      setShowFeedback({
        type: 'error',
        message: 'Failed to update entry. Please try again.'
      });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle delete functionality
  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      // API: DELETE /api/entries/{id}
      // const response = await fetch(`/api/entries/${id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // Mock delete remove from localStorage
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get current entries from localStorage
      const savedEntries = localStorage.getItem("farm_entries");
      let allEntries = [];
      
      if (savedEntries) {
        allEntries = JSON.parse(savedEntries);
      } else {
        // If no localStorage, use mock data
        allEntries = [
          {
            id: 1,
            userId: "user1",
            cropType: "wheat",
            location: "North Field",
            plantingDate: "2025-03-15",
            area: 50,
            areaUnit: "acres",
            status: "Healthy",
            soilType: "loamy",
            expectedHarvest: "2025-08-15"
          },
          {
            id: 2,
            userId: "user1",
            cropType: "corn",
            location: "South Field",
            plantingDate: "2025-04-01",
            area: 75,
            areaUnit: "acres",
            status: "Warning",
            soilType: "clay",
            expectedHarvest: "2025-10-01"
          },
          {
            id: 3,
            userId: "user1",
            cropType: "rice",
            location: "East Paddock",
            plantingDate: "2025-05-10",
            area: 40,
            areaUnit: "acres",
            status: "Critical",
            soilType: "muddy",
            expectedHarvest: "2025-09-20"
          },
          {
            id: 4,
            userId: "user1",
            cropType: "soybeans",
            location: "West Field",
            plantingDate: "2025-04-20",
            area: 60,
            areaUnit: "acres",
            status: "Healthy",
            soilType: "loamy",
            expectedHarvest: "2025-09-15"
          }
        ];
      }
      
      // Remove the entry with matching ID
      const updatedEntries = allEntries.filter(entry => entry.id !== parseInt(id));
      
      // Save back to localStorage
      localStorage.setItem("farm_entries", JSON.stringify(updatedEntries));
      
      // Dispatch event to update other components
      window.dispatchEvent(new CustomEvent("entries-updated"));
      
      setShowDeleteModal(false);
      setShowFeedback({
        type: 'success',
        message: 'Entry deleted successfully!'
      });
      setTimeout(() => {
        // Force localStorage refresh by triggering storage event
        window.dispatchEvent(new Event('storage'));
        navigate('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error deleting entry:', error);
      setShowFeedback({
        type: 'error',
        message: 'Failed to delete entry. Please try again.'
      });
      setDeleteLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#2ed573';
      default: return '#747d8c';
    }
  };

  const getPriorityIcon = (type) => {
    switch (type) {
      case 'watering': return '💧';
      case 'fertilizer': return '🌱';
      case 'pest': return '🐛';
      case 'harvest': return '🌾';
      default: return '💡';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="entry-details-container">
          <div className="loading">Loading entry details...</div>
        </div>
      </MainLayout>
    );
  }

  if (!entry) {
    return (
      <MainLayout>
        <div className="entry-details-container">
          <div className="error">Entry not found</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="entry-details-container">
        {/* Navigation Header */}
        <div className="details-header">
          <button 
            className="nav-btn back-btn"
            onClick={() => navigate('/')}
          >
            ← Back to Dashboard
          </button>
          <h1>{entry.cropType} Entry Details</h1>
        </div>

        {/* Feedback Message */}
        {showFeedback && (
          <div className={`feedback ${showFeedback.type}`}>
            {showFeedback.message}
          </div>
        )}

        {/* Entry Information */}
        <section className="entry-info">
          <h2>Entry Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Crop Type</label>
              <p>{entry.cropType}</p>
            </div>
            <div className="info-item">
              <label>Location</label>
              <p>{entry.location}</p>
            </div>
            <div className="info-item">
              <label>Area</label>
              <p>{entry.area}</p>
            </div>
            <div className="info-item">
              <label>Planting Date</label>
              <p>{new Date(entry.plantingDate).toLocaleDateString()}</p>
            </div>
            <div className="info-item">
              <label>Expected Harvest</label>
              <p>{new Date(entry.expectedHarvest).toLocaleDateString()}</p>
            </div>
            <div className="info-item">
              <label>Status</label>
              <p className={`status ${entry.status.toLowerCase()}`}>{entry.status}</p>
            </div>
            <div className="info-item">
              <label>Soil Type</label>
              <p>{entry.soilType}</p>
            </div>
            <div className="info-item">
              <label>Irrigation</label>
              <p>{entry.irrigationType}</p>
            </div>
            <div className="info-item full-width">
              <label>Notes</label>
              <p>{entry.notes}</p>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="action-buttons">
          <button 
            className="action-btn edit-btn"
            onClick={handleEdit}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4-1 9.5-9.5z"/>
            </svg>
            Edit Entry
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={handleDelete}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
            </svg>
            Delete Entry
          </button>
        </section>

        {/* Weather Forecast */}
        {weatherData && (
          <section className="weather-section">
            <h2>Weather Forecast for {entry.location}</h2>
            <div className="current-weather">
              <div className="weather-main">
                <span className="weather-icon">{weatherData.current.icon}</span>
                <div className="weather-details">
                  <h3>{weatherData.current.temperature}°C</h3>
                  <p>{weatherData.current.description}</p>
                </div>
              </div>
              <div className="weather-stats">
                <div className="stat">
                  <span>💧</span>
                  <span>{weatherData.current.humidity}%</span>
                </div>
                <div className="stat">
                  <span>🌧️</span>
                  <span>{weatherData.current.precipitation}mm</span>
                </div>
                <div className="stat">
                  <span>💨</span>
                  <span>{weatherData.current.windSpeed}km/h</span>
                </div>
              </div>
            </div>
            <div className="forecast-grid">
              {weatherData.forecast.map((day, index) => (
                <div key={index} className="forecast-day">
                  <p className="day-name">{day.day}</p>
                  <span className="day-icon">{day.icon}</span>
                  <p className="temp-range">
                    {day.high}° / {day.low}°
                  </p>
                  <p className="precipitation">💧 {day.precipitation}%</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AI Tips Section */}
        <section className="ai-tips-section">
          <h2>AI-Generated Tips & Instructions</h2>
          <div className="tips-grid">
            {aiTips.map((tip) => (
              <div key={tip.id} className="tip-card" style={{ borderLeftColor: getPriorityColor(tip.priority) }}>
                <div className="tip-header">
                  <span className="tip-icon">{getPriorityIcon(tip.type)}</span>
                  <h3>{tip.title}</h3>
                  <span className="priority-badge" style={{ backgroundColor: getPriorityColor(tip.priority) }}>
                    {tip.priority}
                  </span>
                </div>
                <p className="tip-description">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Charts Section */}
        {chartData && (
          <section className="charts-section">
            <h2>Environmental Trends</h2>
            <div className="charts-grid">
              <div className="chart-container">
                <h3>Temperature Trend</h3>
                <div className="simple-chart">
                  {chartData.temperature.map((point, index) => (
                    <div key={index} className="chart-bar" style={{ height: `${(point.value / 30) * 100}%` }}>
                      <span className="chart-value">{point.value}°</span>
                    </div>
                  ))}
                </div>
                <div className="chart-labels">
                  {chartData.temperature.map((point, index) => (
                    <span key={index} className="chart-label">{point.date.split(' ')[1]}</span>
                  ))}
                </div>
              </div>
              
              <div className="chart-container">
                <h3>Humidity Trend</h3>
                <div className="simple-chart">
                  {chartData.humidity.map((point, index) => (
                    <div key={index} className="chart-bar humidity" style={{ height: `${point.value}%` }}>
                      <span className="chart-value">{point.value}%</span>
                    </div>
                  ))}
                </div>
                <div className="chart-labels">
                  {chartData.humidity.map((point, index) => (
                    <span key={index} className="chart-label">{point.date.split(' ')[1]}</span>
                  ))}
                </div>
              </div>
              
              <div className="chart-container">
                <h3>Precipitation Trend</h3>
                <div className="simple-chart">
                  {chartData.precipitation.map((point, index) => (
                    <div key={index} className="chart-bar precipitation" style={{ height: `${(point.value / 20) * 100}%` }}>
                      <span className="chart-value">{point.value}mm</span>
                    </div>
                  ))}
                </div>
                <div className="chart-labels">
                  {chartData.precipitation.map((point, index) => (
                    <span key={index} className="chart-label">{point.date.split(' ')[1]}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PDF Generation */}
        <section className="pdf-section">
          <button 
            className="generate-pdf-btn"
            onClick={generatePDF}
            disabled={pdfGenerating}
          >
            {pdfGenerating ? 'Generating PDF...' : '📄 Generate PDF Report'}
          </button>
        </section>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Edit Entry</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowEditModal(false)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="edit-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Crop Type</label>
                    <input
                      type="text"
                      name="cropType"
                      value={editFormData?.cropType || ''}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={editFormData?.location || ''}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Area</label>
                    <input
                      type="text"
                      name="area"
                      value={editFormData?.area || ''}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Planting Date</label>
                    <input
                      type="date"
                      name="plantingDate"
                      value={editFormData?.plantingDate || ''}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Expected Harvest</label>
                    <input
                      type="date"
                      name="expectedHarvest"
                      value={editFormData?.expectedHarvest || ''}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Soil Type</label>
                    <select
                      name="soilType"
                      value={editFormData?.soilType || ''}
                      onChange={handleEditChange}
                      required
                    >
                      <option value="">Select soil type</option>
                      <option value="Clay">Clay</option>
                      <option value="Sandy">Sandy</option>
                      <option value="Loamy">Loamy</option>
                      <option value="Silty">Silty</option>
                      <option value="Peaty">Peaty</option>
                      <option value="Chalky">Chalky</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Irrigation Type</label>
                    <select
                      name="irrigationType"
                      value={editFormData?.irrigationType || ''}
                      onChange={handleEditChange}
                      required
                    >
                      <option value="">Select irrigation type</option>
                      <option value="Drip irrigation">Drip irrigation</option>
                      <option value="Sprinkler">Sprinkler</option>
                      <option value="Flood irrigation">Flood irrigation</option>
                      <option value="Center pivot">Center pivot</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={editFormData?.status || ''}
                      onChange={handleEditChange}
                      required
                    >
                      <option value="">Select status</option>
                      <option value="Healthy">Healthy</option>
                      <option value="Warning">Warning</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Notes</label>
                    <textarea
                      name="notes"
                      value={editFormData?.notes || ''}
                      onChange={handleEditChange}
                      rows="4"
                      placeholder="Add any additional notes about this entry..."
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content delete-modal">
              <div className="modal-header">
                <h2>Delete Entry</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowDeleteModal(false)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="delete-content">
                <div className="delete-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                  </svg>
                </div>
                <h3>Are you sure?</h3>
                <p>This action cannot be undone. This will permanently delete the entry for <strong>{entry.cropType}</strong> at <strong>{entry.location}</strong>.</p>
                <div className="delete-details">
                  <p><strong>Crop:</strong> {entry.cropType}</p>
                  <p><strong>Location:</strong> {entry.location}</p>
                  <p><strong>Area:</strong> {entry.area}</p>
                  <p><strong>Planting Date:</strong> {new Date(entry.plantingDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button 
                  className="btn-danger"
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Entry'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default EntryDetails;
