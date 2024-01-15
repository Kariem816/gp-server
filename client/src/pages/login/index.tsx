import React from "react";
import { FileRoute } from "@tanstack/react-router";

export const Route = new FileRoute("/login/").createRoute({
	component: LoginPage,
});

function LoginPage() {
	return (
		<div className="card">
			<div className="card-body">
				<h1 className="card-title">Login</h1>
				<form>
					<div className="mb-3">
						<label
							htmlFor="exampleInputEmail1"
							className="form-label"
						>
							Email address
						</label>
						<input
							type="email"
							className="form-control"
							id="exampleInputEmail1"
							aria-describedby="emailHelp"
						/>
						<div id="emailHelp" className="form-text">
							We'll never share your email with anyone else.
						</div>
					</div>
					<div className="mb-3">
						<label
							htmlFor="exampleInputPassword1"
							className="form-label"
						>
							Password
						</label>
						<input
							type="password"
							className="form-control"
							id="exampleInputPassword1"
						/>
					</div>
					<div className="mb-3 form-check">
						<input
							type="checkbox"
							className="form-check-input"
							id="exampleCheck1"
						/>
						<label
							className="form-check-label"
							htmlFor="exampleCheck1"
						>
							Remember me
						</label>
					</div>
					<button type="submit" className="btn btn-primary">
						Submit
					</button>
				</form>
			</div>
		</div>
	);
}
