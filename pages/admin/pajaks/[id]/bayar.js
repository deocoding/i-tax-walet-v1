import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import UserLayout from "../../../../components/layouts/user/UserLayout";
import { Store } from "../../../../utils/Store";
import DatePicker, { registerLocale } from "react-datepicker";
import id from "date-fns/locale/id";
registerLocale("id", id);
import { useForm, Controller } from "react-hook-form";
import { getError } from "../../../../utils/error";
import axios from "axios";
import Image from "next/image";
import NumberFormat from "react-number-format";
import Moment from "react-moment";
import "moment/locale/id";

export default function PajakDetail({ params }) {
  const pajakId = params.id;
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [iconCheck, setIconCheck] = useState(false);

  const [pajak, setPajak] = useState({});

  const [loadingImage, setLoadingImage] = useState(false);
  const [checkImage, setCheckImage] = useState(false);
  const [gambarJual, setGambarJual] = useState("");
  const [btnTambah, setBtnTambah] = useState(false);
  const [btnHapus, setBtnHapus] = useState(false);

  const {
    register,
    control,
    formState: { errors },
    setValue,
    setFocus,
    handleSubmit,
  } = useForm();

  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
    setValue: setValue2,
  } = useForm();

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      const fetchPajak = async () => {
        try {
          const { data } = await axios.get(`/api/user/pajaks/${pajakId}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          if (data) {
            setPajak(data);
            setValue("pajakId", data._id);
            setValue2("pajakId", data._id);
            if (data.tgglBay) {
              setStartDate(new Date(data.tgglBay));
              setValue("tgglBay", new Date());
            }
            if (data.fotoBayar) {
              setGambarJual(data.fotoBayar);
              setBtnHapus(true);
            }
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchPajak();
    }
  }, []);

  const pajakHandler = async ({ pajakId, totBay, tgglBay }) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/user/pajaks/bayar`,
        { pajakId, totBay, tgglBay },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (data) {
        setValue("totBay", data.totBay);
        setValue("tgglBay", new Date(data.tgglBay));
        setStartDate(new Date(data.tgglBay));
        setIconCheck(true);
        setLoading(false);
        setTimeout(async () => {
          setIconCheck(false);
        }, 1500);
        setPajak(data);
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
      const { data } = await axios.put("/api/user/pajaks/bayar-image", {
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
      const { data } = await axios.put("/api/user/pajaks/delete-bayar-image", {
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
          <li>Pembayaran Pajak</li>
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
                  Detail Pembayaran
                </button>
              </nav>
            </div>
            <div className="px-10 py-5 mb-5 flex justify-between bg-sky-800 text-slate-200 rounded-xl">
              <div>
                <h4 className="mb-2 uppercase text-white">Pelaporan</h4>
                <p className="leading-relaxed">
                  Volume/Tonase : {pajak.volTon} kg
                  <br />
                  Nilai Jual per kg :{" "}
                  <NumberFormat
                    value={pajak.nilJul}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp"}
                  />
                  <br />
                  Total Penjualan :{" "}
                  <NumberFormat
                    value={pajak.totJual}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp"}
                  />
                </p>
              </div>

              <div className="ltr:text-right rtl:text-left">
                <h4 className="mb-2 uppercase text-white">Kewajiban</h4>
                <p className="leading-relaxed">
                  Pajak 10% :{" "}
                  <NumberFormat
                    value={pajak.totPajak}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp"}
                  />
                  <br />
                  Batas Pembayaran : <Moment fromNow>{pajak.batBay}</Moment>
                  <br />
                  Keterlambatan dikenakan denda 2%
                </p>
              </div>
            </div>
            <form onSubmit={handleSubmit(pajakHandler)}>
              <input hidden {...register("pajakId", { required: true })} />
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="totBay">
                  Total Pembayaran (Rp)
                </label>
                <NumberFormat
                  name="totBay"
                  value={pajak.totBay}
                  className="form-control"
                  thousandSeparator={true}
                  {...register("totBay", { required: true })}
                  onValueChange={(values) => {
                    const { formattedValue, value } = values;
                    // formattedValue = $2,223
                    // value ie, 2223
                    setValue("totBay", value);
                  }}
                />
                <small className="block my-2 invalid-feedback">
                  {errors.totBay?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="tgglBay">
                  Pada tanggal
                </label>
                <DatePicker
                  locale="id"
                  isClearable
                  innerRef={{
                    ...register("tgglBay", { required: true }),
                  }}
                  className={"form-control"}
                  selected={startDate}
                  onChange={(val) => {
                    setStartDate(val);
                    setValue("tgglBay", val);
                  }}
                />
                <small className="block my-2 invalid-feedback">
                  {errors.tgglBay?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>
              <div className="flex items-center">
                <button
                  className="btn btn_primary mt-5 ltr:mr-2 rtl:ml-2 uppercase"
                  type="submit"
                >
                  Laporkan
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
                    Foto Bukti Pembayaran
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
            {pajak.status === 1 && (
              <div className="badge badge_secondary uppercase mt-5">
                <div className="p-2 text-2xl leading-none">Pelaporan</div>
              </div>
            )}
            {pajak.status === 2 && (
              <div className="badge badge_warning uppercase mt-5">
                <div className="p-2 text-2xl leading-none">Kurang Bayar</div>
              </div>
            )}
            {pajak.status === 3 && (
              <div className="badge badge_danger uppercase mt-5">
                <div className="p-2 text-2xl leading-none">Denda</div>
              </div>
            )}
            {pajak.status === 4 && (
              <div className="badge badge_success uppercase mt-5">
                <div className="p-2 text-2xl leading-none">Lunas</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export async function getServerSideProps({ params }) {
  return { props: { params } };
}
