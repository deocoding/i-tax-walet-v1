import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import AdminLayout from "../../../../components/layouts/admin/AdminLayout";
import { Store } from "../../../../utils/Store";
import DatePicker, { registerLocale } from "react-datepicker";
import id from "date-fns/locale/id";
registerLocale("id", id);
import { useForm, Controller } from "react-hook-form";
import { getError } from "../../../../utils/error";
import axios from "axios";
import Image from "next/image";
import NumberFormat from "react-number-format";

export default function PajakDetail({ params }) {
  const pajakId = params.id;
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [startDate, setStartDate] = useState();
  const [loading, setLoading] = useState(false);
  const [iconCheck, setIconCheck] = useState(false);

  const [pajak, setPajak] = useState([]);

  const [loadingImage, setLoadingImage] = useState(false);
  const [checkImage, setCheckImage] = useState(false);
  const [gambarJual, setGambarJual] = useState("");
  const [btnTambah, setBtnTambah] = useState(false);
  const [btnHapus, setBtnHapus] = useState(false);

  const [user, setUser] = useState([]);

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    setValue: setValue2,
  } = useForm();

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      const fetchPajak = async () => {
        try {
          const { data } = await axios.get(`/api/admin/pajaks/${pajakId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });

          setPajak(data);

          setStartDate(new Date(data.tgglJul));

          setValue("volTon", data.volTon);
          setValue("pajakId", data._id);
          setValue("userId2", data.user);
          setValue2("userId", data.user);
          setValue("nilJul", data.nilJul);
          setValue("tgglJul", data.tgglJul);
          setValue2("pajakId", data._id);
          if (data.fotoJual) {
            setGambarJual(data.fotoJual);
            setBtnHapus(true);
          }
        } catch (err) {
          console.log(err);
        }
      };

      const fetchUsers = async () => {
        try {
          const res = await axios.get(`/api/admin/users/`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setUser(res.data);
        } catch (err) {
          console.log(err);
        }
      };

      fetchUsers();
      fetchPajak();
    }
  }, []);

  const pajakHandler = async ({ pajakId, userId, volTon, nilJul, tgglJul }) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/admin/pajaks/`,
        { pajakId, userId, volTon, nilJul, tgglJul },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (data) {
        setPajak(data);
        setValue("volTon", data.volTon);
        setValue("nilJul", data.nilJul);
        defaultValues("userId", data.user);
        setValue("tgglJul", data.tgglJul);
        setStartDate(new Date(data.tgglJul));
        setIconCheck(true);
        setLoading(false);
        setTimeout(async () => {
          setIconCheck(false);
        }, 1500);
      }
    } catch (err) {
      alert(getError(err));
    }
  };

  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      setLoadingImage(true);
      const { data } = await axios.post(
        "/api/user/pajaks/upload",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      if (data) {
        setCheckImage(true);
        setLoadingImage(false);
        setTimeout(async () => {
          setCheckImage(false);
        }, 1500);
        setGambarJual(data.public_id);
        setValue2("gambar", data.public_id);
        setBtnTambah(true);
        setBtnHapus(true);
      }
    } catch (err) {
      alert(getError(err));
      setLoadingImage(false);
    }
  };

  const imageHandler = async ({ pajakId, gambar }) => {
    try {
      setLoadingImage(true);
      const { data } = await axios.put("/api/user/pajaks/jual-image", {
        pajakId,
        gambar,
      });
      if (data) {
        setCheckImage(true);
        setLoadingImage(false);
        setTimeout(async () => {
          setCheckImage(false);
          setBtnTambah(false);
          setBtnHapus(true);
        }, 1500);
      }
    } catch (err) {
      alert(getError(err));
      setLoadingImage(false);
    }
  };

  async function hapusGambarHandler(namaFile, pajakId) {
    try {
      setLoadingImage(true);
      const { data } = await axios.put("/api/user/pajaks/delete-jual-image", {
        namaFile,
        pajakId,
      });
      if (data) {
        setLoadingImage(false);
        setGambarJual("");
        setBtnHapus(false);
        setCheckImage(true);
        setTimeout(async () => {
          setCheckImage(false);
        }, 1500);
      }
    } catch (err) {
      alert(getError(err));
      setLoadingImage(false);
    }
  }

  const pilihUser = () => (
    <select value={pajak.user}>
      {user &&
        user.map((usr) => (
          <option
            key={usr._id}
            value={usr._id === pajak.user && true}
            // selected={usr._id === pajak.user && true}
          >
            {usr.namaLengkap}
          </option>
        ))}
    </select>
  );

  return (
    <AdminLayout title="Pajak">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb">
        <h1>Pajak</h1>
        <ul>
          <li>
            <span>Admin</span>
          </li>
          <li className="divider las las-arrow-right"></li>
          <li>Ubah Pajak</li>
          <li className="divider las las-arrow-right"></li>
          <li>{pajakId}</li>
        </ul>
      </section>

      <div className="lg:flex lg:-mx-4">
        {/* <!-- Content --> */}
        <div className="lg:w-1/2 xl:w-2/3 lg:px-4">
          <div className="card p-5">
            <div className="tabs mb-5">
              <nav className="tab-nav">
                <button className="nav-link h5 uppercase active">
                  Detail Penjualan
                </button>
              </nav>
            </div>
            <form onSubmit={handleSubmit(pajakHandler)}>
              <input hidden {...register("pajakId", { required: true })} />
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="userId">
                  User
                </label>
                <div className="custom-select">
                  {pilihUser()}
                  {/* <select
                    value={pajak.user}
                    defaultValue={""}
                    onChange={(values) => {
                      const { formattedValue, value } = values;
                      // formattedValue = $2,223
                      // value ie, 2223
                      setValue("userId", value);
                    }}
                  >
                    <option value="">pilih user...</option>
                    {user &&
                      user.map((usr) => (
                        <option
                          key={usr._id}
                          value={usr._id}
                          // selected={usr._id === pajak.user ? !0 : !1}
                        >
                          {usr.namaLengkap}
                        </option>
                      ))}
                  </select> */}
                  {/* <select
                    id="userId2"
                    name="userId2"
                    {...register("userId2", { required: true })}
                    className="form-control"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Pilih user...
                    </option>
                    {user &&
                      user.map((usr) => (
                        <option
                          key={usr._id}
                          value={usr._id}
                          selected={usr._id === pajak.user ? !0 : !1}
                        >
                          {usr.namaLengkap}
                        </option>
                      ))}
                  </select> */}
                  <div className="custom-select-icon las las-caret-down"></div>
                </div>
                <small className="block my-2 invalid-feedback">
                  {errors.userId?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="volTon">
                  Volume/Tonase (Kg)
                </label>
                <input
                  id="volTon"
                  type="number"
                  className="form-control"
                  {...register("volTon", { required: true })}
                />
                <small className="block my-2 invalid-feedback">
                  {errors.volTon?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="nilJul">
                  Nilai Jual per Kg (Rp)
                </label>
                {/* <Controller
                  control={control}
                  {...register("nilJul", { required: true })}
                  render={({ field: { onChange, name, value } }) => (
                    <NumberFormat
                      thousandSeparator={true}
                      className="form-control"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                /> */}
                <NumberFormat
                  name="nilJul"
                  value={pajak.nilJul}
                  className="form-control"
                  thousandSeparator={true}
                  {...register("nilJul", { required: true })}
                  onValueChange={(values) => {
                    const { formattedValue, value } = values;
                    // formattedValue = $2,223
                    // value ie, 2223
                    setValue("nilJul", value);
                  }}
                />
                <small className="block my-2 invalid-feedback">
                  {errors.nilJul?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="tgglJul">
                  Tanggal Jual
                </label>
                <DatePicker
                  locale="id"
                  isClearable
                  innerRef={{
                    ...register("tgglJul", { required: true }),
                  }}
                  className={"form-control"}
                  selected={startDate}
                  onChange={(val) => {
                    setStartDate(val);
                    setValue("tgglJul", val);
                  }}
                />
                <small className="block my-2 invalid-feedback">
                  {errors.tgglJul?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>
              <div className="flex items-center">
                <button
                  className="btn btn_primary mt-5 ltr:mr-2 rtl:ml-2 uppercase"
                  type="submit"
                >
                  Simpan
                </button>
                {loading && (
                  <span className="pl-3 mt-5">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
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
                )}
                {iconCheck && (
                  <span className="pl-3 mt-5">
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
        {pajak && (
          <div className="lg:w-1/2 xl:w-1/3 lg:px-4 pt-5 lg:pt-0">
            <div className="card card_column">
              <div className="tabs px-5 pt-5">
                <nav className="tab-nav">
                  <button className="nav-link h5 uppercase active">
                    Foto Nota Penjualan
                  </button>
                </nav>
              </div>
              <div className="image">
                {gambarJual && (
                  <div className="aspect-w-4 aspect-h-3">
                    <Image
                      src={gambarJual}
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
                  <input hidden {...register2("pajakId", { required: true })} />
                  <label className="input-group text-base font-normal">
                    <div className="file-name input-addon input-addon-prepend input-group-item w-full overflow-x-hidden">
                      {gambarJual && gambarJual}
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
                        <span>{gambarJual ? "Ubah" : "Upload"}</span>
                      )}
                    </div>
                  </label>
                  <div className="mt-5 flex items-center">
                    {btnTambah && (
                      <button
                        className="btn btn_primary ltr:mr-2 rtl:ml-2 uppercase"
                        type="submit"
                      >
                        Simpan
                      </button>
                    )}

                    {btnHapus && (
                      <a
                        className="btn btn_outlined btn_danger uppercase cursor-pointer"
                        onClick={() =>
                          hapusGambarHandler(gambarJual, pajak._id)
                        }
                      >
                        Hapus
                      </a>
                    )}

                    {checkImage && (
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

        {/* <!-- Detail --> */}
        <div className="lg:w-1/2 xl:w-1/3 lg:px-4 pt-5 lg:pt-0">
          {/* <!-- Featured Image --> */}
          <div className="relative card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
            <span className="text-primary text-6xl leading-none las las-file-invoice"></span>
            <p className="mt-2 text-xl">Status Pajak</p>
            <div className="badge badge_outlined badge_secondary uppercase mt-5">
              <div className="p-2 text-2xl leading-none">Pelaporan</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { params } };
}
