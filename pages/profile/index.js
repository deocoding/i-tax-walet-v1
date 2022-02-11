import axios from "axios";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AppLayout from "../../components/layouts/app/AppLayout";
import { Store } from "../../utils/Store";
import SkeletonUbahPass from "../../components/skeletons/SkeletonUbahPass";

function Profile() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const [user, setUser] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
    setValue: setValue2,
  } = useForm();

  const {
    register: register3,
    formState: { errors: errors3 },
    handleSubmit: handleSubmit3,
    setValue: setValue3,
  } = useForm();

  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordIcon, setPasswordIcon] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
    setPasswordIcon(!passwordIcon);
  };

  const [gambarProfile, setGambarProfile] = useState("");
  const [btnHapusGambar, setBtnHapusGambar] = useState(false);
  const [btnTambahGambar, setBtnTambahGambar] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      const fetchUser = async () => {
        try {
          const { data } = await axios.get(`/api/profile/${userInfo._id}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          if (data) {
            setUser(data);
            if (data.image) {
              setGambarProfile(data.image);
              setBtnHapusGambar(true);
            }
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchUser();
    }
  }, [userInfo]);

  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");

  setValue2("userId", user._id);

  setValue3("userId", user._id);
  setValue3("email", user.email);
  setValue3("username", user.username);

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [pesanDetail, setPesanDetail] = useState("");

  const [loadingImage, setLoadingImage] = useState(false);
  const [pesanImage, setPesanImage] = useState("");

  const imageHandler = async ({ userId, gambar }) => {
    try {
      setLoadingImage(true);
      const { data } = await axios.put("/api/profile/profile-image", {
        userId,
        gambar,
      });
      if (data) {
        dispatch({ type: "USER_LOGIN", payload: data });

        Cookies.set("userInfo", JSON.stringify(data));
        setPesanImage(data.pesan);
        setLoadingImage(false);
        setTimeout(async () => {
          setPesanImage("");
          setBtnTambahGambar(false);
          setBtnHapusGambar(true);
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
    try {
      setLoadingImage(true);
      const { data } = await axios.post("/api/profile/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      if (data) {
        setPesanImage(data.pesan);
        setLoadingImage(false);
        setTimeout(async () => {
          setPesanImage("");
        }, 1500);
        setGambarProfile(data.public_id);
        setValue2("gambar", data.public_id);
        setBtnTambahGambar(true);
      }
    } catch (err) {
      alert(getError(err));
      setLoadingImage(false);
    }
  };

  const userHandler = async ({ userId, email, username }) => {
    try {
      setLoadingDetail(true);
      const { data } = await axios.put("/api/profile", {
        userId,
        email,
        username,
      });
      if (data) {
        dispatch({ type: "USER_LOGIN", payload: data });

        Cookies.set("userInfo", JSON.stringify(data));
        setPesanDetail(data.pesan);
        setLoadingDetail(false);
        setTimeout(async () => {
          setPesanDetail("");
        }, 1500);

        router.reload();
      }
    } catch (err) {
      getError(err);
      setLoadingDetail(false);
    }
  };

  const ubahPasswordHandler = async ({ password }) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/profile/${user._id}`, {
        password,
      });
      if (data) {
        setValue("password", "");

        setPesan(data.pesan);
        setLoading(false);
        setTimeout(async () => {
          setPesan("");
        }, 1500);
      }
    } catch (err) {
      getError(err);
      setLoading(false);
    }
  };

  async function hapusGambarHandler(namaFile, userId) {
    try {
      setLoadingImage(true);
      const { data } = await axios.put("/api/profile/delete-image", {
        namaFile,
        userId,
      });
      if (data) {
        setLoadingImage(false);
        setGambarProfile("");
        setBtnHapusGambar(false);
        setPesanImage(data.pesan);
        setTimeout(async () => {
          setPesanImage("");
        }, 1500);
        dispatch({ type: "USER_LOGIN", payload: data });
        Cookies.set("userInfo", JSON.stringify(data));
      }
    } catch (err) {
      alert(getError(err));
      setLoadingImage(false);
    }
  }

  return (
    <AppLayout>
      <section className="breadcrumb">
        <h1>Profile</h1>
        <ul>
          <li>
            {userInfo && userInfo.role == 1 && <span>Superadmin</span>}
            {userInfo && userInfo.role == 2 && <span>Admin</span>}
            {userInfo && userInfo.role == 3 && <span>Surveyor</span>}
            {userInfo && userInfo.role == 4 && <span>Operator</span>}
          </li>
          <li className="divider las las-arrow-right"></li>
          <li>Detail</li>
        </ul>
      </section>

      <div className="lg:flex lg:-mx-4">
        {/* <!-- Content --> */}
        <div className="lg:w-1/2 xl:w-3/4 lg:px-4">
          <div className="card p-5">
            <form onSubmit={handleSubmit3(userHandler)}>
              <input hidden {...register3("userId", { required: true })} />
              <div className="mb-5 xl:w-1/2">
                <label className="label block mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  className="form-control"
                  {...register3("email", { required: true })}
                  autoFocus={!0}
                />
                <small className="block my-2 invalid-feedback">
                  {errors3.email?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>
              <div className="mb-5 xl:w-1/2">
                <label className="label block mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  className="form-control"
                  {...register3("username", { required: true })}
                />
                <small className="block my-2 invalid-feedback">
                  {errors3.username?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>
              <hr />
              <div className="flex items-center">
                <button
                  className="btn btn_primary mt-5 ltr:mr-2 rtl:ml-2 uppercase"
                  type="submit"
                >
                  {loadingDetail && (
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
                  )}
                  Simpan
                </button>
                <span className="ml-auto">{pesanDetail}</span>
              </div>
            </form>
          </div>
        </div>

        {/* <!-- Detail --> */}
        <div className="lg:w-1/2 xl:w-1/4 lg:px-4 pt-5 lg:pt-0">
          {/* <!-- Featured Image --> */}
          <div className="card card_column">
            <div className="image">
              {gambarProfile && (
                <div className="aspect-w-4 aspect-h-3">
                  <Image
                    src={gambarProfile}
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
                    {gambarProfile && gambarProfile}
                  </div>
                  <input
                    type="file"
                    hidden
                    {...register2("gambar", { required: true })}
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
                      <span>{gambarProfile ? "Ubah Photo" : "Cari Photo"}</span>
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
                      onClick={() =>
                        hapusGambarHandler(gambarProfile, user._id)
                      }
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

          {loading ? (
            <div className="relative card p-5 mt-5 overflow-hidden">
              <SkeletonUbahPass />
            </div>
          ) : (
            <div className="relative card p-5 mt-5 overflow-hidden">
              <h3>Ubah Password</h3>
              <form onSubmit={handleSubmit(ubahPasswordHandler)}>
                <label className="label block mb-2 mt-5" htmlFor="password">
                  Password Baru
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
                <div className="mt-5 flex items-center">
                  <button
                    className="btn btn_primary ltr:mr-2 rtl:ml-2 uppercase"
                    type="submit"
                  >
                    Simpan
                  </button>
                  {pesan && (
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
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(Profile), { ssr: false });
