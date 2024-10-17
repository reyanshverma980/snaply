import { Models } from "appwrite";
import Loader from "./Loader";
import GridList from "./GridList";

type SearchResultsProps = {
	posts?: Models.Document[];
	isFetching: boolean;
};

const SearchResults = ({ posts, isFetching }: SearchResultsProps) => {
	if (isFetching) {
		return <Loader className="w-14" />;
	}

	if (posts && posts.length > 0) {
		return <GridList posts={posts} />;
	}

	return (
		<p className="text-light-4 mt-10 text-center w-full">No results found</p>
	);
};

export default SearchResults;
