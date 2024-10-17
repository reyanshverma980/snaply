import { ID, ImageGravity, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";

export async function createUserAccount(user: INewUser) {
	try {
		const newAccount = await account.create(
			ID.unique(),
			user.email,
			user.password,
			user.name
		);

		if (!newAccount) throw Error;

		const avatarUrl = avatars.getInitials(user.name);

		const newUser = await saveUserToDB({
			accountId: newAccount.$id,
			name: newAccount.name,
			email: newAccount.email,
			username: user.username,
			imageUrl: avatarUrl,
		});

		return newUser;
	} catch (error) {
		console.log(error);
	}
}

export async function saveUserToDB(user: {
	accountId: string;
	name: string;
	email: string;
	imageUrl: URL;
	username?: string;
}) {
	try {
		const newUser = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			ID.unique(),
			user
		);

		return newUser;
	} catch (error) {
		console.log(error);
	}
}

export async function signInAccount(user: { email: string; password: string }) {
	try {
		const session = await account.createEmailPasswordSession(
			user.email,
			user.password
		);

		return session;
	} catch (error) {
		console.log(error);
	}
}

export async function signOutAccount() {
	try {
		await account.deleteSession("current");
	} catch (error) {
		console.log(error);
	}
}

export async function getCurrentUser() {
	try {
		const currentAccount = await account.get();

		if (!currentAccount) throw Error;

		const currentUser = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			[Query.equal("accountId", currentAccount.$id)]
		);

		if (!currentUser) throw Error;

		return currentUser.documents[0];
	} catch (error) {
		console.log(error);
	}
}

export async function createPost(post: INewPost) {
	try {
		// upload file to storage
		const uploadedFile = await uploadFile(post.file[0]);

		if (!uploadedFile) throw Error;

		// get the file url
		const fileUrl = getFilePreview(uploadedFile.$id);

		if (!fileUrl) {
			deleteFile(uploadedFile.$id);
			throw Error;
		}

		// convert tags in an array
		const tags = post.tags?.replace(/ /g, "").split(",") || [];

		//  save post to database
		const newPost = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			ID.unique(),
			{
				creator: post.userId,
				caption: post.caption,
				imageId: uploadedFile.$id,
				imageUrl: fileUrl,
				location: post.location,
				tags,
			}
		);

		if (!newPost) {
			await deleteFile(uploadedFile.$id);
			throw Error;
		}

		return newPost;
	} catch (error) {
		console.log(error);
	}
}

export async function uploadFile(file: File) {
	try {
		const uploadedFile = await storage.createFile(
			appwriteConfig.storageId,
			ID.unique(),
			file
		);

		return uploadedFile;
	} catch (error) {
		console.log(error);
	}
}

export function getFilePreview(fileId: string) {
	try {
		const fileUrl = storage.getFilePreview(
			appwriteConfig.storageId,
			fileId,
			2000,
			2000,
			ImageGravity.Top,
			100
		);

		if (!fileUrl) throw Error;

		return fileUrl;
	} catch (error) {
		console.log(error);
	}
}

export async function deleteFile(fileID: string) {
	try {
		await storage.deleteFile(appwriteConfig.storageId, fileID);

		return { status: "ok" };
	} catch (error) {
		console.log(error);
	}
}

export async function getRecentPosts() {
	try {
		const posts = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			[Query.orderDesc("$createdAt"), Query.limit(20)]
		);

		if (!posts) throw Error;

		return posts;
	} catch (error) {
		console.log(error);
	}
}

export async function likePost(postId: string, likesArray: string[]) {
	try {
		const updatedPost = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			postId,
			{
				likes: likesArray,
			}
		);

		if (!updatedPost) throw Error;

		return updatedPost;
	} catch (error) {
		console.log(error);
	}
}

// ============================== SAVE POST
export async function savePost(postId: string, userId: string) {
	try {
		const savedPost = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.savesCollectionId,
			ID.unique(),
			{
				user: userId,
				post: postId,
			}
		);

		if (!savedPost) throw Error;

		return savedPost;
	} catch (error) {
		console.log(error);
	}
}

// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
	try {
		const statusCode = await databases.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.savesCollectionId,
			savedRecordId
		);

		if (!statusCode) throw Error;

		return { status: "ok" };
	} catch (error) {
		console.log(error);
	}
}

export async function getPostById(id: string) {
	try {
		const post = await databases.getDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			id
		);

		if (!post) throw Error;

		return post;
	} catch (error) {
		console.log(error);
	}
}

export async function updatePost(post: IUpdatePost) {
	const hasFileToUpdate = post.file.length > 0;

	let image = {
		imageId: post.imageId,
		imageUrl: post.imageUrl,
	};

	try {
		if (hasFileToUpdate) {
			// upload file to storage
			const uploadedFile = await uploadFile(post.file[0]);

			if (!uploadedFile) throw Error;

			// get the file url
			const fileUrl = getFilePreview(uploadedFile.$id);

			if (!fileUrl) {
				deleteFile(uploadedFile.$id);
				throw Error;
			}

			image = {
				imageId: uploadedFile.$id,
				imageUrl: fileUrl,
			};
		}

		// convert tags in an array
		const tags = post.tags?.replace(/ /g, "").split(",") || [];

		//  update post in database
		const updatedPost = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			post.postId,
			{
				caption: post.caption,
				imageId: image.imageId,
				imageUrl: image.imageUrl,
				location: post.location,
				tags,
			}
		);

		if (!updatedPost) {
			await deleteFile(image.imageId);
			throw Error;
		}

		// delete the previous file
		deleteFile(post.imageId);

		return updatedPost;
	} catch (error) {
		console.log(error);
	}
}

export async function deletePost(postId: string, imageId: string) {
	if (!postId || !imageId) throw Error;

	try {
		await databases.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			postId
		);

		await storage.deleteFile(appwriteConfig.storageId, imageId);

		return { status: "ok" };
	} catch (error) {
		console.log(error);
	}
}

export async function getInfinitePosts({ pageParam }: { pageParam?: number }) {
	const queries = [Query.orderDesc("$createdAt"), Query.limit(20)];

	if (pageParam) {
		queries.push(Query.cursorAfter(pageParam.toString()));
	}

	try {
		const posts = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			queries
		);

		if (!posts) throw Error;

		return posts;
	} catch (error) {
		console.log(error);
	}
}

export async function searchPosts(searchTerm: string) {
	try {
		const posts = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			[Query.search("tags", searchTerm)]
		);

		if (!posts) throw Error;

		return posts;
	} catch (error) {
		console.log(error);
	}
}

// ============================== GET USER'S POST
export async function getUserPosts(id: string) {
	try {
		const posts = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.postCollectionId,
			[Query.equal("creator", id), Query.orderDesc("$createdAt")]
		);
		if (!posts) throw Error;

		return posts;
	} catch (error) {
		console.log(error);
	}
}

// ============================================================
// USER
// ============================================================
export async function getUserById(id: string) {
	try {
		const user = await databases.getDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			id
		);

		if (!user) throw Error;

		return user;
	} catch (error) {
		console.log(error);
	}
}

export async function updateUser(user: IUpdateUser) {
	const updateProfileImage = user.file.length > 0;

	let image = {
		imageId: user.imageId,
		imageUrl: user.imageUrl,
	};

	try {
		if (updateProfileImage) {
			const uploadedFile = await uploadFile(user.file[0]);
			if (!uploadedFile) throw Error;

			// Get new file url
			const fileUrl = getFilePreview(uploadedFile.$id);
			if (!fileUrl) {
				await deleteFile(uploadedFile.$id);
				throw Error;
			}

			image = { imageUrl: fileUrl, imageId: uploadedFile.$id };
		}

		const updatedUser = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			user.userId,
			{
				name: user.name,
				bio: user.bio,
				imageUrl: image.imageUrl,
				imageId: image.imageId,
			}
		);

		// Failed to update
		if (!updatedUser) {
			// Delete new file that has been recently uploaded
			if (updateProfileImage) {
				await deleteFile(image.imageId);
			}
			// If no new file uploaded, just throw error
			throw Error;
		}

		// Safely delete old file after successful update
		if (user.imageId && updateProfileImage) {
			await deleteFile(user.imageId);
		}

		return updatedUser;
	} catch (error) {
		console.log(error);
	}
}
