import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/tanstack-query/queriesAndMutations";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";

const Topbar = () => {
	const { mutateAsync: signOut, isSuccess } = useSignOutAccount();
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	useEffect(() => {
		if (isSuccess) {
			navigate("/sign-in");
		}
	}, [isSuccess, navigate]);

	return (
		<section className="topbar">
			<div className="flex-between py-4 px-5">
				<Link to="/" className="flex items-center">
					<img src="/assets/images/Snaply.svg" alt="Snaply" width={175} />
				</Link>

				<div className="flex gap-4">
					<Button
						onClick={() => signOut()}
						className="shad-button_ghost"
						variant="ghost">
						<img src="/assets/icons/logout.svg" alt="logout" />
					</Button>

					<Link to={`/profile/${user.id}`} className="flex items-center">
						<img
							src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
							alt="profile"
							className="rounded-full w-10 h-10 object-cover aspect-square"
						/>
					</Link>
				</div>
			</div>
		</section>
	);
};

export default Topbar;
