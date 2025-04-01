import GridList from "@/components/shared/GridList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import { hashTags } from "@/constants";
import {
  useGetInfinitePosts,
  useSearchPosts,
} from "@/lib/tanstack-query/queriesAndMutations";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "use-debounce";

const Explore = () => {
  const { data: posts, fetchNextPage, hasNextPage } = useGetInfinitePosts();

  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue] = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching } = useSearchPosts(debouncedValue);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue, fetchNextPage]);

  if (!posts) {
    return (
      <div className="w-full min-h-screen overflow-hidden relative">
        <Loader className="w-14 absolute top-60" />
      </div>
    );
  }

  const showSearchResults = searchValue !== "";
  const noPosts =
    !showSearchResults &&
    posts.pages.every((item) => item?.documents.length === 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h2-bold md:h1-bold w-full text-center">
          Search Hashtags
        </h2>
        <div className="flex gap-1 px-4 w-full max-w-xl rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            className="explore-search"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4">
          {hashTags.map((item) => (
            <p
              key={item.hashtag}
              className="bg-dark-4 rounded-full px-4 py-1 text-light-3 cursor-pointer"
              onClick={() => setSearchValue(item.hashtag)}
            >
              #{item.hashtag}
            </p>
          ))}
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-8">
        <h2 className="h3-bold md:h2-bold">Popular Today</h2>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {showSearchResults ? (
          <SearchResults
            posts={searchedPosts?.documents}
            isFetching={isFetching}
          />
        ) : noPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of Posts</p>
        ) : (
          posts.pages.map((item, index) => (
            <GridList key={`page-${index}`} posts={item?.documents} />
          ))
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
