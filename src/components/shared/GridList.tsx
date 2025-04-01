import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

type GridListProps = {
  posts: Models.Document[] | undefined;
  showUser?: boolean;
  showStats?: boolean;
};

const GridList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridListProps) => {
  const { user } = useContext(AuthContext);

  return (
    <ul className="grid-container">
      {posts?.map((post) => {
        return (
          <li key={post.$id} className="relative group">
            <Link to={`/posts/${post.$id}`} className="grid-post_link">
              <img
                src={post.imageUrl}
                alt="post"
                className="h-full w-full object-cover"
              />
            </Link>

            <div
              className={`${
                (showUser || showStats) &&
                "group-hover:flex md:hidden transition"
              } `}
            >
              <div className="grid-post_user">
                {showUser && (
                  <div className="flex items-center gap-2 flex-1">
                    <img
                      src={post.creator.imageUrl}
                      alt="creator"
                      className="w-8 h-8 rounded-full object-cover aspect-square"
                    />
                    <p className="line-clamp-1">{post.creator.name}</p>
                  </div>
                )}

                {showStats && (
                  <PostStats
                    post={post}
                    userId={user.id}
                    className={`${!showUser && "w-full"}`}
                  />
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default GridList;
