import express from "express";
import { env } from "@/config/env.js";
// @ts-ignore
import partials from "express-partials";
import cookieParser from "cookie-parser";

import appRouter from "@/routers/index.router.js";
import { getUser } from "@/middlewares";

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
// frontend lines will be removed later
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "src/views");
app.use(partials());

app.use(getUser);
app.use(appRouter);

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
