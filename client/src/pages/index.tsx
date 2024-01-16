import { FileRoute } from "@tanstack/react-router";
import { UnstyledButton, Code, List, Title, Text, Space } from "@mantine/core";

import styles from "~/styles/index.module.css";

export const Route = new FileRoute("/").createRoute({
	component: Page,
});

export function Page() {
	return (
		<>
			<Title my="md" order={1}>
				<Text variant="gradient" inherit>
					IoT Smart Campus
				</Text>
			</Title>
			<Text>
				This is the website for the IoT Smart Campus project. The
				project is part of courses{" "}
				<Code>ECE491 - Graduation Project I</Code> and{" "}
				<Code>ECE492 - Graduation Project II</Code> at Faculty of
				Engineering, Ain Shams University.
			</Text>
			<Title my="md" order={2} c={"primary"}>
				Project Description
			</Title>
			<Text>
				The project aims to build a smart campus that can be used to
				monitor the campus and provide useful information to the
				students and staff. The project is divided into three main
				parts:
			</Text>
			<List>
				<List.Item>Embedded</List.Item>
				<List.Item>Image Processing</List.Item>
				<List.Item>Server</List.Item>
			</List>
			<Title my="md" order={3} c={"primary"}>
				Embedded
			</Title>
			<Text>
				The embedded part is responsible for collecting data from the
				sensors and sending it to the server. The embedded part is built
				using Arduino and ESP8266.
			</Text>
			<Title my="md" order={3} c={"primary"}>
				Image Processing
			</Title>
			<Text>
				The image processing part is responsible for processing the
				images received from the server and detecting the number of
				people in the image. The image processing part is built using
				Python and OpenCV.
			</Text>
			<Title my="md" order={3} c={"primary"}>
				Server
			</Title>
			<Text>
				The server is responsible for receiving data from the embedded
				part and storing it in a database. The server is also
				responsible for providing the data to the image processing part
				and the web/mobile application.
			</Text>
			<Title my="md" order={2} c={"primary"}>
				Contributors
			</Title>
			<Title my="md" order={3} c={"primary"}>
				Embedded Team
			</Title>
			<List>
				<List.Item>
					<UnstyledButton
						component="a"
						href="#"
						target="__blank"
						rel="noopener noreferer"
						className={styles.teamButton}
					>
						Mohamed Sayed Farouk
					</UnstyledButton>
				</List.Item>
				<List.Item>
					<UnstyledButton
						component="a"
						href="#"
						target="__blank"
						rel="noopener noreferer"
						className={styles.teamButton}
					>
						Raghda Agmed Ahmed
					</UnstyledButton>
				</List.Item>
				<List.Item>
					<UnstyledButton
						component="a"
						href="#"
						target="__blank"
						rel="noopener noreferer"
						className={styles.teamButton}
					>
						Salah Adel Mohamed
					</UnstyledButton>
				</List.Item>
			</List>
			<Title my="md" order={3} c={"primary"}>
				Image Processing Team
			</Title>
			<List>
				<List.Item>
					<UnstyledButton
						component="a"
						href="#"
						target="__blank"
						rel="noopener noreferer"
						className={styles.teamButton}
					>
						Eslam Mohamed Hekal
					</UnstyledButton>
				</List.Item>
				<List.Item>
					<UnstyledButton
						component="a"
						href="#"
						target="__blank"
						rel="noopener noreferer"
						className={styles.teamButton}
					>
						Kareem Youssry Abdelaziz
					</UnstyledButton>
				</List.Item>
				<List.Item>
					<UnstyledButton
						component="a"
						href="#"
						target="__blank"
						rel="noopener noreferer"
						className={styles.teamButton}
					>
						Omar Gamal Abdelghaffar
					</UnstyledButton>
				</List.Item>
			</List>
			<Title my="md" order={3} c={"primary"}>
				Server Team
			</Title>
			<List>
				<List.Item>
					<UnstyledButton
						component="a"
						href="https://github.com/Kariem816"
						target="__blank"
						rel="noopener noreferer"
						className={styles.teamButton}
					>
						Kareem Mostafa ElSawah
					</UnstyledButton>
				</List.Item>
				<List.Item>
					<UnstyledButton
						component="a"
						href="#"
						target="__blank"
						rel="noopener noreferer"
						className={styles.teamButton}
					>
						Mostafa Sabry Sayed
					</UnstyledButton>
				</List.Item>
				<List.Item>
					<UnstyledButton
						component="a"
						href="#"
						target="__blank"
						rel="noopener noreferer"
						className={styles.teamButton}
					>
						Youssef Mohammed Ibrahim
					</UnstyledButton>
				</List.Item>
			</List>
			<Title my="md" order={2} c={"primary"}>
				Supervisor
			</Title>
			<UnstyledButton
				component="a"
				href="https://eng.asu.edu.eg/staff/helsayed"
				target="_blank"
				rel="noopener noreferrer"
				className={styles.teamButton}
			>
				Prof. Dr. Hussein A. Elsayed
			</UnstyledButton>
			<Space h="xl" />
		</>
	);
}
