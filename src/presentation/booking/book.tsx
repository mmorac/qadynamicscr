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
    const sessionType = sessionStorage.getItem('sessionType') || 'hour';
    const endTime = (() => {
        const [hour, minute] = selectedHour.split(":");
        if (!hour) return "";
        let endHour = Number(hour);
        let endMinute = Number(minute || "0");
        if (sessionType === 'half-hour') {
            endMinute += 30;
            if (endMinute >= 60) {
                endHour += 1;
                endMinute -= 60;
            }
        } else {
            endHour += 1;
        }
        return `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
    })();
    sessionStorage.setItem("selectedEndTime", endTime);
    return (
        <div className="booking-container">
            <div className="home-fb-card expertise-card" style={{ maxWidth: 500, margin: '40px auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 style={{ textAlign: 'center' }}>Booking Details</h2>
                <div className="booking-label" style={{ width: '100%' }}>
                    <label style={{ width: '100%' }}>
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
                            style={{ width: '100%' }}
                        />
                    </label>
                </div>
                <div className="booking-label" style={{ width: '100%' }}>
                    <label style={{ width: '100%' }}>
                        First Name:
                        <input
                            type="text"
                            value={firstName}
                            onChange={e => {
                                setFirstName(e.target.value);
                                sessionStorage.setItem('firstName', e.target.value);
                            }}
                            className="booking-input"
                            placeholder="Enter your first name"
                            style={{ width: '100%' }}
                        />
                    </label>
                </div>
                <div className="booking-label" style={{ width: '100%' }}>
                    <label style={{ width: '100%' }}>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value);
                                sessionStorage.setItem('email', e.target.value);
                            }}
                            className="booking-input"
                            placeholder="Enter your email"
                            style={{ width: '100%' }}
                        />
                    </label>
                </div>
                <div className="booking-label" style={{ width: '100%' }}>
                    <label style={{ width: '100%' }}>
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
                            style={{ width: '100%' }}
                        />
                    </label>
                </div>
                <div className="booking-label" style={{ width: '100%' }}>
                    <label style={{ width: '100%' }}>
                        Phone Number:
                        <input
                            type="text"
                            value={telephoneNumber}
                            onChange={e => {
                                setTelephoneNumber(e.target.value);
                                sessionStorage.setItem('telephoneNumber', e.target.value);
                            }}
                            className="booking-input"
                            placeholder="Enter your telephone number"
                            style={{ width: '100%' }}
                        />
                    </label>
                </div>
                <div className="booking-label" style={{ width: '100%' }}>
                    <label style={{ width: '100%' }}>
                        Company:
                        <input
                            type="text"
                            value={company}
                            onChange={e => {
                                setCompany(e.target.value);
                                sessionStorage.setItem('company', e.target.value);
                            }}
                            className="booking-input"
                            placeholder="Enter your company"
                            style={{ width: '100%' }}
                        />
                    </label>
                </div>
                <div className="booking-label" style={{ width: '100%' }}>
                    <label style={{ width: '100%' }}>
                        Position:
                        <input
                            type="text"
                            value={position}
                            onChange={e => {
                                setPosition(e.target.value);
                                sessionStorage.setItem('position', e.target.value);
                            }}
                            className="booking-input"
                            placeholder="Enter your position"
                            style={{ width: '100%' }}
                        />
                    </label>
                </div>
                <div className="booking-detail" style={{ width: '100%', marginTop: 16 }}>
                    <strong>Selected Date:</strong> {sessionStorage.getItem('selectedDate') ? new Date(sessionStorage.getItem('selectedDate')!).toLocaleDateString('en-US') : 'None'}<br />
                    <strong>Session starts:</strong> {selectedHour}<br />
                    <strong>Session ends:</strong> {sessionStorage.getItem('selectedEndTime') || ''}
                </div>
                <button className="booking-button" style={{ marginTop: 24, width: '100%' }} onClick={() => bookTime(email, lastName, firstName, idNumber, telephoneNumber, company, position)}>
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default Booking;