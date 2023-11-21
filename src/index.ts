import express from "express";
// import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "@/config/env.js";

// @ts-ignore
import partials from "express-partials";

import appRouter from "@/routers/index.router.js";
import { getUser } from "@/middlewares";

const app = express();
const port = env.PORT || 3000;

app.use(async (req, res, next) => {
	console.log("============================== New Request ============================");
	console.log("Url:", req.url);
	console.log("User Agent:", req.headers["user-agent"]);
	console.log("=======================================================================");
	//await new Promise(res => setTimeout(res, 3000));
	next();
})
// app.use(cors());
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
