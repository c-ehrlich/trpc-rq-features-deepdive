type ErrorDisplayProps = {
  error: string;
};

function ErrorDisplay(props: ErrorDisplayProps) {
  return (
    <div className="mt-12 w-full text-center text-2xl text-white">
      Error: {props.error}
    </div>
  );
}

export default ErrorDisplay;
