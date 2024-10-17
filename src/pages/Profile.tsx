import GridList from "@/components/shared/GridList";
import Loader from "@/components/shared/Loader";
import { AuthContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/tanstack-query/queriesAndMutations";
import { useContext } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";

const Profile = () => {
	const { id } = useParams();
	const { pathname } = useLocation();
	const { user } = useContext(AuthContext);

	const { data: currentUser } = useGetUserById(id || "");

	if (!currentUser || !user.name) {
		return (
			<div className="w-full min-h-screen overflow-hidden relative">
				<Loader className="w-14 absolute top-60" />
			</div>
		);
	}

	return (
		<div className="profile-container">
			<div className="profile-inner_container">
				<img
					src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
					alt="profile"
					className="w-24 h-24 lg:h-32 lg:w-32 rounded-full object-cover aspect-square"
				/>

				<div className="flex flex-col justify-between md:mt-2">
					<div className="flex flex-col w-full text-center xl:text-left">
						<h1 className="h2-bold md:h1-bold">{currentUser.name}</h1>
						<p className="base-medium md:body-medium text-light-3">
							@{currentUser.username}
						</p>
					</div>
					<p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
						{currentUser.bio}
					</p>
				</div>

				<div className="flex justify-center">
					<div className={`${user.id !== currentUser.$id && "hidden"}`}>
						<Link
							to={`/update-profile/${currentUser.$id}`}
							className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
								user.id !== currentUser.$id && "hidden"
							}`}>
							<img
								src={"/assets/icons/edit.svg"}
								alt="edit"
								width={20}
								height={20}
							/>
							<p className="flex whitespace-nowrap small-medium">
								Edit Profile
							</p>
						</Link>
					</div>
				</div>
			</div>

			<div className="flex justify-center xl:justify-start max-w-5xl w-full">
				<Link
					to={`/profile/${id}`}
					className={`profile-tab ${
						pathname === `/profile/${id}` && "!bg-dark-3"
					} ${currentUser.$id === user.id ? "rounded-l-lg" : "rounded-lg"}`}>
					<img
						src={"/assets/icons/posts.svg"}
						alt="posts"
						width={20}
						height={20}
					/>
					Posts
				</Link>
				{currentUser.$id === user.id && (
					<Link
						to={`/profile/${id}/liked-posts`}
						className={`profile-tab rounded-r-lg ${
							pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
						}`}>
						<img
							src={"/assets/icons/liked.svg"}
							alt="like"
							width={20}
							height={20}
						/>
						Liked Posts
					</Link>
				)}
			</div>

			{pathname.includes("/liked-posts") && currentUser.$id === user.id ? (
				<Outlet />
			) : (
				<GridList posts={currentUser.posts} showUser={false} />
			)}
		</div>
	);
};

export default Profile;
