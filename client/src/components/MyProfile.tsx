import React, { useEffect, useState } from "react";
import { useAuthContext, useUpdateProfileHook } from "../hooks/authHooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "react-query";
import { getProfile } from "../apiClient/authApi";
export interface IProfile {
  username?: string;
  email?: string;
  password?: string;
  profileImage?: FileList;
  coverImage?: FileList;
  profileImageUrl?: string;
  coverImageUrl?: string;
}
const MyProfile: React.FC = () => {
  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState<string>("");
  const { data } = useQuery({
    queryFn: getProfile,
    queryKey: ["get-profile"],
  });
  const profileSchema = z.object({
    username: z.optional(z.string()),
    email: z.optional(z.string().email({ message: "Invalid email address" })),
    password: z.optional(
      z.string().min(8, { message: "Password must be more than 8 characters" })
    ),
    profileImage: z.optional(z.instanceof(FileList)),
    coverImage: z.optional(z.instanceof(FileList)),
  });

  const {
    register,
    reset,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<IProfile>({ resolver: zodResolver(profileSchema) });

  const { currentUser } = useAuthContext();
  const { mutate, isLoading } = useUpdateProfileHook();

  const onSubmit = (data: IProfile) => {
    const formData = new FormData();
    if (data.username) formData.append("username", data.username);
    if (data.email) formData.append("email", data.email);
    if (data.password) formData.append("password", data.password);
    if (data.coverImage) {
      for (const file of data.coverImage) {
        formData.append("coverImage", file);
      }
    }
    if (data.profileImage) {
      for (const file of data.profileImage) {
        formData.append("profileImage", file);
      }
    }
    for (const [key, value] of formData.entries()) {
      console.log(`${key}`, `${value}`);
    }

    mutate(formData);
  };

  const watchAll = watch();

  useEffect(() => {
    console.log(watchAll);
  }, [watchAll]);

  useEffect(() => {
    reset(data);
    if (data && data.coverImageUrl) {
      setCoverImage(data.coverImageUrl);
    }
    if (data && data.profileImageUrl) {
      setProfileImage(data.profileImageUrl);
    }
  }, [data]);
  return (
    <div className="auth-form-container h-[90%] overflow-y-auto profile-form z-50">
      <div className="relative h-[7rem] w-full bg-black">
        <img
          src={coverImage}
          alt=""
          className="w-full h-full aspect-square object-cover"
        />
        <input
          {...register("coverImage")}
          type="file"
          name="coverImage"
          className="w-full h-full text-sm opacity-0 absolute inset-0"
        />
      </div>
      <span className="user-icon w-[6rem] h-[6rem] text-7xl -translate-y-1/2 translate-x-2 uppercase">
        <img
          src={profileImage}
          alt=""
          className="w-full h-full aspect-square object-cover"
        />
        <input
          {...register("profileImage")}
          type="file"
          accept="image/*"
          name="profileImage"
          className="w-full h-full text-sm opacity-0 absolute inset-0"
        />
      </span>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flxColStart gap-5 w-full"
      >
        <h1 className="font-bold text-xl mb-5">{currentUser.username}</h1>
        <div className="form-field">
          <label className="form-label" htmlFor="email">
            email <span className="text-red-700">*</span>
          </label>
          <input {...register("email")} type="email" className="form-input" />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="username">
            username <span className="text-red-700">*</span>
          </label>
          <input {...register("username")} type="text" className="form-input" />
          {errors.username && (
            <p className="form-error">{errors.username.message}</p>
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
          className="w-1/3 flxRowCenter py-2 primaryBgCol whiteText rounded-full sticky bottom-full self-end"
        >
          {isLoading ? "Loading..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default MyProfile;
