import { Link, createFileRoute } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useTranslation } from "~/contexts/translation";

export const Route = createFileRoute("/")({
	component: Page,
});

const teams = [
	{
		Icon: <PocketIcon className="size-8 text-primary" />,
		title: "t_embedded",
		members: [
			{
				name: "AG",
				avatar: "",
			},
			{
				name: "MS",
				avatar: "",
			},
			{
				name: "RA",
				avatar: "",
			},
			{
				name: "SA",
				avatar: "",
			},
		],
	},
	{
		Icon: <ImagePlusIcon className="size-8 text-primary" />,
		title: "t_ips",
		members: [
			{
				name: "EH",
				avatar: "",
			},
			{
				name: "KY",
				avatar: "",
			},
			{
				name: "OG",
				avatar: "",
			},
		],
	},
	{
		Icon: <ServerIcon className="size-8 text-primary" />,
		title: "t_ss",
		members: [
			{
				name: "KM",
				avatar: "",
			},
			{
				name: "Ms",
				avatar: "",
			},
			{
				name: "YM",
				avatar: "",
			},
		],
	},
];

const supervisor = {
	avatar: "",
	title: "prof",
	name: "HS",
};

export function Page() {
	const { t } = useTranslation();

	return (
		<>
			<section className="relative bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-12 md:py-24 lg:py-32">
				<div className="container mx-auto px-4 md:px-6 relative z-10">
					<div className="max-w-3xl mx-auto text-center space-y-4">
						<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
							{t("welcome")}
						</h1>
						<p className="text-lg md:text-xl">{t("motto")}</p>
						<div className="flex justify-center gap-2">
							<Link
								to="/mobile"
								className="inline-flex items-center justify-center rounded-md bg-primary-foreground px-6 py-3 text-sm font-medium text-primary shadow-sm transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2"
							>
								{t("app_cfa")}
							</Link>
						</div>
					</div>
				</div>
				<div className="absolute inset-0 overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90" />
				</div>
			</section>
			<section className="py-12 md:py-24 lg:py-32 bg-muted">
				<div className="container mx-auto px-4 md:px-6">
					<div className="max-w-3xl mx-auto text-center space-y-4">
						<h2 className="text-3xl md:text-4xl font-bold tracking-tight">
							{t("proj_overview")}
						</h2>
						<p className="text-lg md:text-xl text-muted-foreground">
							{t("proj_overview_desc")}
						</p>
					</div>
					<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-background rounded-lg p-6 shadow-sm hover:shadow-lg transition-all">
							<div className="flex items-center gap-4 mb-4">
								<PocketIcon className="h-8 w-8 text-primary" />
								<h3 className="text-xl font-semibold">
									{t("embedded")}
								</h3>
							</div>
							<p className="text-muted-foreground">
								{t("embedded_desc")}
							</p>
						</div>
						<div className="bg-background rounded-lg p-6 shadow-sm hover:shadow-lg transition-all">
							<div className="flex items-center gap-4 mb-4">
								<ImagePlusIcon className="h-8 w-8 text-primary" />
								<h3 className="text-xl font-semibold">
									{t("ips")}
								</h3>
							</div>
							<p className="text-muted-foreground">
								{t("ips_desc")}
							</p>
						</div>
						<div className="bg-background rounded-lg p-6 shadow-sm hover:shadow-lg transition-all">
							<div className="flex items-center gap-4 mb-4">
								<ServerIcon className="h-8 w-8 text-primary" />
								<h3 className="text-xl font-semibold">
									{t("ss")}
								</h3>
							</div>
							<p className="text-muted-foreground">
								{t("ss_desc")}
							</p>
						</div>
					</div>
				</div>
			</section>
			<section className="py-12 md:py-24 lg:py-32">
				<div className="container mx-auto px-4 md:px-6">
					<div className="max-w-3xl mx-auto text-center space-y-4">
						<h2 className="text-3xl md:text-4xl font-bold tracking-tight">
							{t("another_motto")}
						</h2>
						<p className="text-lg md:text-xl text-muted-foreground">
							{t("another_motto_desc")}
						</p>
					</div>
					<div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						<div className="bg-muted rounded-lg p-6 shadow-sm transition-all hover:scale-105 hover:shadow-lg">
							<div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
								<LightbulbIcon className="h-8 w-8" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								{t("s_light")}
							</h3>
							<p className="text-muted-foreground">
								{t("s_light_desc")}
							</p>
						</div>
						<div className="bg-muted rounded-lg p-6 shadow-sm transition-all hover:scale-105 hover:shadow-lg">
							<div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
								<CarIcon className="h-8 w-8" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								{t("s_parking")}
							</h3>
							<p className="text-muted-foreground">
								{t("s_parking_desc")}
							</p>
						</div>
						<div className="bg-muted rounded-lg p-6 shadow-sm transition-all hover:scale-105 hover:shadow-lg">
							<div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
								<DoorOpenIcon className="h-8 w-8" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								{t("s_gate")}
							</h3>
							<p className="text-muted-foreground">
								{t("s_gate_desc")}
							</p>
						</div>
						<div className="bg-muted rounded-lg p-6 shadow-sm transition-all hover:scale-105 hover:shadow-lg">
							<div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
								<UserCheckIcon className="h-8 w-8" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								{t("s_attendance")}
							</h3>
							<p className="text-muted-foreground">
								{t("s_attendance_desc")}
							</p>
						</div>
						<div className="bg-muted rounded-lg p-6 shadow-sm transition-all hover:scale-105 hover:shadow-lg">
							<div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
								<DropletIcon className="h-8 w-8" />
							</div>
							<h3 className="text-xl font-semibold mb-2">
								{t("s_irrigation")}
							</h3>
							<p className="text-muted-foreground">
								{t("s_irrigation_desc")}
							</p>
						</div>
					</div>
				</div>
			</section>
			<section className="py-12 md:py-24 lg:py-32 bg-muted">
				<div className="container mx-auto px-4 md:px-6 space-y-8">
					<div className="max-w-3xl mx-auto text-center space-y-4">
						<h2 className="text-3xl md:text-4xl font-bold tracking-tight">
							{t("meet_team")}
						</h2>
						<p className="text-lg md:text-xl text-muted-foreground">
							{t("meet_team_desc")}
						</p>
					</div>
					<div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{teams.map((team) => (
							<div className="bg-background rounded-lg p-6 shadow-sm hover:shadow-lg transition-all">
								<div className="flex items-center gap-4 mb-4">
									{team.Icon}
									<h3 className="text-xl font-semibold">
										{t(team.title)}
									</h3>
								</div>
								<div className="grid grid-cols-2 gap-4">
									{team.members.map((member) => (
										<div className="flex flex-col items-center">
											<Avatar className="w-16 h-16 mb-2">
												<AvatarImage
													src={member.avatar}
												/>
												<AvatarFallback>
													{member.name}
												</AvatarFallback>
											</Avatar>
											<div className="text-center">
												<span className="font-medium">
													{t(member.name)}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
					<div className="flex items-center gap-4 flex-wrap bg-background rounded-lg p-6 shadow-sm hover:shadow-lg transition-all">
						<div className="flex items-center gap-4">
							<SupervisorIcon className="size-8 text-primary" />
							<h3 className="text-xl font-semibold">
								{t("supervisor")}
							</h3>
						</div>
						<div className="flex items-center gap-4">
							<Avatar className="w-16 h-16 mb-2">
								<AvatarImage src={supervisor.avatar} />
								<AvatarFallback>
									{supervisor.name}
								</AvatarFallback>
							</Avatar>
							<div className="flex items-center gap-2">
								<span className="ltr:italic font-semibold">
									{t(supervisor.title)}
								</span>
								<span className="font-medium">
									{t(supervisor.name)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

function SupervisorIcon(props: any) {
	return (
		<svg
			{...props}
			stroke="currentColor"
			fill="currentColor"
			stroke-width="0"
			viewBox="0 0 24 24"
			height="200px"
			width="200px"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path fill="none" d="M0 0h24v24H0z"></path>
			<path d="M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7a2.5 2.5 0 0 0 0 5zM9 11c1.66 0 2.99-1.34 2.99-3S10.66 5 9 5C7.34 5 6 6.34 6 8s1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.33-2.34 2.37-3.47C10.5 13.1 9.66 13 9 13z"></path>
		</svg>
	);
}

function CarIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
			<circle cx="7" cy="17" r="2" />
			<path d="M9 17h6" />
			<circle cx="17" cy="17" r="2" />
		</svg>
	);
}

function DoorOpenIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M13 4h3a2 2 0 0 1 2 2v14" />
			<path d="M2 20h3" />
			<path d="M13 20h9" />
			<path d="M10 12v.01" />
			<path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z" />
		</svg>
	);
}

function DropletIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
		</svg>
	);
}

function ImagePlusIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
			<line x1="16" x2="22" y1="5" y2="5" />
			<line x1="19" x2="19" y1="2" y2="8" />
			<circle cx="9" cy="9" r="2" />
			<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
		</svg>
	);
}

function LightbulbIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
			<path d="M9 18h6" />
			<path d="M10 22h4" />
		</svg>
	);
}

function PocketIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M4 3h16a2 2 0 0 1 2 2v6a10 10 0 0 1-10 10A10 10 0 0 1 2 11V5a2 2 0 0 1 2-2z" />
			<polyline points="8 10 12 14 16 10" />
		</svg>
	);
}

function ServerIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
			<rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
			<line x1="6" x2="6.01" y1="6" y2="6" />
			<line x1="6" x2="6.01" y1="18" y2="18" />
		</svg>
	);
}

function UserCheckIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<polyline points="16 11 18 13 22 9" />
		</svg>
	);
}
