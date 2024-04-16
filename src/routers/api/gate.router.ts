// import { Router } from "express";
// import parkingstore from "@/models/parking.model"; 
// import { formatError, formatResponse } from "@/helpers";

// async function checkAndOpenGate() {
//     try {
        
//         const emptySpots = await parkingstore.countEmpty();

//         if (emptySpots > 0) {
         
//             console.log("Sending signal to open gate for an empty parking spot...");
//         } else {
//             console.log("All parking spots are occupied.");
//         }
//     } catch (err) {
// 		const { status, error } = formatError(err);
// 		res.status(status).json(error);
// 	}
// }


// checkAndOpenGate();
