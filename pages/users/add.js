import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AppLayout from "../../components/layouts/app/AppLayout";
import { Store } from "../../utils/Store";
import { getError } from "../../utils/error";
import dynamic from "next/dynamic";
import Image from "next/image";

function UsersAdd() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
    setValue: setValue2,
  } = useForm();

  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
    setPasswordIcon(!passwordIcon);
  };

  const [gambar, setGambar] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnTambahGambar, setBtnTambahGambar] = useState(false);
  const [btnHapusGambar, setBtnHapusGambar] = useState(false);
  const [pesanImage, setPesanImage] = useState(false);
  const [pesan, setPesan] = useState(false);
  const [user, setUser] = useState([]);
  // const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }
  }, []);

  const imageHandler = async ({ userId, gambar }) => {
    try {
      setLoadingImage(true);
      const { data } = await axios.put(
        "/api/users",
        {
          userId,
          gambar,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      if (data) {
        setPesanImage(true);
        setLoadingImage(false);
        setTimeout(async () => {
          setPesanImage(false);
          setBtnTambahGambar(false);
          setBtnHapusGambar(true);
          setGambar(data.user.image);
        }, 1500);
      }
    } catch (err) {
      alert(getError(err));
      setLoadingImage(false);
    }
  };

  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    // console.log(bodyFormData);

    // if (file && file.type.substr(0, 5) === "image") {
    //   setGambar(file);
    //   setValue2("gambar", file);
    // } else {
    //   setGambar(false);
    // }

    try {
      setLoadingImage(true);
      const { data } = await axios.post("/api/users/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (data) {
        setPesanImage(true);
        setLoadingImage(false);
        setTimeout(async () => {
          setPesanImage(false);
        }, 1500);
        setGambar(data.public_id);
        setValue2("gambar", data.public_id);
        setBtnTambahGambar(true);
      }
    } catch (err) {
      alert(getError(err));
      setLoadingImage(false);
    }
  };

  const userHandler = async ({ username, email, password, role }) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/users",
        {
          username,
          email,
          password,
          role,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (data) {
        setPesan(true);
        setLoading(false);
        setTimeout(async () => {
          setPesan(false);
          setUser(data);
          setValue2("userId", data._id);
        }, 1500);
      }
    } catch (err) {
      alert(getError(err));
      setLoading(false);
    }
  };

  return (
    <AppLayout title="User">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb">
        <h1>User</h1>
        <ul>
          <li>
            {userInfo && userInfo.role == 1 && <span>Superadmin</span>}
            {userInfo && userInfo.role == 2 && <span>Admin</span>}
            {userInfo && userInfo.role == 3 && <span>Surveyor</span>}
            {userInfo && userInfo.role == 4 && <span>Operator</span>}
          </li>
          <li className="divider las las-arrow-right"></li>
          <li>Tambah User</li>
        </ul>
      </section>

      <div className="lg:flex lg:-mx-4">
        <div className="lg:w-1/2 xl:w-3/4 lg:px-4">
          <div className="card p-5">
            <nav className="tab-nav mb-5">
              <button className="nav-link h5 uppercase active">
                Form Tambah
              </button>
            </nav>
            <form onSubmit={handleSubmit(userHandler)}>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  className="form-control"
                  {...register("username", { required: true })}
                  autoFocus={!0}
                />
                <small className="block my-2 invalid-feedback">
                  {errors.username?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  className="form-control"
                  {...register("email", { required: true })}
                />
                <small className="block my-2 invalid-feedback">
                  {errors.email?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>

              <div className="mb-5">
                <label className="label block mb-2" htmlFor="password">
                  Password
                </label>
                <label className="form-control-addon-within">
                  <input
                    {...register("password", { required: true })}
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
                <small className="block my-2 invalid-feedback">
                  {errors.password?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>

              <div className="mb-5">
                <label className="label block mb-2" htmlFor="role">
                  Hak Akses
                </label>
                <div className="custom-select">
                  <select
                    className="form-control"
                    {...register("role", { required: true })}
                  >
                    <option value="">Pilih hak akses</option>
                    <option value={2}>Admin</option>
                    <option value={3}>Surveyor</option>
                    <option value={4}>Operator</option>
                  </select>
                  <div className="custom-select-icon las las-caret-down"></div>
                </div>
                <small className="block my-2 invalid-feedback">
                  {errors.role?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>

              <div className="flex items-center">
                <button
                  className="btn btn_primary mt-5 ltr:mr-2 rtl:ml-2 uppercase"
                  type="submit"
                >
                  {loading ? (
                    <span className="pl-3">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  ) : (
                    <span>{user && user._id ? "Ubah" : "Simpan"}</span>
                  )}
                </button>
                {pesan && (
                  <span className="ml-2">
                    <svg
                      className="animate-bounce"
                      fill="none"
                      height="26"
                      viewBox="0 0 26 26"
                      width="26"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.5 14L11.1 16.6"
                        stroke="#4F4F4F"
                        strokeLinecap="round"
                        strokeMiterlimit="10"
                        strokeWidth="2"
                      />
                      <path
                        d="M18.2 10L11.6 16.6"
                        stroke="#4F4F4F"
                        strokeLinecap="round"
                        strokeMiterlimit="10"
                        strokeWidth="2"
                      />
                      <path
                        d="M13 25C19.6274 25 25 19.6274 25 13C25 6.37258 19.6274 1 13 1C6.37258 1 1 6.37258 1 13C1 19.6274 6.37258 25 13 25Z"
                        stroke="#4F4F4F"
                        strokeLinecap="round"
                        strokeMiterlimit="10"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
        {user && user._id && (
          <div className="lg:w-1/2 xl:w-1/4 lg:px-4 pt-5 lg:pt-0">
            <div className="card card_column">
              <nav className="tab-nav mx-5 mt-5">
                <button className="nav-link h5 uppercase active">Foto</button>
              </nav>
              <div className="image">
                {gambar && (
                  <div className="aspect-w-4 aspect-h-3">
                    <Image
                      src={gambar}
                      alt=""
                      layout="fill"
                      objectFit="cover"
                      quality={30}
                    />
                  </div>
                )}
              </div>
              <div className="px-5 pb-5">
                <form onSubmit={handleSubmit2(imageHandler)}>
                  <input hidden {...register2("userId", { required: true })} />
                  <label className="input-group text-base font-normal">
                    <div className="file-name input-addon input-addon-prepend input-group-item w-full overflow-x-hidden">
                      {gambar && gambar}
                    </div>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      {...register2("gambar")}
                      onChange={uploadHandler}
                    />
                    <div className="input-group-item btn btn_primary uppercase">
                      {loadingImage ? (
                        <span className="pl-3">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </span>
                      ) : (
                        <span>{gambar ? "Ubah" : "Cari"}</span>
                      )}
                    </div>
                  </label>
                  <small className="block my-2 invalid-feedback">
                    {errors2.gambar?.type === "required" &&
                      "Field diatas tidak boleh kosong"}
                  </small>
                  <div className="mt-5 flex items-center">
                    {btnTambahGambar && (
                      <button
                        className="btn btn_primary ltr:mr-2 rtl:ml-2 uppercase"
                        type="submit"
                      >
                        Simpan
                      </button>
                    )}

                    {btnHapusGambar && (
                      <a
                        className="btn btn_outlined btn_danger uppercase cursor-pointer"
                        onClick={() => hapusGambarHandler(gambar, user._id)}
                      >
                        Hapus
                      </a>
                    )}

                    {pesanImage && (
                      <span className="ml-2">
                        <svg
                          className="animate-bounce"
                          fill="none"
                          height="26"
                          viewBox="0 0 26 26"
                          width="26"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.5 14L11.1 16.6"
                            stroke="#4F4F4F"
                            strokeLinecap="round"
                            strokeMiterlimit="10"
                            strokeWidth="2"
                          />
                          <path
                            d="M18.2 10L11.6 16.6"
                            stroke="#4F4F4F"
                            strokeLinecap="round"
                            strokeMiterlimit="10"
                            strokeWidth="2"
                          />
                          <path
                            d="M13 25C19.6274 25 25 19.6274 25 13C25 6.37258 19.6274 1 13 1C6.37258 1 1 6.37258 1 13C1 19.6274 6.37258 25 13 25Z"
                            stroke="#4F4F4F"
                            strokeLinecap="round"
                            strokeMiterlimit="10"
                            strokeWidth="2"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(UsersAdd), { ssr: false });
