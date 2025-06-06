import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/tanstack-query/queriesAndMutations";
import { useParams } from "react-router-dom";

const EditPost = () => {
	const { id } = useParams();

	const { data: post, isPending } = useGetPostById(id || "");

	if (isPending) return <Loader className="w-14" />;

	return (
		<div className="common-container">
			<div className="flex-start gap-4 max-w-5xl w-full">
				<img
					src="/assets/icons/add-post.svg"
					alt="add-post"
					width={36}
					height={36}
				/>

				<h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
			</div>

			<PostForm post={post} action="Update" />
		</div>
	);
};

export default EditPost;
