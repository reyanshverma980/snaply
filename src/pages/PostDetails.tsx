import GridList from "@/components/shared/GridList";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import {
	useDeletePost,
	useGetPostById,
	useGetUserPosts,
} from "@/lib/tanstack-query/queriesAndMutations";
import { formatDate } from "@/lib/utils";
import { useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const PostDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	const { data: post, isLoading } = useGetPostById(id || "");
	const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(
		post?.creator.$id
	);
	const { mutate: deletePost } = useDeletePost();

	const relatedPosts = userPosts?.documents.filter(
		(userPost) => userPost.$id !== id
	);

	if (isLoading) {
		return (
			<div className="w-full min-h-screen overflow-hidden relative">
				<Loader className="w-14 absolute top-60" />
			</div>
		);
	}

	const handleDeletePost = () => {
		deletePost({ postId: id!, imageId: post?.imageId });
		navigate(-1);
	};

	return (
		<div className="post_details-container">
			<div className="post_details-card">
				<img src={post?.imageUrl} alt="post" className="post_details-img" />

				<div className="post_details-info">
					<div className="flex items-center justify-between w-full">
						<Link
							to={`/profile/${post?.creator.$id}`}
							className="flex items-center gap-3">
							<img
								src={
									post?.creator?.imageUrl ||
									"/assets/icons/profile-placeholder.svg"
								}
								alt="creator"
								className="rounded-full w-8 h-8 lg:w-12 lg:h-12 object-cover aspect-square"
							/>

							<div className="flex flex-col">
								<p className="base-medium lg:body-bold text-light-1">
									{post?.creator.name}
								</p>

								<div className="flex items-center gap-2 text-light-3">
									<p className="subtle-semibold lg:small-regular">
										{formatDate(post?.$createdAt)}
									</p>
									-
									<p className="subtle-semibold lg:small-regular">
										{`${post?.location}`.toUpperCase()}
									</p>
								</div>
							</div>
						</Link>

						<div className="flex-center gap-2">
							<Link
								to={`/update-post/${post?.$id}`}
								className={`${user.id !== post?.creator.$id && "hidden"}`}>
								<img
									src="/assets/icons/edit.svg"
									width={24}
									height={24}
									alt="edit"
								/>
							</Link>

							<Button
								onClick={handleDeletePost}
								variant="ghost"
								className={`${
									user.id !== post?.creator.$id
										? "hidden"
										: "post_details-delete_btn"
								}`}>
								<img
									src="/assets/icons/delete.svg"
									width={24}
									height={24}
									alt="delete"
								/>
							</Button>
						</div>
					</div>

					<hr className="border w-full border-dark-4/80" />

					<div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
						<p>{post?.caption}</p>
						<ul className="flex gap-1 mt-2">
							{post?.tags.map((tag: string) => (
								<li key={tag} className="text-light-3">
									#{tag}
								</li>
							))}
						</ul>
					</div>

					<div className="w-full">
						<PostStats post={post!} userId={user.id} />
					</div>
				</div>
			</div>

			<div className="w-full max-w-5xl">
				<hr className="border w-full border-dark-4/80" />

				<h3 className="body-bold md:h3-bold w-full my-10">
					More Related Posts
				</h3>
				{isUserPostLoading || !relatedPosts ? (
					<Loader />
				) : (
					<GridList posts={relatedPosts} />
				)}
			</div>
		</div>
	);
};

export default PostDetails;