import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UserLayout from "../../components/layouts/user/UserLayout";
import { Store } from "../../utils/Store";
import { getError } from "../../utils/error";
import SkeletonUbahPass from "../../components/skeletons/SkeletonUbahPass";
import Image from "next/image";
import Cookies from "js-cookie";

export default function UserDetail() {
  const router = useRouter();
  const { redirect } = router.query;
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
          const { data } = await axios.get(`/api/users/${userInfo._id}`, {
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
  }, []);

  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");

  setValue2("userId", user._id);

  setValue3("userId", user._id);
  setValue3("email", user.email);
  setValue3("namaLengkap", user.namaLengkap);
  if (user.hpTel) {
    setValue3("hpTel", user.hpTel);
  }
  if (user.alamat) {
    setValue3("alamatDetail", user.alamat.detail);
    setValue3("alamatKec", user.alamat.kec);
  }

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [pesanDetail, setPesanDetail] = useState("");

  const [loadingImage, setLoadingImage] = useState(false);
  const [pesanImage, setPesanImage] = useState("");

  const imageHandler = async ({ userId, gambar }) => {
    try {
      setLoadingImage(true);
      const { data } = await axios.put("/api/users/profile-image", {
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
      const { data } = await axios.post("/api/users/upload", bodyFormData, {
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

  const userHandler = async ({
    userId,
    email,
    namaLengkap,
    hpTel,
    alamatDetail,
    alamatKec,
  }) => {
    try {
      setLoadingDetail(true);
      const { data } = await axios.put("/api/users/profile", {
        userId,
        email,
        namaLengkap,
        hpTel,
        alamatDetail,
        alamatKec,
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
      const { data } = await axios.put(`/api/users/${user._id}`, {
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
      const { data } = await axios.put("/api/users/delete-image", {
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
    <UserLayout title="Pajak">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb">
        <h1>Pajak</h1>
        <ul>
          <li>
            <span>User</span>
          </li>
          <li className="divider las las-arrow-right"></li>
          <li>Tambah Pajak</li>
        </ul>
      </section>

      <div className="lg:flex lg:-mx-4">
        {/* <!-- Content --> */}
        <div className="lg:w-1/2 lg:px-4">
          <div className="card p-5">
            <form onSubmit={handleSubmit3(userHandler)}>
              <input hidden {...register3("userId", { required: true })} />
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="volTan">
                  Volume Tonase
                </label>
                <input
                  id="volTan"
                  type="number"
                  className="form-control block"
                />
              </div>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="nilJual">
                  Nilai Jual
                </label>
                <input id="nilJual" type="number" className="form-control" />
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
        <div className="lg:w-1/2 lg:px-4 pt-5 lg:pt-0">
          {/* <!-- Featured Image --> */}
          <div className="relative card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
            <span className="text-primary text-6xl leading-none las las-address-book"></span>
            <p className="mt-2 text-xl">Status Pajak</p>
            <div className="badge badge_outlined badge_secondary uppercase mt-5">
              <div className="p-2 text-2xl leading-none">Pelaporan</div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
