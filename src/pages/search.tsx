import React, { ReactNode, useEffect, useState } from "react";
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

function Search() {
  const [inputVal, setInputVal] = useState("");
  const [text, setText] = useState("");

  const queryOptions: PostListProps = {
    type: "search",
    queryKey: { text },
  };

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

  useEffect(() => {
    if (text.length > 0) {
      refetch();
    }
  }, [text, refetch]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setText(inputVal);
  }

  const showGetMorePostsButton =
    data?.pages[0]?.posts && data.pages[0].posts.length > 1;
  const nothingFound =
    data?.pages[0]?.posts && data.pages[0].posts.length === 0 && !isFetching;
  const haventSearched = !data && !isFetching && !isError;

  return (
    <>
      <SearchInput
        text={inputVal}
        setText={setInputVal}
        handleSearch={handleSearch}
      />
      <LoadingAndErrorWrapper
        isFetching={isFetching}
        isError={isError}
        error={JSON.stringify(error)}
      >
        <PostsInfiniteListUI>
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
          {nothingFound && (
            <div className="text-center text-xl text-white">
              Search for &quot;{text}&quot; did not return anything
            </div>
          )}
        </PostsInfiniteListUI>
        {showGetMorePostsButton && (
          <GetMorePostsButton
            hasNextPage={hasNextPage || false}
            fetchNextPage={fetchNextPage}
            fetchStatus={fetchStatus}
          />
        )}
      </LoadingAndErrorWrapper>
    </>
  );
}

interface SearchInputProps {
  text: string;
  handleSearch: (e: React.FormEvent) => void;
  setText: (text: string) => void;
}

function SearchInput(props: SearchInputProps) {
  return (
    <form onSubmit={props.handleSearch} className="flex gap-4 py-2">
      <input
        className="flex-1 rounded-md bg-slate-400 p-2 placeholder-black/40"
        value={props.text}
        onChange={(e) => props.setText(e.target.value)}
        placeholder="Please search for something"
      />
      <button className="rounded-full border border-slate-700 bg-blue-500 px-8 py-3 text-xl text-white hover:bg-slate-900/70">
        Search
      </button>
    </form>
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
