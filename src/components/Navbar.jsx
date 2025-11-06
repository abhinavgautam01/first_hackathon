export function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">HillConnect 🚍</h1>
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <button
              onClick={() => window.location.href = "/signin"}
              className="bg-white text-blue-600 px-3 py-1 rounded"
            >
              Sign In
            </button>
            <button
              onClick={() => window.location.href = "/signup"}
              className="bg-green-500 px-3 py-1 rounded"
            >
              Sign Up
            </button>
          </>
        ) : (
          <>
            <span>Welcome, {user.username}</span>
            <button
              onClick={onLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
