import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";

import { env } from "@/config/env";

import appRouter from "@/routers/index.router";
// import { getUser, logger } from "@/middlewares";
// import { rateLimiter } from "./middlewares/rate";

const app = express();
const port = env.PORT || 3000;

// app.use(express.json());
// //@ts-ignore
// app.use((error, _req, res, next) => {
// 	if (error instanceof SyntaxError) {
// 		res.status(400).json({
// 			error: "BAD_REQUEST",
// 			message: "Invalid payload",
// 		});
// 	} else {
// 		next();
// 	}
// });
// app.use(cookieParser());
// if (env.NODE_ENV === "development") {
// 	app.use(
// 		cors({
// 			origin: env.CLIENT_DEV_SERVER,
// 			credentials: true,
// 		})
// 	);
// }

// app.use(
// 	logger({ debugOnly: true, fields: ["method", "path", "query", "body"] })
// );

// app.use(getUser);
// app.use(rateLimiter);
app.use(appRouter);

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
