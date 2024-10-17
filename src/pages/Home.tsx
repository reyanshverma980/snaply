import PostCard from "@/components/shared/PostCard";
import Skeleton from "@/components/shared/Skeleton";
import { useGetRecentPosts } from "@/lib/tanstack-query/queriesAndMutations";
import { Models } from "appwrite";

const Home = () => {
	const { data: posts, isPending: isPostLoading } = useGetRecentPosts();

	const content =
		isPostLoading && !posts ? (
			<Skeleton />
		) : (
			<div className="home-container">
				<div className="home-posts">
					<h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>

					<ul className="flex flex-col flex-1 gap-9 w-full">
						{posts?.documents.map((post: Models.Document) => (
							<PostCard key={post.$id} post={post} />
						))}
					</ul>
				</div>
			</div>
		);

	return content;
};

export default Home;
