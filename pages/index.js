import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import GuestLayout from "../components/layouts/guest/GuestLayout";
import { Store } from "../utils/Store";

export default function Home() {
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
    setPasswordIcon(!passwordIcon);
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      router.push("/admin/dashboard");
    } else if (userInfo && !userInfo.isAdmin) {
      router.push("/user/dashboard");
    }
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });
      dispatch({ type: "USER_LOGIN", payload: data });

      Cookies.set("userInfo", JSON.stringify(data));
      if (data.isAdmin) {
        router.push("/admin/dashboard");
      }
      alert("tes");
    } catch (err) {
      alert(err.response.data ? err.response.data.message : err.message);
    }
  };

  return (
    <GuestLayout title="Login">
      <div className="w-full md:w-1/2 xl:w-1/3">
        <div className="flex flex-col mx-5 md:mx-10 items-center">
          <h2 className="uppercase">Ingin masuk aplikasi?</h2>
          <h4 className="uppercase">Silahkan login</h4>
        </div>
        <form className="card mt-5 p-5 md:p-10" onSubmit={loginHandler}>
          <div className="mb-5">
            <label className="label block mb-2" htmlFor="email">
              Email
            </label>
            <input
              autoFocus
              id="email"
              type="email"
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="label block mb-2" htmlFor="password">
              Password
            </label>
            <label className="form-control-addon-within">
              <input
                id="password"
                type={passwordShown ? "text" : "password"}
                className="form-control border-none"
                onChange={(e) => setPassword(e.target.value)}
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
          </div>
          <div className="flex items-center">
            {/* <a href="auth-forgot-password.html" className="text-sm uppercase">
              Lupa Password?
            </a> */}
            <button
              type="submit"
              className="btn btn_primary ltr:ml-auto rtl:mr-auto uppercase"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </GuestLayout>
  );
}
