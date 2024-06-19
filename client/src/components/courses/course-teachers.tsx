import { Link } from "@tanstack/react-router";
import type { Course } from "~/services/courses";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useTranslation } from "~/contexts/translation";

export function CourseTeachers({ teachers }: { teachers: Course["teachers"] }) {
	const { t } = useTranslation();
	return (
		<div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{teachers.map((teacher) => (
				<Link
					to="/teachers/$id"
					params={{ id: teacher.id }}
					className="block flex-grow"
					key={teacher.id}
				>
					<div className="p-2 flex gap-2 bg-accent rounded-md items-center">
						<Avatar>
							<AvatarImage
								src={teacher.user.img}
								alt={teacher.user.name}
							/>
							<AvatarFallback>
								{teacher.user.name[0]}
							</AvatarFallback>
						</Avatar>
						<span>{teacher.user.name}</span>
					</div>
				</Link>
			))}
			{teachers.length === 0 && (
				<p className="flex-grow text-center italic">
					{t("no_teachers")}
				</p>
			)}
		</div>
	);
}
