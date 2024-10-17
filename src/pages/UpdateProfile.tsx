import ProfileForm from "@/components/forms/ProfileForm";
import Loader from "@/components/shared/Loader";
import { AuthContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/tanstack-query/queriesAndMutations";
import { useContext } from "react";
import { useParams } from "react-router-dom";

const UpdateProfile = () => {
	const { user, setUser } = useContext(AuthContext);
	const { id } = useParams();

	const { data: currentUser } = useGetUserById(id || "");

	if (!currentUser || !user.name) {
		return (
			<div className="w-full min-h-screen overflow-hidden relative">
				<Loader className="w-14 absolute top-60" />
			</div>
		);
	}

	return (
		<div className="common-container">
			<div className="max-w-5xl w-full flex-start gap-4">
				<img
					src="/assets/icons/edit.svg"
					className="invert-white"
					width={36}
					height={36}
					alt="edit"
				/>
				<h2 className="h3-bold md:h2-bold text-left w-full">Update profile</h2>
			</div>

			<ProfileForm user={user} setUser={setUser} />
		</div>
	);
};

export default UpdateProfile;
