import React from 'react';

interface PlantCardProps {
    id: string  ;
  lastUpdate: string;
  isWatering: boolean;
  plantType: string;
}
const PlantCard: React.FC<PlantCardProps> = ({ id,lastUpdate, isWatering, plantType }) => {
    let formattedDate: string;
  
    if (typeof lastUpdate === 'number') {
      formattedDate = new Date(lastUpdate).toLocaleString();
    } else {
      formattedDate = lastUpdate;
    }
  
    return (
      <div className="plant-card text-center">
        <h2>Plant {id}</h2> 
        <div className="plant-info">
          <p><strong>Last Update:</strong> {formattedDate}</p>
          <p><strong>Status:</strong> <strong style={{ color: isWatering ? "green" : "red", fontSize: "15px" }}>
          {isWatering ? "Watering" : "Not Watering"} </strong> </p>
          <p><strong>Type:</strong> {plantType}</p>
        </div>
      </div>
    );
  };
  
  export default PlantCard; 