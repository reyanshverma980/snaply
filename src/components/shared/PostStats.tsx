import {
	useDeleteSavedPost,
	useGetCurrentUser,
	useLikePost,
	useSavePost,
} from "@/lib/tanstack-query/queriesAndMutations";
import { Models } from "appwrite";
import { useEffect, useState } from "react";

type PostStatsProps = {
	post: Models.Document;
	userId: string;
	className?: string;
};

const PostStats = ({ post, userId, className }: PostStatsProps) => {
	const likesList: string[] = post.likes.map(
		(user: Models.Document) => user.$id
	);

	const [likes, setLikes] = useState(likesList);
	const [isSaved, setIsSaved] = useState(false);

	const { mutate: likePost } = useLikePost();
	const { mutate: savePost } = useSavePost();
	const { mutate: deleteSavedPost } = useDeleteSavedPost();

	const { data: user } = useGetCurrentUser();

	const savedPostRecord = user?.save?.find(
		(record: Models.Document) => record.post.$id === post.$id
	);

	useEffect(() => {
		setIsSaved(!!savedPostRecord);
	}, [savedPostRecord]);

	const handleLikePost = (e: React.MouseEvent) => {
		e.stopPropagation();

		let newLikes = [...likes];

		if (newLikes.includes(userId)) {
			newLikes = newLikes.filter((id) => id !== userId);
		} else {
			newLikes.push(userId);
		}

		likePost({ postId: post.$id, likesArray: newLikes });
		setLikes(newLikes);
	};

	const handleSavedPost = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (isSaved) {
			deleteSavedPost(savedPostRecord.$id);
			setIsSaved(false);
		} else {
			savePost({ postId: post.$id, userId });
			setIsSaved(true);
		}
	};

	return (
		<div
			className={`flex justify-between items-center z-20 gap-2 ${className}`}>
			<div className="flex items-center gap-2">
				<img
					src={
						likes.includes(userId)
							? "/assets/icons/liked.svg"
							: "/assets/icons/like.svg"
					}
					alt="like"
					width={28}
					height={28}
					onClick={handleLikePost}
					className="cursor-pointer"
				/>
				<p className="small-medium lg:base-medium">{likes.length}</p>
			</div>

			<div className="flex items-center gap-2">
				<img
					src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
					alt="like"
					width={28}
					height={28}
					onClick={handleSavedPost}
					className="cursor-pointer"
				/>
			</div>
		</div>
	);
};

export default PostStats;
