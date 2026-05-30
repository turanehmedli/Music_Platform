import React from "react";
import { useForm } from "@tanstack/react-form";
import { NavLink, useNavigate } from "react-router";
import {
  UserPlus,
  User,
  UserCheck,
  AtSign,
  Mail,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";

const Register = () => {
  const navigate = useNavigate();
  const { setAccessToken, setRefreshToken, setUser, setEmail } = useAuthStore();
  const form = useForm({
    defaultValues: {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      console.log("User input:", value);

      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emilys",
          password: "emilyspass",
        }),
      });
      
       const data = await res.json();

      if (data.accessToken) {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setEmail(value.email); 
        setUser({
          id: data.id?.toString() || "",
          name: `${value.firstname} ${value.lastname}`,
          handle: value.username,
          bio: "",
          follower_count: 0,
          followee_count: 0,
          track_count: 0,
          is_verified: false,
          profile_picture: {
            "150x150": data.image || "",
            "480x480": data.image || "",
            "1000x1000": data.image || "",
          },
        });

        navigate("/");
      }
    },
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const errorUserName = (value: string) => {
    if (!value.trim()) return "User name is required";
    if (value.trim().length < 3)
      return "User Name must be at least 3 characters";
  };

  const errorFirstName = (value: string) => {
    if (!value.trim()) return "First name is required";
    if (value.trim().length < 3)
      return "First name must be at least 3 characters";
  };

  const errorLastName = (value: string) => {
    if (!value.trim()) return "Last name is required";
    if (value.trim().length < 3)
      return "Last name must be at least 3 characters";
  };

  const errorEmail = (value: string) => {
    if (!value.trim()) return "Email is required";
    if (!emailRegex.test(value)) return "Invalid email format";
  };

  const errorPassword = (value: string) => {
    if (value.trim().length < 8)
      return "Password must be at least 8 characters";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center  px-4 py-12">
      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border  backdrop-blur-xl shadow-2xl px-8 py-10">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Fill in the details below to get started
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="flex flex-col gap-4"
          >
            <form.Field
              validators={{ onBlur: ({ value }) => errorUserName(value) }}
              name="username"
            >
              {(field) => (
                <FieldWrapper
                  label="Username"
                  icon={<AtSign className="w-4 h-4" />}
                  error={
                    field.state.meta.isTouched
                      ? field.state.meta.errors?.[0]
                      : undefined
                  }
                >
                  <input
                    className={fieldClass(!!field.state.meta.errors?.[0])}
                    placeholder="Username"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="username"
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <div className="grid grid-cols-2 gap-3">
              <form.Field
                validators={{ onBlur: ({ value }) => errorFirstName(value) }}
                name="firstname"
              >
                {(field) => (
                  <FieldWrapper
                    label="First name"
                    icon={<User className="w-4 h-4" />}
                    error={
                      field.state.meta.isTouched
                        ? field.state.meta.errors?.[0]
                        : undefined
                    }
                  >
                    <input
                      className={fieldClass(!!field.state.meta.errors?.[0])}
                      placeholder="First Name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      autoComplete="given-name"
                    />
                  </FieldWrapper>
                )}
              </form.Field>

              <form.Field
                validators={{ onBlur: ({ value }) => errorLastName(value) }}
                name="lastname"
              >
                {(field) => (
                  <FieldWrapper
                    label="Last name"
                    icon={<UserCheck className="w-4 h-4" />}
                    error={
                      field.state.meta.isTouched
                        ? field.state.meta.errors?.[0]
                        : undefined
                    }
                  >
                    <input
                      className={fieldClass(!!field.state.meta.errors?.[0])}
                      placeholder="Last Name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      autoComplete="family-name"
                    />
                  </FieldWrapper>
                )}
              </form.Field>
            </div>

            <form.Field
              validators={{ onBlur: ({ value }) => errorEmail(value) }}
              name="email"
            >
              {(field) => (
                <FieldWrapper
                  label="Email address"
                  icon={<Mail className="w-4 h-4" />}
                  error={
                    field.state.meta.isTouched
                      ? field.state.meta.errors?.[0]
                      : undefined
                  }
                >
                  <input
                    type="email"
                    className={fieldClass(!!field.state.meta.errors?.[0])}
                    placeholder="Email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="email"
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <form.Field
              validators={{ onBlur: ({ value }) => errorPassword(value) }}
              name="password"
            >
              {(field) => (
                <FieldWrapper
                  label="Password"
                  icon={<Lock className="w-4 h-4" />}
                  error={
                    field.state.meta.isTouched
                      ? field.state.meta.errors?.[0]
                      : undefined
                  }
                >
                  <input
                    type="password"
                    className={fieldClass(!!field.state.meta.errors?.[0])}
                    placeholder="Password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    autoComplete="new-password"
                  />
                </FieldWrapper>
              )}
            </form.Field>

            <button
              type="submit"
              className="mt-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all duration-150 text-white font-semibold text-base tracking-wide shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Create account
            </button>

            <p className="text-center text-sm text-zinc-500 mt-1">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
              >
                Sign in
              </NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

const fieldClass = (hasError: boolean) =>
  [
    "w-full pl-9 pr-3.5 py-2.5 rounded-lg text-sm border border-zinc-500",
    " transition-all duration-150 outline-none placeholder:text-zinc-600",
    "focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500",
    hasError
      ? "border-red-500/70 focus:ring-red-500/30 focus:border-red-500"
      : "border-white/10 hover:border-white/20",
  ].join(" ");

const FieldWrapper = ({
  label,
  icon,
  error,
  labelRight,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  labelRight?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <label className="text-xs font-medium text-zinc-400 tracking-wide uppercase">
        {label}
      </label>
      {labelRight}
    </div>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
          {icon}
        </span>
      )}
      {children}
    </div>
    {error && (
      <p className="text-xs text-red-400 flex items-center gap-1">
        <AlertCircle className="w-3 h-3 shrink-0" />
        {error}
      </p>
    )}
  </div>
);

export default Register;
