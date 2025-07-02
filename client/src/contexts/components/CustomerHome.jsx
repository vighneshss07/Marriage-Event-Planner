import React from 'react';
import { Link } from 'react-router-dom';
import EventBooking from './EventBooking'; 
import BookedEvents from './BookedEvents';
import Feedback from './Feedback'; 

const CustomerHome = () => {
  return (
    <div className="customer-home-container">
      <h1>Welcome to the Customer Home Page!</h1>
      <p>This is the home page for customers. Customize it as needed.</p>

      <div className="customer-actions">
        <Link to="/customer/profile">View Profile</Link>
        <Link to="/customer/orders">View Orders</Link>
        {/* Add more links for customer actions */}
      </div>
      <div className="customer-modules">
        <EventBooking />
        <BookedEvents />
        <Feedback />
      </div>
    </div>
  );
};

export default CustomerHome;
