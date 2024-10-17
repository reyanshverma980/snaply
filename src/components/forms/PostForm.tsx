import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { postValidation } from "@/lib/validation";
import { Models } from "appwrite";
import {
	useCreatePost,
	useUpdatePost,
} from "@/lib/tanstack-query/queriesAndMutations";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../shared/Loader";

type PostFormProps = {
	post?: Models.Document;
	action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
	const { mutateAsync: createPost, isPending: isLoadingCreating } =
		useCreatePost();
	const { mutateAsync: updatePost, isPending: isLoadingUpdating } =
		useUpdatePost();
	const { user } = useContext(AuthContext);

	const { toast } = useToast();
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof postValidation>>({
		resolver: zodResolver(postValidation),
		defaultValues: {
			caption: post ? post?.caption : "",
			file: [],
			location: post ? post?.location : "",
			tags: post ? post?.tags.join(",") : "",
		},
	});

	async function onSubmit(values: z.infer<typeof postValidation>) {
		if (action === "Update" && post) {
			const updatedPost = await updatePost({
				...values,
				postId: post.$id,
				imageId: post.imageId,
				imageUrl: post.imageUrl,
			});

			if (!updatedPost) {
				toast({
					title: "Please try again",
				});
			}

			navigate(`/posts/${post.$id}`);
		} else if (action === "Create") {
			const newPost = await createPost({
				...values,
				userId: user.id,
			});

			if (!newPost) {
				toast({
					title: "Please try again",
				});
			}

			navigate("/");
		}
	}

	const content =
		isLoadingUpdating || isLoadingCreating ? (
			<Loader className="w-14" />
		) : (
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col w-full max-w-5xl gap-8">
					<FormField
						control={form.control}
						name="caption"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="shad-form_label">Caption</FormLabel>
								<FormControl>
									<Textarea
										className="shad-textarea custom-scrollbar"
										{...field}
									/>
								</FormControl>
								<FormMessage className="shad-form_message" />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="file"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="shad-form_label">Add Photos</FormLabel>
								<FormControl>
									<FileUploader
										fieldChange={field.onChange}
										mediaUrl={post?.imageUrl}
									/>
								</FormControl>
								<FormMessage className="shad-form_message" />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="location"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="shad-form_label">Add Location</FormLabel>
								<FormControl>
									<Input className="shad-input" autoComplete="off" {...field} />
								</FormControl>
								<FormMessage className="shad-form_message" />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="tags"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="shad-form_label">
									Add Tags (separated by comma " , ")
								</FormLabel>
								<FormControl>
									<Input
										type="text"
										className="shad-input"
										placeholder="Art, Nature, Music"
										autoComplete="off"
										{...field}
									/>
								</FormControl>
								<FormMessage className="shad-form_message" />
							</FormItem>
						)}
					/>

					<div className="flex items-center gap-4 justify-end">
						<Button type="button" className="shad-button_dark_4">
							Cancel
						</Button>

						<Button
							type="submit"
							className="shad-button_primary whitespace-nowrap"
							disabled={isLoadingCreating || isLoadingUpdating}>
							{action} Post
						</Button>
					</div>
				</form>
			</Form>
		);

	return content;
};

export default PostForm;
