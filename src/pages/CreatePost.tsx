import PostForm from "@/components/forms/PostForm";

const CreatePost = () => {
	return (
		<div className="common-container">
			<div className="flex-start gap-4 max-w-5xl w-full">
				<img
					src="/assets/icons/add-post.svg"
					className="invert-white"
					alt="add-post"
					width={36}
					height={36}
				/>

				<h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
			</div>

			<PostForm action="Create" />
		</div>
	);
};

export default CreatePost;
