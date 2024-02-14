import express from "express";
import cookieParser from "cookie-parser";

import { env } from "@/config/env";

import appRouter from "@/routers/index.router";
import { getUser, logger } from "@/middlewares/index";

const app = express();
const port = env.PORT || 3000;

app.use(express.json());
//@ts-ignore
app.use((error, _req, res, next) => {
	if (error instanceof SyntaxError) {
		res.status(400).json({
			error: "BAD_REQUEST",
			message: "Invalid payload",
		});
	} else {
		next();
	}
});
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
	logger({ debugOnly: true, fields: ["method", "path", "query", "body"] })
);

app.use(getUser);
app.use(appRouter);

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
