import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signupValidation } from "@/lib/validation";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
	useCreateUserAccount,
	useSignInAccount,
} from "@/lib/tanstack-query/queriesAndMutations";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Loader from "@/components/shared/Loader";

const SignupForm = () => {
	const form = useForm<z.infer<typeof signupValidation>>({
		resolver: zodResolver(signupValidation),
		defaultValues: {
			name: "",
			username: "",
			email: "",
			password: "",
		},
	});

	const { toast } = useToast();
	const navigate = useNavigate();
	const { mutateAsync: createUser, isPending: isCreatingAccount } =
		useCreateUserAccount();
	const { mutateAsync: signIn, isPending: isSigningInUser } =
		useSignInAccount();
	const { checkAuthUser, isLoading } = useContext(AuthContext);

	async function onSubmit(values: z.infer<typeof signupValidation>) {
		try {
			const newUser = await createUser(values);

			if (!newUser) {
				toast({
					title: "Sign Up failed. Please try again.",
				});
				return;
			}

			const session = await signIn({
				email: values.email,
				password: values.password,
			});

			if (!session) {
				toast({
					title: "Something went wrong. Please login your new account",
				});
				navigate("/sign-in");
				return;
			}

			const isLoggedIn = await checkAuthUser();

			if (isLoggedIn) {
				form.reset();
				navigate("/");
			} else {
				toast({
					title: "Login failed, pleas try again.",
				});
				return;
			}
		} catch (error) {
			console.log({ error });
		}
	}

	return (
		<div>
			<Form {...form}>
				<div className="sm:w-420 flex-center flex-col">
					<h2 className="h3-bold md:h2-bold mt-2">Create a new account</h2>

					<p className="text-light-3 small-medium md:base-regular mt-1">
						To use Snaply, please enter your details
					</p>

					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col w-full gap-3 mt-3">
						<FormField
							name="name"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											type="text"
											className="shad-input"
											autoComplete="off"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							name="username"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											type="text"
											className="shad-input"
											autoComplete="off"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											className="shad-input"
											autoComplete="off"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" className="shad-input" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="shad-button_primary">
							{isCreatingAccount || isSigningInUser || isLoading ? (
								<div className="flex-center gap-2">
									<Loader /> Loading...
								</div>
							) : (
								"Sign Up"
							)}
						</Button>

						<p className="text-small-regular text-light-2 text-center ">
							Already have an account?{" "}
							<Link
								to="/sign-in"
								className="text-primary-500 text-small-semibold ml-1">
								Log in
							</Link>
						</p>
					</form>
				</div>
			</Form>
		</div>
	);
};

export default SignupForm;
