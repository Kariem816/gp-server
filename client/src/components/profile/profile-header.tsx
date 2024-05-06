import { useAuth } from "~/contexts/auth";
import ProfilePic from "./profile-pic";

import type { LoggedUser } from "~/types/users";

export default function ProfileHeader({ user }: { user: LoggedUser }) {
	const { user: authUser } = useAuth();

	if (authUser.role === "guest") {
		console.error("Unreachable");
		return null;
	}

	return (
		<div className="grid place-items-center gap-6">
			<ProfilePic
				img={user.img}
				name={user.name}
				isCurrentUser={user.id === authUser.id}
			/>
			<div className="text-center">
				<h1 className="text-2xl font-bold m-0">{user.name}</h1>
				<span className="text-muted-foreground">@{user.username}</span>
			</div>
		</div>
	);
}
