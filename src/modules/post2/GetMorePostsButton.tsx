import { FetchStatus } from "@tanstack/react-query";

type GetMostPostsButtonProps = {
  hasNextPage: boolean;
  fetchNextPage: () => void;
  fetchStatus: FetchStatus;
};

function GetMorePostsButton(props: GetMostPostsButtonProps) {
  return (
    <button
      className="bg-slate-200 px-3 py-2"
      disabled={!props.hasNextPage || props.fetchStatus !== "idle"}
      onClick={() => props.fetchNextPage()}
    >
      {props.hasNextPage ? "Next Page" : "(no more pages)"}
    </button>
  );
}

export default GetMorePostsButton;
