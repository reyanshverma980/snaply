import GridList from "@/components/shared/GridList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/tanstack-query/queriesAndMutations";
import { Models } from "appwrite";
import { useEffect } from "react";

const Saved = () => {
	const { data: currentUser } = useGetCurrentUser();
	const posts = currentUser?.save.map((saved: Models.Document) => saved.post);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	if (!currentUser) {
		return (
			<div className="w-full h-screen relative">
				<Loader className="w-14 absolute top-60" />
			</div>
		);
	}

	return (
		<div className="saved-container">
			<div className="flex gap-4 w-full max-w-5xl">
				<img
					src="/assets/icons/save.svg"
					width={36}
					height={36}
					alt="edit"
					className="invert-white"
				/>
				<h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
			</div>

			<ul className="w-full flex justify-center max-w-5xl gap-9">
				{posts.length === 0 ? (
					<p className="text-light-4">No available posts</p>
				) : (
					<GridList posts={posts} showUser={false} showStats={false} />
				)}
			</ul>
		</div>
	);
};

export default Saved;
