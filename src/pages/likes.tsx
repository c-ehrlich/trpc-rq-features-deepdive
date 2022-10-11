import AuthGuard from "../components/AuthGuard";

function LikesPage() {
  return (
    <AuthGuard>
      <div>likes</div>
    </AuthGuard>
  );
}

export default LikesPage;
