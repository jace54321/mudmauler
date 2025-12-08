import React, { useState, useRef } from "react";
import "../styles/Profile-page.css";

const ProfilePage = () => {
  const fileRef = useRef();

  // Load from localStorage
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

  const handleSave = () => {
    setProfile(draft);

    // Save everything to localStorage
    localStorage.setItem("userFirst", draft.firstName);
    localStorage.setItem("userLast", draft.lastName);
    localStorage.setItem("userEmail", draft.email);
    localStorage.setItem("userPhone", draft.phone);
    localStorage.setItem("userAddress", draft.address);
    localStorage.setItem("userAvatar", draft.avatar);

    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(profile);   // Revert changes
    setIsEditing(false);
  };

  return (
    <div className="profile-outer">
      <div className="profile-main-card">

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
