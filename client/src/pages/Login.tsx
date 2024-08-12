import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext, useLoginHook } from "../hooks/authHooks";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export interface IAuth {
  username?: string;
  email: string;
  password: string;
}

export const authSchema = z.object({
  username: z.optional(z.string()),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be more than 8 characters" }),
});

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<IAuth>({ resolver: zodResolver(authSchema) });

  const { currentUser } = useAuthContext();
  const navigate = useNavigate();

  const watchData = watch();

  const { mutate, isLoading, error } = useLoginHook();

  const onSubmit = (data: IAuth) => {
    mutate(data);
  };

  useEffect(() => {
    if (error && error.body) {
      for (const [key, value] of Object.entries(error.body)) {
        if (Object.keys(watchData).includes(key)) {
          setError(key as keyof typeof watchData, {
            type: "manual",
            message: value,
          });
        }
      }
    }
  }, [error]);

  useEffect(() => {
    if (currentUser.isAuthenticated) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  return (
    <div className="w-full h-full flxColCenter items-center header-margin">
      <section className="auth-form-container">
        <h1 className="relative text-center font-bold uppercase">Login</h1>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flxColStart gap-5 w-full"
          >
            <h1 className="font-bold text-xl mb-5">Welcome</h1>
            <div className="form-field">
              <label className="form-label" htmlFor="">
                email <span className="text-red-700">*</span>
              </label>
              <input
                {...register("email")}
                type="text"
                className="form-input"
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="">
                password <span className="text-red-700">*</span>
              </label>
              <input
                {...register("password")}
                type="password"
                className="form-input"
              />
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>
            <button
              disabled={isLoading}
              type="submit"
              className="w-full flxRowCenter py-2 primaryBgCol whiteText rounded-sm mt-5"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
            <p>
              Dont have an account?
              <Link
                className="text-black/75 underline hover:opacity-65"
                to={"/register"}
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
