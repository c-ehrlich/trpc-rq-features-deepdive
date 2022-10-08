type LoadingDisplayProps = {
  thing: string;
};

function LoadingDisplay(props: LoadingDisplayProps) {
  return (
    <div className="mt-12 w-full text-center text-2xl text-white">
      Loading{props.thing && ` ${props.thing}`}...
    </div>
  );
}

export default LoadingDisplay;
