/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useUser, useAuth as useClerkAuth, useClerk } from "@clerk/react";
import {
  AuthAPI,
  setAccessToken,
  setClerkTokenGetter,
} from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Clerk State
  const {
    user: clerkUser,
    isLoaded: isClerkLoaded,
    isSignedIn: isClerkSignedIn,
  } = useUser();
  const { getToken, signOut: clerkSignOut } = useClerkAuth();
  const { openSignIn, openSignUp } = useClerk();

  // Legacy User State (Fallback / Dual-Auth)
  const [legacyUser, setLegacyUser] = useState(() => {
    try {
      const stored = localStorage.getItem("curated_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [legacyLoading, setLegacyLoading] = useState(false);

  // Sync Clerk Token to Axios Client
  useEffect(() => {
    if (isClerkSignedIn && getToken) {
      setClerkTokenGetter(() => getToken());
    } else {
      setClerkTokenGetter(null);
    }
  }, [isClerkSignedIn, getToken]);

  // Attempt silent refresh on mount if legacy user is cached and Clerk is not signed in
  useEffect(() => {
    if (legacyUser && !isClerkSignedIn) {
      AuthAPI.refresh()
        .then((res) => {
          if (res?.accessToken) {
            setAccessToken(res.accessToken);
          }
        })
        .catch(() => {
          setLegacyUser(null);
          localStorage.removeItem("curated_user");
        });
    }
  }, [isClerkSignedIn, legacyUser]);

  // Map Clerk User to Curated Commerce User shape
  const activeUser = useMemo(() => {
    if (isClerkSignedIn && clerkUser) {
      const primaryEmail =
        clerkUser.primaryEmailAddress?.emailAddress ||
        clerkUser.emailAddresses?.[0]?.emailAddress ||
        "";

      // Detect admin/editor role from Clerk public metadata or known admin email
      const role =
        clerkUser.publicMetadata?.role ||
        (primaryEmail.toLowerCase() === "admin@curated.com"
          ? "ADMIN"
          : "CUSTOMER");

      const name =
        clerkUser.fullName ||
        clerkUser.firstName ||
        primaryEmail.split("@")[0] ||
        "Member";

      return {
        id: clerkUser.id,
        name,
        email: primaryEmail,
        role,
        imageUrl: clerkUser.imageUrl,
        isClerk: true,
      };
    }
    return legacyUser;
  }, [isClerkSignedIn, clerkUser, legacyUser]);

  // Compatible Login Method
  const login = async (email, password) => {
    // If called with no arguments, open Clerk Sign In modal
    if (!email && openSignIn) {
      openSignIn();
      return { success: true };
    }

    setLegacyLoading(true);
    try {
      const res = await AuthAPI.login({ email, password });
      if (res?.accessToken) {
        setAccessToken(res.accessToken);
        setLegacyUser(res.user);
        localStorage.setItem("curated_user", JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      return { success: false, message: "Invalid response from server" };
    } catch (err) {
      return {
        success: false,
        message: err.message || err.error || "Failed to sign in",
      };
    } finally {
      setLegacyLoading(false);
    }
  };

  // Compatible Register Method
  const register = async (userData) => {
    // If called with no arguments, open Clerk Sign Up modal
    if (!userData && openSignUp) {
      openSignUp();
      return { success: true };
    }

    setLegacyLoading(true);
    try {
      const res = await AuthAPI.register(userData);
      if (res?.success) {
        return await login(userData.email, userData.password);
      }
      return { success: false, message: res?.message || "Registration failed" };
    } catch (err) {
      return {
        success: false,
        message: err.message || err.error || "Registration failed",
      };
    } finally {
      setLegacyLoading(false);
    }
  };

  // Logout clears both Clerk and Legacy session
  const logout = async () => {
    if (isClerkSignedIn && clerkSignOut) {
      try {
        await clerkSignOut();
      } catch (err) {
        console.warn("Clerk sign out notice:", err);
      }
    }
    setAccessToken(null);
    setLegacyUser(null);
    localStorage.removeItem("curated_user");
  };

  const isEditorOrAdmin =
    !!activeUser &&
    (activeUser.role === "ADMIN" ||
      activeUser.role === "EDITOR" ||
      activeUser.email?.toLowerCase() === "admin@curated.com");

  const isLoading = !isClerkLoaded || legacyLoading;

  return (
    <AuthContext.Provider
      value={{
        user: activeUser,
        loading: isLoading,
        login,
        register,
        logout,
        isEditorOrAdmin,
        isAuthenticated: !!activeUser,
        isClerkSignedIn,
        openClerkSignIn: openSignIn,
        openClerkSignUp: openSignUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
