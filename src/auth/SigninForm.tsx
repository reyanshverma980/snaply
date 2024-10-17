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
import { Link, useNavigate } from "react-router-dom";
import { signinValidation } from "@/lib/validation";
import { useToast } from "@/hooks/use-toast";
import { useSignInAccount } from "@/lib/tanstack-query/queriesAndMutations";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Loader from "@/components/shared/Loader";

const SigninForm = () => {
	const form = useForm<z.infer<typeof signinValidation>>({
		resolver: zodResolver(signinValidation),
		defaultValues: {
			email: "eva.garcia@example.com",
			password: "TestPassword123!",
		},
	});

	const { toast } = useToast();
	const navigate = useNavigate();
	const { mutateAsync: signIn, isPending } = useSignInAccount();
	const { checkAuthUser, isLoading } = useContext(AuthContext);

	async function onSubmit(values: z.infer<typeof signinValidation>) {
		const session = await signIn({
			email: values.email,
			password: values.password,
		});

		if (!session) {
			toast({
				title: "Sign up failed. Please try again.",
			});
			return;
		}

		const isLoggedIn = await checkAuthUser();

		if (isLoggedIn) {
			form.reset();
			navigate("/");
		} else {
			toast({
				title: "Login failed. Please try again.",
			});
			return;
		}
	}

	return (
		<div>
			<Form {...form}>
				<div className="sm:w-420 flex-center flex-col">
					<img src="/assets/images/Snaply.svg" alt="Snaply" width={200} />

					<h2 className="h3-bold md:h2-bold mt-3">Login to your account</h2>

					<p className="text-light-3 small-medium md:base-regular mt-1">
						To use Snaply, please enter your details
					</p>

					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col w-full gap-3 mt-3">
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
							{isLoading || isPending ? (
								<div className="flex-center gap-2">
									<Loader /> Loading...
								</div>
							) : (
								"Log in"
							)}
						</Button>

						<p className="text-small-regular text-light-2 text-center ">
							New to Snaply?{" "}
							<Link
								to="/sign-up"
								className="text-primary-500 text-small-semibold ml-1">
								Sign up
							</Link>
						</p>
					</form>
				</div>
			</Form>
		</div>
	);
};

export default SigninForm;
