import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/")({
	component: Page,
});

export function Page() {
	return (
		<div className="container">
			<h1 className="bg-gradient-to-r from-primary to-red-400 inline-block text-transparent bg-clip-text">
				IoT Smart Campus
			</h1>
			<p>
				This is the website for the IoT Smart Campus project. The
				project is part of courses{" "}
				<code>ECE491 - Graduation Project I</code> and{" "}
				<code>ECE492 - Graduation Project II</code> at Faculty of
				Engineering, Ain Shams University.
			</p>
			<h2>Project Description</h2>
			<p>
				The project aims to build a smart campus that can be used to
				monitor the campus and provide useful information to the
				students and staff. The project is divided into three main
				parts:
			</p>
			<ul className="list-inside list-disc my-2">
				<li>Embedded</li>
				<li>Image Processing</li>
				<li>Server</li>
			</ul>
			<h3>Embedded</h3>
			<p>
				The embedded part is responsible for collecting data from the
				sensors and sending it to the server. The embedded part is built
				using Arduino and ESP8266.
			</p>
			<h3>Image Processing</h3>
			<p>
				The image processing part is responsible for processing the
				images received from the server and detecting the number of
				people in the image. The image processing part is built using
				Python and OpenCV.
			</p>
			<h3>Server</h3>
			<p>
				The server is responsible for receiving data from the embedded
				part and storing it in a database. The server is also
				responsible for providing the data to the image processing part
				and the web/mobile application.
			</p>
			<h2>Contributors</h2>
			<h3>Embedded Team</h3>
			<ul className="list-inside list-disc my-2">
				<li>
					<a href="#">Mohamed Sayed Farouk</a>
				</li>
				<li>
					<a href="#">Raghda Ahmed Ahmed</a>
				</li>
				<li>
					<a href="#">Salah Adel Mohamed</a>
				</li>
			</ul>
			<h3>Image Processing Team</h3>
			<ul className="list-inside list-disc my-2">
				<li>
					<a href="#">Eslam Mohamed Hekal</a>
				</li>
				<li>
					<a
						href="https://linkedin.com/in/kareem-youssry/"
						target="__blank"
						rel="noopener noreferer"
					>
						Kareem Youssry Abdelaziz
					</a>
				</li>
				<li>
					<a href="#">Omar Gamal Abdelghaffar</a>
				</li>
			</ul>
			<h3>Server Team</h3>
			<ul className="list-inside list-disc my-2">
				<li>
					<a
						href="https://github.com/Kariem816"
						target="__blank"
						rel="noopener noreferer"
					>
						Kareem Mostafa ElSawah
					</a>
				</li>
				<li>
					<a href="#">Mostafa Sabry Sayed</a>
				</li>
				<li>
					<a href="#">Youssef Mohammed Ibrahim</a>
				</li>
			</ul>
			<h2>Supervisor</h2>
			<a
				href="https://eng.asu.edu.eg/staff/helsayed"
				target="_blank"
				rel="noopener noreferrer"
			>
				Prof. Dr. Hussein A. Elsayed
			</a>
			<div className="h-8" />
		</div>
	);
}
