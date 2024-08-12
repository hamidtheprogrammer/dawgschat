import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IAuth, authSchema } from "./Login";
import { useRegisterHook } from "../hooks/authHooks";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  const { mutate, isLoading, error } = useRegisterHook();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<IAuth>({ resolver: zodResolver(authSchema) });

  const watchData = watch();

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

  return (
    <div className="w-full h-full flxColCenter items-center header-margin">
      <section className="auth-form-container">
        <h1 className="relative text-center font-bold uppercase">Register</h1>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flxColStart gap-5 w-full"
          >
            <h1 className="font-bold text-xl mb-5">Welcome</h1>
            <div className="form-field">
              <label className="form-label" htmlFor="">
                username <span className="text-red-700">*</span>
              </label>
              <input
                {...register("username")}
                type="text"
                className="form-input"
              />
              {errors.username && (
                <p className="form-error">{errors.username.message}</p>
              )}
            </div>
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
              {isLoading ? "Loading..." : " Register"}
            </button>
            <p>
              Already a member?{" "}
              <Link
                className="text-black/75 underline hover:opacity-65"
                to={"/login"}
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Register;
