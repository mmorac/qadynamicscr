import React, { useState } from "react";
import "./book.css";
import { bookTime } from "../../calendar_access/graphService";

const Booking: React.FC = () => {
    const [email, setEmail] = useState(() => sessionStorage.getItem('email') || "");
    const selectedHour = sessionStorage.getItem("selectedHour") || "";
    const endTime = (() => {
        const [hour, minute] = selectedHour.split(":");
        if (!hour) return "";
        const newHour = String(Number(hour) + 1).padStart(2, "0");
        return `${newHour}:${minute || "00"}`;
    })();
    sessionStorage.setItem("selectedEndTime", endTime);
    return (
        <div className="booking-container">
            <h2>Booking Details</h2>
            <div className="booking-label">
                <label>
                    Email Address:
                    <input
                        type="email"
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value);
                            sessionStorage.setItem('email', e.target.value);
                        }}
                        className="booking-input"
                        placeholder="Enter your email"
                    />
                </label>
            </div>
            <div className="booking-detail">
                <strong>Date:</strong> {
                    (() => {
                        const dateStr = sessionStorage.getItem("selectedDate");
                        if (!dateStr) return "Not selected";
                        const date = new Date(dateStr);
                        if (isNaN(date.getTime())) return "Not selected";
                        const mm = String(date.getMonth() + 1).padStart(2, "0");
                        const dd = String(date.getDate()).padStart(2, "0");
                        const yyyy = date.getFullYear();
                        return `${mm}-${dd}-${yyyy}`;
                    })()
                }
            </div>
            <div className="booking-detail">
                <strong>Start Time:</strong> {sessionStorage.getItem("selectedHour") || "Not selected"}
            </div>
            <div className="booking-detail">
                <strong>End Time:</strong> {sessionStorage.getItem("selectedEndTime") || "Not selected"}
            </div>
            <div className="booking-actions">
                <button
                    className="booking-button"
                    onClick={() => {
                        // Here you would typically handle the booking logic, e.g., sending the data to a server
                        bookTime(sessionStorage.getItem('email') || '')
                    }}
                >
                    Confirm Booking
                </button>
                </div>
        </div>
    );
};

export default Booking;
export {};