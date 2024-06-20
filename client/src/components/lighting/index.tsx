import React from 'react';

interface LightingCardProps {
  id: string;
  state: boolean;
  location: string;
}

const LightingCard: React.FC<LightingCardProps> = ({ id, state, location }) => {
  return (
    <div className="lighting-card">
      <h2>Lighting {id}</h2>
      <div className="lighting-info">
        <p><strong>Location:</strong> {location}</p>
        <p><strong>State:</strong> <strong style={{ color: state ? "green" : "red" , fontSize: "15px" }}>{state ? "On" : "Off"} </strong></p>
      </div>
    </div>
  );
};

export default LightingCard;
