import { FetchStatus } from "@tanstack/react-query";

type GetMostPostsButtonProps = {
  hasNextPage: boolean;
  fetchNextPage: () => void;
  fetchStatus: FetchStatus;
};

function GetMorePostsButton(props: GetMostPostsButtonProps) {
  return (
    <button
      className="mb-12 bg-slate-900 px-3 py-2 text-white hover:bg-slate-900/70"
      disabled={!props.hasNextPage || props.fetchStatus !== "idle"}
      onClick={() => props.fetchNextPage()}
    >
      {props.hasNextPage ? "Next Page" : "(no more pages)"}
    </button>
  );
}

export default GetMorePostsButton;
