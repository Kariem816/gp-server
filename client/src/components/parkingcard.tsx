import React from 'react';

interface ParkingSpotCardProps {
  id: number;
  isEmpty: boolean;
  location: string;
}

const ParkingSpotCard: React.FC<ParkingSpotCardProps> = ({ id, isEmpty, location }) => {
  return (
    <div className="parking-spot-card">
      <h2>Parking Spot {id}</h2>
      <div className="parking-spot-info">
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Status:</strong> {isEmpty ? "Empty" : "Occupied"}</p>
      </div>
    </div>
  );
};

export default ParkingSpotCard;