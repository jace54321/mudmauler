import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile-page.css';

const PROFILE_STORAGE_KEY = 'userProfileData';

const ProfilePage = () => {
  const navigate = useNavigate();
  // Load from localStorage if available
  const getInitialProfile = () => {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    return stored
      ? JSON.parse(stored)
      : {
          firstName: 'Alexa',
          lastName: 'Rawle',
          email: 'alexarawles@gmail.com',
          address: '123 Sample Street, City, Country',
          contact: '+123 456 789',
          gender: ''
        };
  };

  const [profile, setProfile] = useState(getInitialProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  // Save to localStorage whenever profile changes
  useEffect(() => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const handleEdit = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDraft(profile);
  };

  const handleSave = () => {
    setProfile(draft);
    setIsEditing(false);
    // LocalStorage is auto-updated by useEffect
  };

  const handleChange = (field, value) => {
    setDraft({ ...draft, [field]: value });
  };

  const display = isEditing ? draft : profile;

  return (
    <div className="profile-outer" style={{ position: "relative" }}>
      <button
        className="back-arrow"
        onClick={() => navigate(-1)}
        aria-label="Back"
      >
        ←
      </button>
      <div className="profile-banner"></div>
      <div className="profile-main-card">
        <div className="profile-avatar-row">
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="profile"
            className="profile-avatar"
          />
          <div className="profile-name-email">
            <div className="profile-full-name">{display.firstName} {display.lastName}</div>
            <div className="profile-email">{display.email}</div>
          </div>
          {isEditing ? (
            <>
              <button className="edit-btn" onClick={handleSave}>Save</button>
              <button
                className="edit-btn"
                style={{ marginLeft: 10, background: "#ccc", color: "#333" }}
                onClick={handleCancel}
              >Cancel</button>
            </>
          ) : (
            <button className="edit-btn" onClick={handleEdit}>Edit</button>
          )}
        </div>
        <div className="profile-details-grid">
          <div className="profile-detail-field">
            <label>First Name</label>
            <input
              type="text"
              value={display.firstName}
              onChange={e => handleChange('firstName', e.target.value)}
              disabled={!isEditing}
              placeholder="First Name"
            />
          </div>
          <div className="profile-detail-field">
            <label>Last Name</label>
            <input
              type="text"
              value={display.lastName}
              onChange={e => handleChange('lastName', e.target.value)}
              disabled={!isEditing}
              placeholder="Last Name"
            />
          </div>
          <div className="profile-detail-field">
            <label>Address</label>
            <input
              type="text"
              value={display.address}
              onChange={e => handleChange('address', e.target.value)}
              disabled={!isEditing}
              placeholder="Address"
            />
          </div>
          <div className="profile-detail-field">
            <label>Phone Number</label>
            <input
              type="text"
              value={display.contact}
              onChange={e => handleChange('contact', e.target.value)}
              disabled={!isEditing}
              placeholder="Phone Number"
            />
          </div>
          <div className="profile-detail-field">
            <label>Email Address</label>
            <input
              type="text"
              value={display.email}
              onChange={e => handleChange('email', e.target.value)}
              disabled={!isEditing}
              placeholder="Email Address"
            />
          </div>
          <div className="profile-detail-field">
            <label>Gender</label>
            <input
              type="text"
              value={display.gender}
              onChange={e => handleChange('gender', e.target.value)}
              disabled={!isEditing}
              placeholder="Gender"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
