type LoadingDisplayProps = {
  thing: string;
};

function LoadingDisplay(props: LoadingDisplayProps) {
  return (
    <div className="w-full text-center text-2xl text-white">
      Loading{props.thing && ` ${props.thing}`}...
    </div>
  );
}

export default LoadingDisplay;
