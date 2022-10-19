import React, { ReactNode, useState } from "react";
import AuthedPage from "../components/AuthedPage";
import ErrorDisplay from "../components/ErrorDisplay";
import LoadingDisplay from "../components/LoadingDisplay";
import GetMorePostsButton from "../modules/post2/GetMorePostsButton";
import useGetPostsPaginated from "../modules/post2/hooks/useGetPostsPaginated";
import {
  PostInifiniteListGroup,
  PostInList,
  PostListProps,
  PostsInfiniteListUI,
} from "../modules/post2/PostsInfinite";

function SearchPage() {
  return (
    <AuthedPage>
      <Search />
    </AuthedPage>
  );
}

export default SearchPage;

// TODO: next, refactor this shit AGAIN
// EITHER figure out of there is a way to pass JUST a queryKey
// OR accept that search is different from other list things, and figure out
//    a good pattern for what is shared between search and other infinite queries

function Search() {
  const [text, setText] = useState("");

  const queryOptions: PostListProps = { type: "search", queryKey: { text } };

  const {
    data,
    isFetching,
    isError,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
    fetchStatus,
  } = useGetPostsPaginated(queryOptions);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    refetch();
  }

  return (
    <>
      <form onSubmit={handleSearch} className="mt-2 flex gap-2">
        <input
          className=" flex-1 border border-black px-3 py-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="bg-slate-50 px-3 py-2 hover:bg-slate-200">
          Search
        </button>
      </form>
      <LoadingAndErrorWrapper
        isFetching={isFetching}
        isError={isError}
        error={JSON.stringify(error)}
      >
        <PostsInfiniteListUI>
          {/* TODO: next, make a ui thing for when a search returns 0 results */}
          {data?.pages.map((page, index) => (
            <PostInifiniteListGroup key={`page-${index}`}>
              {page.posts.map((post) => (
                <PostInList
                  key={post.id}
                  post={post}
                  queryOptions={queryOptions}
                />
              ))}
            </PostInifiniteListGroup>
          ))}
        </PostsInfiniteListUI>
        <GetMorePostsButton
          hasNextPage={hasNextPage || false}
          fetchNextPage={fetchNextPage}
          fetchStatus={fetchStatus}
        />
      </LoadingAndErrorWrapper>
    </>
  );
}

function LoadingAndErrorWrapper(props: {
  isFetching: boolean;
  isError: boolean;
  error: string;
  children: ReactNode;
}) {
  if (props.isFetching) {
    return <LoadingDisplay thing="search" />;
  }

  if (props.isError) {
    return <ErrorDisplay error={JSON.stringify(props.error)} />;
  }

  return <>{props.children}</>;
}
