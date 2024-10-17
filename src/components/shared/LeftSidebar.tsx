import { useContext } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { INavLink } from "@/types";
import { INITIAL_USER, sidebarLinks } from "@/constants";
import { Button } from "../ui/button";
import Loader from "./Loader";
import { AuthContext } from "@/context/AuthContext";
import { useSignOutAccount } from "@/lib/tanstack-query/queriesAndMutations";

const LeftSidebar = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { user, isLoading, setIsAuthenticated, setUser } =
		useContext(AuthContext);

	const { mutateAsync: signOut } = useSignOutAccount();

	const handleSignOut = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		signOut();
		setIsAuthenticated(false);
		setUser(INITIAL_USER);
		navigate("/sign-in");
	};

	return (
		<nav className="leftsidebar">
			<div className="flex flex-col gap-8 flex-grow">
				<Link to="/" className="flex items-center">
					<img src="/assets/images/Snaply.svg" alt="Snaply" width={175} />
				</Link>

				{isLoading ? (
					<Loader className="w-10" />
				) : (
					<Link
						to={`/profile/${user.id}`}
						className="flex items-center relative gap-3 py-1">
						<div
							className={`w-16 h-16 bg-primary-500 rounded-full absolute transition -left-[102px] ${
								pathname.includes("/profile") ||
								pathname.includes("/update-profile")
									? "flex items-center justify-center"
									: "hidden"
							}`}
						/>

						<img
							src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
							alt="profile"
							className="h-12 w-12 rounded-full object-cover aspect-square"
						/>

						<div className="flex flex-col">
							<p className="body-bold">{user.name}</p>
							<p className="small-regular text-light-3">@{user.username}</p>
						</div>
					</Link>
				)}

				<ul className="flex flex-col gap-2 flex-grow">
					{sidebarLinks.map((link: INavLink) => {
						const isActive = pathname === link.route;

						return (
							<li
								key={link.label}
								className={`leftsidebar-link relative group ${
									isActive && "bg-primary-500"
								}`}>
								<div
									className={`w-16 h-16 bg-primary-500 rounded-full absolute -left-[102px] transition ${
										isActive ? "flex items-center justify-center" : "hidden"
									}`}
								/>

								<NavLink
									to={link.route}
									className="p-4 flex items-center gap-5">
									<img
										src={link.imgURL}
										alt={link.label}
										className={`group-hover:invert-white ${
											isActive && "invert-white"
										}`}
									/>
									{link.label}
								</NavLink>
							</li>
						);
					})}
				</ul>

				<Button
					onClick={handleSignOut}
					className="shad-button_ghost"
					variant="ghost">
					<img src="/assets/icons/logout.svg" alt="logout" />
					<p className="base-medium">Logout</p>
				</Button>
			</div>
		</nav>
	);
};

export default LeftSidebar;
