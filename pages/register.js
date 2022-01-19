import { useState } from "react";
import GuestLayout from "../components/layouts/guest/GuestLayout";

export default function Register() {
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

  return (
    <GuestLayout title="Register">
      <div className="w-full md:w-1/2 xl:w-1/3">
        <div className="mx-5 md:mx-10">
          <h2 className="uppercase">Create Your Account</h2>
          <h4 className="uppercase">Let&apos;s Roll</h4>
        </div>
        <form className="card mt-5 p-5 md:p-10" action="#">
          <div className="mb-5">
            <label className="label block mb-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="form-control"
              placeholder="John Doe"
            />
          </div>
          <div className="mb-5">
            <label className="label block mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="text"
              className="form-control"
              placeholder="example@example.com"
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
                value="12345"
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
          <div className="mb-5">
            <label className="label block mb-2" htmlFor="password">
              Repeat Password
            </label>
            <label className="form-control-addon-within">
              <input
                id="repeat_password"
                type={password2Shown ? "text" : "password"}
                className="form-control border-none"
                value="12345"
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
