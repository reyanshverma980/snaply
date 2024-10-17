import GridList from "@/components/shared/GridList";
import { useGetCurrentUser } from "@/lib/tanstack-query/queriesAndMutations";
import { Loader } from "lucide-react";

const LikedPosts = () => {
	const { data: currentUser } = useGetCurrentUser();

	if (!currentUser)
		return (
			<div className="flex-center w-full h-full">
				<Loader className="w-14" />
			</div>
		);

	return (
		<>
			{currentUser.liked.length === 0 && (
				<p className="text-light-4">No liked posts</p>
			)}

			<GridList posts={currentUser.liked} showStats={false} />
		</>
	);
};

export default LikedPosts;
