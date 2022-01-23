import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import GuestLayout from "../components/layouts/guest/GuestLayout";
import { Store } from "../utils/Store";
import { useForm } from "react-hook-form";
import { getError } from "../utils/error";
import Cookies from "js-cookie";

export default function Register() {
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState(false);

  const togglePassword = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPasswordShown(!passwordShown);
    setPasswordIcon(!passwordIcon);
  };
  const [password2Shown, setPassword2Shown] = useState(false);
  const [password2Icon, setPassword2Icon] = useState(false);

  const togglePassword2 = () => {
    // When the handler is invoked
    // inverse the boolean state of passwordShown
    setPassword2Shown(!password2Shown);
    setPassword2Icon(!password2Icon);
  };

  useState(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        router.push(redirect || "/admin/dashboard");
      }
      router.push(redirect || "/user/dashboard");
    }
  });

  const registerHandler = async ({
    namaLengkap,
    email,
    password,
    ulangiPassword,
  }) => {
    if (password !== ulangiPassword) {
      alert("password tidak sama");
    }
    try {
      const { data } = await axios.post("/api/users/register", {
        namaLengkap,
        email,
        password,
      });
      dispatch({ type: "USER_LOGIN", payload: data });
      Cookies.set("userInfo", JSON.stringify(data));
      router.push("/user/detail");
    } catch (err) {
      getError(err);
    }
  };

  return (
    <GuestLayout title="Register">
      <div className="w-full md:w-1/2 xl:w-1/3">
        <div className="flex flex-col mx-5 md:mx-10 items-center">
          <h2 className="uppercase">Daftarkan akun anda</h2>
          <h4 className="uppercase">Silahkan mengisi form dibawah</h4>
        </div>
        <form
          className="card mt-5 p-5 md:p-10"
          onSubmit={handleSubmit(registerHandler)}
        >
          <div className="mb-5">
            <label className="label block mb-2" htmlFor="name">
              Nama Lengkap
            </label>
            <input
              {...register("namaLengkap", { required: true })}
              id="namaLengkap"
              type="text"
              className="form-control"
              autoFocus={!0}
            />
            <small className="block mt-2 invalid-feedback">
              {errors.namaLengkap?.type === "required" &&
                "Field diatas tidak boleh kosong"}
            </small>
          </div>
          <div className="mb-5">
            <label className="label block mb-2" htmlFor="email">
              Email
            </label>
            <input
              {...register("email", {
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              })}
              id="email"
              type="text"
              className="form-control"
            />
            <small className="block mt-2 invalid-feedback">
              {errors.email
                ? errors.email.type === "pattern"
                  ? "Email tidak valid"
                  : "Field diatas tidak boleh kosong"
                : ""}
            </small>
          </div>
          <div className="mb-5">
            <label className="label block mb-2" htmlFor="password">
              Password
            </label>
            <label className="form-control-addon-within">
              <input
                {...register("password", { required: true })}
                id="password"
                type={passwordShown ? "text" : "password"}
                className="form-control border-none"
              />
              <span className="flex items-center ltr:pr-4 rtl:pl-4">
                <button
                  type="button"
                  className={
                    passwordIcon
                      ? "btn-link text-primary dark:text-gray-600 las las-eye text-xl leading-none"
                      : "btn-link text-gray-600 dark:text-primary las las-eye-slash text-xl leading-none"
                  }
                  onClick={togglePassword}
                ></button>
              </span>
            </label>
            <small className="block mt-2 invalid-feedback">
              {errors.password?.type === "required" &&
                "Field diatas tidak boleh kosong"}
            </small>
          </div>
          <div className="mb-5">
            <label className="label block mb-2" htmlFor="password">
              Ulangi Password
            </label>
            <label className="form-control-addon-within">
              <input
                {...register("ulangiPassword", { required: true })}
                id="ulangiPassword"
                type={password2Shown ? "text" : "password"}
                className="form-control border-none"
              />
              <span className="flex items-center ltr:pr-4 rtl:pl-4">
                <button
                  type="button"
                  className={
                    password2Icon
                      ? "btn-link text-primary dark:text-gray-600 las las-eye text-xl leading-none"
                      : "btn-link text-gray-600 dark:text-primary las las-eye-slash text-xl leading-none"
                  }
                  onClick={togglePassword2}
                ></button>
              </span>
            </label>
            <small className="block mt-2 invalid-feedback">
              {errors.ulangiPassword?.type === "required" &&
                "Field diatas tidak boleh kosong"}
            </small>
          </div>
          <div className="flex">
            <button
              type="submit"
              className="btn btn_primary ltr:ml-auto rtl:mr-auto uppercase"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </GuestLayout>
  );
}
