import React from "react";

interface ParkingSpotCardProps {
	id: string;
	isEmpty: boolean;
	location: string;
	isSmart: boolean;
}
const ParkingSpotCard: React.FC<ParkingSpotCardProps> = ({
	id,
	isEmpty,
	location,
	isSmart,
}) => {
	return (
		<div className="parking-spot-card">
			<h2>Parking Spot {id}</h2>
			<div className="parking-spot-info">
				<p>
					<strong>Location: </strong> {location}
				</p>
				<p>
					<strong>Status: </strong>
					<strong
						style={{
							color: isEmpty ? "green" : "red",
							fontSize: "15px",
						}}
					>
						{isEmpty ? "Empty" : "Occupied"}
					</strong>
				</p>
				<p>
					<strong>Smart: </strong>
					<strong
						style={{
							color: isSmart ? "green" : "red",
							fontSize: "15px",
						}}
					>
						{isSmart ? "Yes" : "No"}
					</strong>
				</p>
			</div>
		</div>
	);
};

export default ParkingSpotCard;
