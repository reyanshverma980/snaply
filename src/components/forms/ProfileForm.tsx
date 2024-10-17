import { profileValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import ProfileImageUploader from "../shared/ProfileImageUploader";
import { Textarea } from "../ui/textarea";
import {
	useGetUserById,
	useUpdateUser,
} from "@/lib/tanstack-query/queriesAndMutations";
import { useNavigate, useParams } from "react-router-dom";
import { IUser } from "@/types";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";
import { useToast } from "@/hooks/use-toast";
import Loader from "../shared/Loader";

const ProfileForm = ({
	user,
	setUser,
}: {
	user: IUser;
	setUser: Dispatch<SetStateAction<IUser>>;
}) => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { toast } = useToast();

	const { data: currentUser } = useGetUserById(id!);
	const { mutateAsync: updateUser, isPending } = useUpdateUser();

	const form = useForm<z.infer<typeof profileValidation>>({
		resolver: zodResolver(profileValidation),
		defaultValues: {
			profileImage: [],
			name: user.name,
			username: user.username,
			email: user.email,
			bio: user.bio || "",
		},
	});

	const onSubmit = async (value: z.infer<typeof profileValidation>) => {
		const updatedUser = await updateUser({
			userId: currentUser!.$id,
			name: value.name,
			bio: value.bio,
			file: value.profileImage,
			imageUrl: currentUser!.imageUrl,
			imageId: currentUser!.imageId,
		});

		if (!updatedUser) {
			toast({
				title: "Update failed, Please try again.",
			});
		}

		setUser({
			...user,
			name: updatedUser?.name,
			bio: updatedUser?.bio,
			imageUrl: updatedUser?.imageUrl,
		});

		return navigate(`/profile/${id}`);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col w-full max-w-5xl gap-7">
				<FormField
					control={form.control}
					name="profileImage"
					render={({ field }) => (
						<FormItem className="flex items-center gap-4">
							<FormControl>
								<ProfileImageUploader
									fieldChange={field.onChange}
									mediaUrl={user.imageUrl}
								/>
							</FormControl>
							<FormLabel className="text-blue-400">
								Change Profile photo
							</FormLabel>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Name</FormLabel>
							<FormControl>
								<Input
									type="text"
									className="shad-input"
									autoComplete="off"
									{...field}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Username</FormLabel>
							<FormControl>
								<Input
									type="text"
									className="shad-input"
									disabled={true}
									{...field}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Email</FormLabel>
							<FormControl>
								<Input
									type="email"
									className="shad-input"
									disabled={true}
									{...field}
								/>
							</FormControl>
							<FormMessage className="shad-form_message" />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="bio"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="shad-form_label">Bio</FormLabel>
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

				<div className="flex gap-4 items-center justify-end">
					<Button
						type="button"
						className="shad-button_dark_4"
						onClick={() => navigate(-1)}>
						Cancel
					</Button>
					<Button
						type="submit"
						className="shad-button_primary whitespace-nowrap"
						disabled={isPending}>
						{isPending ? <Loader /> : "Update Profile"}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default ProfileForm;
