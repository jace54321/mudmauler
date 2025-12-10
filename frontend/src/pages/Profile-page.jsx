import React, { useState, useRef, useEffect } from "react";
import "../styles/Profile-page.css";

const ProfilePage = () => {
  const fileRef = useRef();

  // Load from localStorage initially
  const [profile, setProfile] = useState({
    firstName: localStorage.getItem("userFirst") || "",
    lastName: localStorage.getItem("userLast") || "",
    email: localStorage.getItem("userEmail") || "",
    phone: localStorage.getItem("userPhone") || "",
    address: localStorage.getItem("userAddress") || "",
    avatar: localStorage.getItem("userAvatar") || ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch profile from backend on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/profile', {
          headers: {
            'Session-Id': sessionId
          }
        });

        if (response.ok) {
          const userData = await response.json();
          const updatedProfile = {
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
            avatar: localStorage.getItem("userAvatar") || ""
          };
          setProfile(updatedProfile);
          setDraft(updatedProfile);
          
          // Update localStorage
          localStorage.setItem("userFirst", updatedProfile.firstName);
          localStorage.setItem("userLast", updatedProfile.lastName);
          localStorage.setItem("userEmail", updatedProfile.email);
          localStorage.setItem("userPhone", updatedProfile.phone);
          localStorage.setItem("userAddress", updatedProfile.address);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const image = reader.result;

      // Update draft immediately
      setDraft((prev) => ({ ...prev, avatar: image }));

      // Store avatar permanently
      localStorage.setItem("userAvatar", image);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      setError("Please log in to update your profile");
      return;
    }

    setError("");
    setIsEditing(false);

    try {
      const response = await fetch('http://localhost:8080/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Session-Id': sessionId
        },
        body: JSON.stringify({
          firstName: draft.firstName,
          lastName: draft.lastName,
          email: draft.email,
          phone: draft.phone,
          address: draft.address
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        const updatedProfile = {
          ...draft,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address
        };
        setProfile(updatedProfile);

        // Update localStorage
        localStorage.setItem("userFirst", updatedProfile.firstName);
        localStorage.setItem("userLast", updatedProfile.lastName);
        localStorage.setItem("userEmail", updatedProfile.email);
        localStorage.setItem("userPhone", updatedProfile.phone);
        localStorage.setItem("userAddress", updatedProfile.address);
        localStorage.setItem("userAvatar", draft.avatar);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update profile");
        setIsEditing(true); // Re-enable editing on error
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error connecting to server");
      setIsEditing(true); // Re-enable editing on error
    }
  };

  const handleCancel = () => {
    setDraft(profile);   // Revert changes
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="profile-outer">
        <div className="profile-main-card">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-outer">
      <div className="profile-main-card">
        {error && (
          <div style={{ color: 'red', padding: '10px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <div className="profile-avatar-row">

          {/* Avatar */}
          <div className="profile-avatar-wrapper">
            <img
              src={
                draft.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              className="profile-avatar"
              alt="avatar"
            />

            {isEditing && (
              <button
                className="avatar-upload-btn"
                onClick={() => fileRef.current.click()}
              >
                Change Photo
              </button>
            )}

            <input
              type="file"
              ref={fileRef}
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name + Email */}
          <div className="profile-name-email">
            <div className="profile-full-name">
              {draft.firstName} {draft.lastName}
            </div>
            <div className="profile-email">{draft.email}</div>
          </div>

          {/* SAVE + CANCEL BUTTONS */}
          {!isEditing ? (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          ) : (
            <div className="edit-buttons-column">
              <button className="edit-btn save-btn" onClick={handleSave}>
                Save
              </button>

              <button className="edit-btn cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* FORM FIELDS */}
        <div className="profile-details-grid">

          <div className="profile-detail-field">
            <label>First Name</label>
            <input
              disabled={!isEditing}
              value={draft.firstName}
              onChange={(e) =>
                setDraft({ ...draft, firstName: e.target.value })
              }
            />
          </div>

          <div className="profile-detail-field">
            <label>Last Name</label>
            <input
              disabled={!isEditing}
              value={draft.lastName}
              onChange={(e) =>
                setDraft({ ...draft, lastName: e.target.value })
              }
            />
          </div>

          <div className="profile-detail-field">
            <label>Email Address</label>
            <input
              disabled={!isEditing}
              value={draft.email}
              onChange={(e) =>
                setDraft({ ...draft, email: e.target.value })
              }
            />
          </div>

          <div className="profile-detail-field">
            <label>Phone Number</label>
            <input
              disabled={!isEditing}
              value={draft.phone}
              onChange={(e) =>
                setDraft({ ...draft, phone: e.target.value })
              }
            />
          </div>

          <div className="profile-detail-field full-width">
            <label>Address</label>
            <input
              disabled={!isEditing}
              value={draft.address}
              onChange={(e) =>
                setDraft({ ...draft, address: e.target.value })
              }
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;