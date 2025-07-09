import { supabase } from "../supabase/client";
import AuthService from "./AuthService";

interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const authEventBus = {
  listeners: {} as Record<string, Array<Function>>,

  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  },

  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(
        (cb) => cb !== callback
      );
    }
  },

  emit(event: string, data?: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  },
};

export const registerUser = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  try {
    const { email, password, name } = credentials;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message:
        "Registration successful! Please check your email for confirmation.",
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Registration failed. Please try again.",
    };
  }
};

export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const { email, password } = credentials;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    try {
      await AuthService.initializeUser();
      console.log("User initialized successfully");
    } catch (initError: any) {
      console.error("Error initializing user:", initError);
    }

    authEventBus.emit("login", data.user);

    return {
      success: true,
      message: "Login successful!",
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Login failed. Please try again.",
    };
  }
};

export const logoutUser = async (): Promise<AuthResponse> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    authEventBus.emit("logout");

    return {
      success: true,
      message: "Logout successful!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Logout failed. Please try again.",
    };
  }
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  console.log("current userr ->", data);

  return data.user;
};

export const loginWithGithub = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    console.error("GitHub login error:", error);
    throw error;
  }
};
