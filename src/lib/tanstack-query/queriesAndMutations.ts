import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	createPost,
	createUserAccount,
	deletePost,
	deleteSavedPost,
	getCurrentUser,
	getInfinitePosts,
	getPostById,
	getRecentPosts,
	getUserById,
	getUserPosts,
	likePost,
	savePost,
	searchPosts,
	signInAccount,
	signOutAccount,
	updatePost,
	updateUser,
} from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";

// ============================================================
// AUTH QUERIES
// ============================================================

export const useCreateUserAccount = () => {
	return useMutation({
		mutationFn: (user: INewUser) => createUserAccount(user),
	});
};

export const useSignInAccount = () => {
	return useMutation({
		mutationFn: (user: { email: string; password: string }) =>
			signInAccount(user),
	});
};

export const useSignOutAccount = () => {
	return useMutation({
		mutationFn: () => signOutAccount(),
	});
};

// ============================================================
// USER QUERIES
// ============================================================

export const useGetCurrentUser = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_CURRENT_USER],
		queryFn: getCurrentUser,
	});
};

export const useGetUserById = (id: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_USER_BY_ID, id],
		queryFn: () => getUserById(id),
		enabled: !!id,
	});
};

export const useUpdateUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (user: IUpdateUser) => updateUser(user),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
			});
		},
	});
};

// ============================================================
// POST QUERIES
// ============================================================

export const useSearchPosts = (searchTerm: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
		queryFn: () => searchPosts(searchTerm),
		enabled: !!searchTerm,
	});
};

export const useGetRecentPosts = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
		queryFn: getRecentPosts,
	});
};

export const useGetPostById = (id: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_POST_BY_ID, id],
		queryFn: () => getPostById(id),
		enabled: !!id,
	});
};

// queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
// 		queryFn: getInfinitePosts,
// 		getNextPageParam: (lastPage: DocumentList<Document> | undefined) => {
// 			if (lastPage && lastPage.documents.length === 0) return null;
// 			const lastId = lastPage!.documents[lastPage!.documents.length - 1].$id;
// 			return lastId;
// 		},

export const useGetInfinitePosts = () => {
	return useInfiniteQuery({
		queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
		queryFn: getInfinitePosts,
		initialPageParam: 0,
		getNextPageParam: (lastPage) => {
			// If there's no data, there are no more pages.
			if (!lastPage || lastPage.documents.length === 0) return null;

			// Use the $id of the last document as the cursor.
			const lastId = lastPage.documents[lastPage.documents.length - 1].$id;

			const numericLastId = parseInt(lastId, 10);
			if (isNaN(numericLastId)) return null;

			return numericLastId;
		},
	});
};

export const useGetUserPosts = (userId: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
		queryFn: () => getUserPosts(userId),
		enabled: !!userId,
	});
};

export const useCreatePost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (post: INewPost) => createPost(post),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
		},
	});
};

export const useUpdatePost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (post: IUpdatePost) => updatePost(post),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
			});
		},
	});
};

export const useDeletePost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
			deletePost(postId, imageId),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});
		},
	});
};

export const useLikePost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			postId,
			likesArray,
		}: {
			postId: string;
			likesArray: string[];
		}) => likePost(postId, likesArray),

		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});

			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
			});

			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});

			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});

			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
			});
		},
	});
};

export const useSavePost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
			savePost(postId, userId),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});

			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});

			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
};

export const useDeleteSavedPost = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POSTS],
			});

			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_POST_BY_ID],
			});

			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
			});

			queryClient.invalidateQueries({
				queryKey: [QUERY_KEYS.GET_CURRENT_USER],
			});
		},
	});
};
