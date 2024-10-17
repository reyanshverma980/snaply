import { NavLink, useLocation } from "react-router-dom";

import { INavLink } from "@/types";
import { bottombarLinks } from "@/constants";

const Bottombar = () => {
	const { pathname } = useLocation();

	return (
		<section className="bottom-bar">
			<ul className="flex w-full justify-between gap-4">
				{bottombarLinks.map((link: INavLink) => {
					const isActive = pathname === link.route;

					return (
						<li
							key={link.label}
							className={`${
								isActive && "bg-primary-500 rounded-xl transition"
							}`}>
							<NavLink
								to={link.route}
								className="py-2 px-3 flex-center flex-col gap-1">
								<img
									src={link.imgURL}
									alt={link.label}
									className={`${isActive && "invert-white"}`}
								/>

								<p className="small-medium text-light-2">{link.label}</p>
							</NavLink>
						</li>
					);
				})}
			</ul>
		</section>
	);
};

export default Bottombar;
