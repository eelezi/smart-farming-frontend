import React, { useState, useEffect } from "react";
import MainLayout from "../components/Layout/MainLayout";
import "../styles/profile.css";

function MyProfile() {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  //  API call to fetch user profile data

  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     try {
  //       const response = await fetch('/api/user/profile', {
  //         headers: {
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //           'Content-Type': 'application/json'
  //         }
  //       });
  //       if (response.ok) {
  //         const data = await response.json();
  //         setUserData(data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user profile:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchUserProfile();
  // }, []);

  
  // Mock user data
  const mockUserData = {
    // User personal information - from /api/user/profile
    name: "John Farmer",
    email: "john.farmer@example.com",
    phone: "+389 70 123 456",
    location: "Skopje, North Macedonia",
    joinDate: "January 2024",
    

    notifications: true,
    language: "en",
    timezone: "Europe/Skopje"
  };

  // Initialize with mock data
  useEffect(() => {
    setUserData(mockUserData);
    setLoading(false);
  }, []);

  //   API call to fetch FAQ data

  // const [faqData, setFaqData] = useState([]);
  // useEffect(() => {
  //   const fetchFAQ = async () => {
  //     try {
  //       const response = await fetch('/api/faq', {
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       });
  //       if (response.ok) {
  //         const faq = await response.json();
  //         setFaqData(faq);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching FAQ:', error);
  //     }
  //   };
  //   fetchFAQ();
  // }, []);

  const faqData = [
    {
      id: 1,
      question: "How do I add a new farm entry?",
      answer: "To add a new farm entry, click on the 'Add Entry' button in the bottom navigation. Fill in all the required information about your crop including location, area, planting date, and other details. Click 'Save' to store the entry."
    },
    {
      id: 2,
      question: "How does the camera feature work?",
      answer: "The camera feature allows you to take photos of your crops for analysis. Simply navigate to the Camera section, take a photo of your plant, and the AI will provide insights about potential issues or growth status."
    },
    {
      id: 3,
      question: "Can I edit or delete existing entries?",
      answer: "Yes! On the Dashboard, you can view all your entries. Click on any entry to see details, where you'll find options to edit or delete the entry. Make sure to save changes after editing."
    },
    {
      id: 4,
      question: "How are the AI tips generated?",
      answer: "AI tips are generated based on your crop data, weather conditions, soil type, and best agricultural practices. The system analyzes your entries to provide personalized recommendations for better yield and crop health."
    },
    {
      id: 5,
      question: "Is my data secure?",
      answer: "Yes, all your farm data is encrypted and stored securely. Only you have access to your personal information and farm entries. We follow strict data protection protocols to ensure your privacy."
    },
    {
      id: 6,
      question: "How do I update my profile information?",
      answer: "Currently, profile information is managed through your account settings. Future updates will allow direct editing of profile details from this page."
    },
    {
      id: 7,
      question: "What crops are supported?",
      answer: "The app supports a wide variety of crops including grains (wheat, corn, barley), vegetables (tomatoes, peppers, cucumbers), fruits, and specialty crops. You can add any crop type when creating entries."
    },
    {
      id: 8,
      question: "How accurate are the AI recommendations?",
      answer: "Our AI recommendations are based on agricultural research and real-world data. While highly accurate, always consider local conditions and consult with agricultural experts when making important decisions."
    }
  ];

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  // TODO: Add loading spinner component
  if (loading) {
    return (
      <MainLayout>
        <div className="profile-container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Loading profile data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // TODO: Add error handling for API failures
  if (!userData) {
    return (
      <MainLayout>
        <div className="profile-container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Failed to load profile data. Please try again.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <div className="profile-avatar">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>

        <div className="profile-content">
          <section className="profile-info">
            <h2>Personal Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Name</label>
                <p>{userData.name}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{userData.email}</p>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{userData.phone}</p>
              </div>
              <div className="info-item">
                <label>Location</label>
                <p>{userData.location}</p>
              </div>
              <div className="info-item">
                <label>Member Since</label>
                <p>{userData.joinDate}</p>
              </div>
            </div>
          </section>

          
          <section className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-container">
              {faqData.map((faq) => (
                <div key={faq.id} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <span>{faq.question}</span>
                    <span className={`faq-toggle ${expandedFAQ === faq.id ? 'expanded' : ''}`}>
                      {expandedFAQ === faq.id ? '−' : '+'}
                    </span>
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

export default MyProfile;
