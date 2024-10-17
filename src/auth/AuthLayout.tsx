import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
	const { isAuthenticated } = useContext(AuthContext);

	return (
		<>
			{isAuthenticated ? (
				<Navigate to="/" />
			) : (
				<>
					<section className="flex-center flex-1  flex-col py-10">
						<Outlet />
					</section>

					<div className="xl:w-1/2 flex-center">
						<img
							src="/assets/images/side-img.png"
							alt="logo"
							className="hidden xl:flex h-5/6 object-cover bg-no-repeat rounded-2xl"
						/>
					</div>
				</>
			)}
		</>
	);
};

export default AuthLayout;
