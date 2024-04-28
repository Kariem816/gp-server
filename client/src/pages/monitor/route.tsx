import {
	createFileRoute,
	Link,
	Outlet,
	useNavigate,
} from "@tanstack/react-router";
import { get } from "~/services/api";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarShortcut,
	MenubarTrigger,
  } from "../../components/ui/menubar"

export const Route = createFileRoute("/monitor")({
	component: MonitorLayout,
});

function MonitorLayout() {
	return (
		<div className="h-full flex flex-col divide-x-2 md:flex-row">
			<div className="p-4 md:w-[25%] md:h-full md:overflow-auto">
				<h2>Monitor</h2>
				{controllers.length === 0 ? (
					<div className=" mr-40 text-center" >
						<p >
							<a className="hover:underline"href="http://localhost:5173/monitor/garbage" >
												Garbage
							</a>  
						 </p>
						<p> <a className="hover:underline"href="http://localhost:5173/monitor/parking" >
												Parking
							</a> 
						</p>
						<p> <a className="hover:underline"href="http://localhost:5173/monitor/irrigation" >
												Irrigation
						</a> 
						</p>
						<p> <a className="hover:underline"href="http://localhost:5173/monitor/attendence" >
												Attendence
						</a> 
					 
						</p>
					</div>
					 

					
					
				) : (
					<>
						<ul className="hidden md:block">
							{controllers.map((controller) => (
								<li key={controller.id}>
									<Link
										to={"/monitor/$id"}
										params={{ id: controller.id + "" }}
									>
										{controller.label}
									</Link>
								</li>
							))}
						</ul>
						<Collapsible
							open={isOpen}
							onOpenChange={setIsOpen}
							className="md:hidden space-y-2"
						>
							<div className="flex items-center justify-between space-x-4 px-4">
								<h4 className="text-sm font-semibold">
									Available Controllers
								</h4>
								<CollapsibleTrigger asChild>
									<Button variant="ghost" size="sm">
										<CaretSortIcon className="h-4 w-4" />
										<span className="sr-only">Toggle</span>
									</Button>
								</CollapsibleTrigger>
							</div>
							<CollapsibleContent className="space-x-2 space-y-2 bg-muted rounded-md p-4">
								{controllers.map((controller) => (
									<Button
										key={controller.id}
										variant="outline"
										size="sm"
										onClick={() =>
											onControllerClick(controller.id)
										}
									>
										{controller.label}
									</Button>
								))}
							</CollapsibleContent>
						</Collapsible>
					</>
				)}
			</div>
			<div className="container py-8 md:h-full md:overflow-auto">
				<Outlet />
			</div>
		</div>
	);
}
