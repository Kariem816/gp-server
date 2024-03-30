import { Link } from "@tanstack/react-router";
import { TCourseListing } from "~/services/courses";

export function CourseListing(course: TCourseListing) {
	return (
		<div className="bg-muted rounded-md p-2">
			<div className="flex justify-between items-center">
				<Link to="/courses/$id" params={{ id: course.id }}>
					<h2 className="hover:underline">{course.name}</h2>
				</Link>
				<span className="font-bold">{course.code}</span>
			</div>
			<div className="flex justify-between items-center mb-2">
				<span>{course.creditHours} Credit Hours</span>
				<span>{course._count.students} Students</span>
			</div>
			{course.teachers.length > 0 && (
				<div className="flex gap-x-4 mb-2">
					<span>Teachers:</span>
					<span className="space-y-2">
						{course.teachers.map((teacher) => (
							<div className="flex gap-2 items-center">
								<img
									src={teacher.user.img}
									alt={`${teacher.user.name}'s profile`}
									className="w-8 h-8 rounded-full"
								/>
								<Link
									key={teacher.id}
									className="font-semibold hover:underline"
									to="/teachers/$id"
									params={{ id: teacher.id }}
								>
									{teacher.user.name}
								</Link>
							</div>
						))}
					</span>
				</div>
			)}
		</div>
	);
}
