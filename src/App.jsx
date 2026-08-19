import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

import Layout from "./components/Layout";
import NoteEditor from "./pages/NoteEditor/NoteEditor";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedPage from "./pages/ProtectedPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { getMe, syncUser, logoutRequest } from "./api/auth";
import FoldersPage from "./pages/folderspage";
import Notes from "./pages/Notes/Notes";
import Favorites from "./pages/favorites";
import FlashcardViewer from "./components/FlashcardViewer/FlashcardViewer";

/*
  Wraps the authenticated app layout with ProtectedRoute.

  When the user is logged out, ProtectedRoute prevents Layout
  from rendering, so the sidebar is never shown.
*/
function AuthenticatedLayout({ user, onLogout, authError, isLoading }) {
  return (
    <ProtectedRoute user={user} isLoading={isLoading}>
      <Layout
        user={user}
        onLogout={onLogout}
        authError={authError}
      />
    </ProtectedRoute>
  );
}

function App() {
  // The user row from OUR database.
  // null = nobody is logged in.
  const [user, setUser] = useState(null);

  // True until our own "am I logged in?" cookie check has answered.
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Set if Auth0 login worked but we couldn't get the matching
  // row from our database.
  const [authError, setAuthError] = useState(null);

  // Auth0's hook.
  const {
    isAuthenticated: isAuth0User,
    user: auth0User,
    isLoading: isAuth0Loading,
    getAccessTokenSilently,
    logout: auth0Logout,
  } = useAuth0();

  /*
    Don't redirect while any authentication step is still loading.

    1. Our own cookie check
    2. Auth0 restoring its session
    3. Syncing an Auth0 user with our database
  */
  const isLoading =
    isCheckingSession ||
    isAuth0Loading ||
    (isAuth0User && !user && !authError);

  // ---------------------------------------------------------
  // 1. On page load: check if our JWT cookie is valid
  // ---------------------------------------------------------
  useEffect(() => {
    async function checkIfLoggedIn() {
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setIsCheckingSession(false);
      }
    }

    checkIfLoggedIn();
  }, []);

  // ---------------------------------------------------------
  // 2. After Auth0 login: sync the user with our database
  // ---------------------------------------------------------
  useEffect(() => {
    if (!isAuth0User || !auth0User) return;

    async function saveAuth0User() {
      try {
        const token = await getAccessTokenSilently();

        const dbUser = await syncUser(token, {
          username:
            auth0User.nickname ||
            auth0User.email?.split("@")[0],
        });

        setUser(dbUser);
        setAuthError(null);
      } catch (error) {
        setAuthError(
          `Signed in with Auth0, but we couldn't load your account: ${error.message}`
        );
      }
    }

    saveAuth0User();
  }, [
    isAuth0User,
    auth0User,
    getAccessTokenSilently,
  ]);

  // ---------------------------------------------------------
  // 3. Logging out
  // ---------------------------------------------------------
  async function handleLogout() {
    try {
      await logoutRequest();
    } catch (error) {
      console.error("Logout failed:", error.message);
    }

    setUser(null);
    setAuthError(null);

    if (isAuth0User) {
      auth0Logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    }
  }

  return (
    <Routes>
      {/* PUBLIC ROUTES: These do NOT use Layout, so no sidebar appears. */}

      <Route
        path="/login"
        element={<Login setUser={setUser} />}
      />

      <Route
        path="/signup"
        element={<Signup setUser={setUser} />}
      />

      {/* AUTHENTICATED APP :Everything inside this route gets the sidebar/layout. */}

      <Route
        element={
          <AuthenticatedLayout
            user={user}
            onLogout={handleLogout}
            authError={authError}
            isLoading={isLoading}
          />
        }
      >
        <Route
          path="/notes"
          element={<Notes />}
        />

        <Route
          path="/note/:id/edit"
          element={<NoteEditor />}
        />

        <Route
          path="/note/flashcards"
          element={<FlashcardViewer />}
        />

        <Route
          path="/favorites"
          element={<Favorites />}
        />

        <Route
          path="/folders"
          element={<FoldersPage />}
        />

        <Route
          path="/protected"
          element={<ProtectedPage user={user} />}
        />
      </Route>

      <Route
        path="*"
        element={<NotFoundPage />}
      />
    </Routes>
  );
}

export default App;