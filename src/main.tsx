import { createRoot } from "react-dom/client";
import App from "./App";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import {
	CreatePost,
	EditPost,
	Explore,
	Home,
	LikedPosts,
	PostDetails,
	Profile,
	RootLayout,
	Saved,
	UpdateProfile,
} from "./pages";

import { AuthLayout, SigninForm, SignupForm } from "./auth";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				element: <RootLayout />,
				children: [
					{ index: true, element: <Home /> },
					{ path: "/explore", element: <Explore /> },
					{ path: "/saved", element: <Saved /> },
					{ path: "/create-post", element: <CreatePost /> },
					{ path: "/update-post/:id", element: <EditPost /> },
					{ path: "/posts/:id", element: <PostDetails /> },
					{
						path: "/profile/:id",
						element: <Profile />,
						children: [
							{
								path: "/profile/:id/liked-posts",
								element: <LikedPosts />,
							},
						],
					},
					{ path: "/update-profile/:id", element: <UpdateProfile /> },
				],
			},

			{
				element: <AuthLayout />,
				children: [
					{ path: "sign-in", element: <SigninForm /> },
					{ path: "sign-up", element: <SignupForm /> },
				],
			},
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<RouterProvider router={router} />
);
