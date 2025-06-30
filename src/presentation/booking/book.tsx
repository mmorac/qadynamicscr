import React, { useState } from "react";
import "./book.css";
import { bookTime } from "../../calendar_access/graphService";

const Booking: React.FC = () => {
    const [email, setEmail] = useState(() => sessionStorage.getItem('email') || "");
    const [lastName, setLastName] = useState(() => sessionStorage.getItem('lastName') || "");
    const [firstName, setFirstName] = useState(() => sessionStorage.getItem('firstName') || "");
    const [idNumber, setIdNumber] = useState(() => sessionStorage.getItem('idNumber') || "");
    const [telephoneNumber, setTelephoneNumber] = useState(() => sessionStorage.getItem('telephoneNumber') || "");
    const [company, setCompany] = useState(() => sessionStorage.getItem('company') || "");
    const [position, setPosition] = useState(() => sessionStorage.getItem('position') || "");
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
                    Last Name:
                    <input
                        type="text"
                        value={lastName}
                        onChange={e => {
                            setLastName(e.target.value);
                            sessionStorage.setItem('lastName', e.target.value);
                        }}
                        className="booking-input"
                        placeholder="Enter your last name"
                    />
                </label>
            </div>
            <div className="booking-label">
                <label>
                    Name:
                    <input
                        type="text"
                        value={firstName}
                        onChange={e => {
                            setFirstName(e.target.value);
                            sessionStorage.setItem('firstName', e.target.value);
                        }}
                        className="booking-input"
                        placeholder="Enter your first name"
                    />
                </label>
            </div>
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
            <div className="booking-label">
                <label>
                    ID Number:
                    <input
                        type="text"
                        value={idNumber}
                        onChange={e => {
                            setIdNumber(e.target.value);
                            sessionStorage.setItem('idNumber', e.target.value);
                        }}
                        className="booking-input"
                        placeholder="Enter your ID number"
                    />
                </label>
            </div>
            <div className="booking-label">
                <label>
                    Telephone Number:
                    <input
                        type="number"
                        value={telephoneNumber}
                        onChange={e => {
                            setTelephoneNumber(e.target.value);
                            sessionStorage.setItem('telephoneNumber', e.target.value);
                        }}
                        className="booking-input"
                        placeholder="Enter your telephone number"
                    />
                </label>
            </div>
            <div className="booking-label">
                <label>
                    Company:
                    <input
                        type="text"
                        value={company}
                        onChange={e => {
                            setCompany(e.target.value);
                            sessionStorage.setItem('company', e.target.value);
                        }}
                        className="booking-input"
                        placeholder="Company Name:"
                    />
                </label>
            </div>
            <div className="booking-label">
                <label>
                    Position:
                    <input
                        type="text"
                        value={position}
                        onChange={e => {
                            setPosition(e.target.value);
                            sessionStorage.setItem('position', e.target.value);
                        }}
                        className="booking-input"
                        placeholder="Position:"
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
                        const result = `${mm}-${dd}-${yyyy}`;
                        return result;
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
                        bookTime(sessionStorage.getItem('email') || '', 
                    sessionStorage.getItem('lastName') || '',
                    sessionStorage.getItem('firstName') || '',
                    sessionStorage.getItem('idNumber') || '',
                    sessionStorage.getItem('telephoneNumber') || '',
                    sessionStorage.getItem('company') || '',
                    sessionStorage.getItem('position') || '')
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