import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AppLayout from "../../../components/layouts/app/AppLayout";
import { Store } from "../../../utils/Store";
import dynamic from "next/dynamic";
import NumberFormat from "react-number-format";
import DatePicker, { registerLocale } from "react-datepicker";
import id from "date-fns/locale/id";
import { getError } from "../../../utils/error";
registerLocale("id", id);

function Pajaks({ params }) {
  const pajakId = params.id;
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
  } = useForm();

  const [pajak, setPajak] = useState([]);
  const [wajibPajaks, setWajibPajaks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState(false);

  const [startDate, setStartDate] = useState(false);
  const [startDate2, setStartDate2] = useState(false);
  const [totJual, setTotJual] = useState(false);
  const [totPajak, setTotPajak] = useState(false);
  const [volTon, setVolTon] = useState(false);
  const [nilJual, setNilJual] = useState(false);
  const [jumBayar, setJumBayar] = useState(false);

  const [sttsPajak, setSttsPajak] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      const fetchWajibPajaks = async () => {
        try {
          const { data } = await axios.get(`/api/wajib-pajaks/wp-all`, {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          });
          if (data) {
            setWajibPajaks(data);
          }
        } catch (err) {
          console.log(err);
        }
      };

      const fetchPajak = async () => {
        try {
          const { data } = await axios.get(`/api/pajaks/${pajakId}`, {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          });
          if (data) {
            setValue("pajakId", pajakId);
            setValue("wajibPajak", data.wajibPajak);
            setValue("tgglJual", data.tgglJual);
            setValue("tgglBayar", data.tgglBayar);
            setValue("volTon", data.volTon);
            setValue("nilJual", data.nilJual);
            setValue("totJual", data.totJual);
            setValue("totPajak", data.totPajak);
            setValue("jumBayar", data.jumBayar);
            setValue("sttsPajak", data.sttsPajak);
            setVolTon(data.volTon);
            setNilJual(data.nilJual);
            setTotJual(data.totJual);
            setTotPajak(data.totPajak);
            setJumBayar(data.jumBayar);
            // setSttsPajak(data.sttsPajak);

            setStartDate(new Date(data.tgglJual));
            setStartDate2(new Date(data.tgglBayar));
            setPajak(data);

            // setVolTon(data.volTon);
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchWajibPajaks();
      fetchPajak();
    }
  }, [userInfo, pajakId]);

  const getTotJual = async (e) => {
    await setTotJual(e);
    await setValue("totJual", e);
  };
  const getTotPajak = async (e) => {
    await setTotPajak(e);
    await setValue("totPajak", e);
  };
  const getSttsPajak = async (e, f) => {
    switch (e == f) {
      case e > f:
        const h = await (f - e);
        await setSttsPajak(() => {
          return (
            <div className="text-red-400">
              <strong className="uppercase ">Kurang Bayar </strong>
              <NumberFormat
                value={h}
                displayType="text"
                thousandSeparator={true}
                prefix="Rp"
              />
            </div>
          );
        });
        await setValue("sttsPajak", `KURANG BAYAR`);
        break;
      case e < f:
        const g = await (e - f);
        await setSttsPajak(() => {
          return (
            <div className="text-red-400">
              <strong className="uppercase ">Denda </strong>
              <NumberFormat
                value={g}
                displayType="text"
                thousandSeparator={true}
                prefix="Rp"
              />
            </div>
          );
        });
        await setValue("sttsPajak", `DENDA`);
        break;
      default:
        await setSttsPajak(() => {
          return (
            <div className="text-green-400">
              <strong className="uppercase ">Lunas </strong>
            </div>
          );
        });
        await setValue("sttsPajak", `LUNAS`);
        break;
    }
  };

  const pajaksHandler = async ({
    pajakId,
    wajibPajak,
    volTon,
    nilJual,
    tgglJual,
    totJual,
    totPajak,
    jumBayar,
    tgglBayar,
    sttsPajak,
  }) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        "/api/pajaks",
        {
          pajakId,
          wajibPajak,
          volTon,
          nilJual,
          tgglJual,
          totJual,
          totPajak,
          jumBayar,
          tgglBayar,
          sttsPajak,
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
          setPajak(data.pajak);
          setValue("pajakId", pajakId);
          setValue("wajibPajak", data.pajak.wajibPajak);
          setValue("tgglJual", data.pajak.tgglJual);
          setValue("tgglBayar", data.pajak.tgglBayar);
          setValue("volTon", data.pajak.volTon);
          setValue("nilJual", data.pajak.nilJual);
          setValue("totJual", data.pajak.totJual);
          setValue("totPajak", data.pajak.totPajak);
          setValue("jumBayar", data.pajak.jumBayar);
          setValue("sttsPajak", data.pajak.sttsPajak);
          setVolTon(data.pajak.volTon);
          setNilJual(data.pajak.nilJual);
          setTotJual(data.pajak.totJual);
          setTotPajak(data.pajak.totPajak);
          setJumBayar(data.pajak.jumBayar);
          // setSttsPajak(data.pajak.sttsPajak);

          setStartDate(new Date(data.pajak.tgglJual));
          setStartDate2(new Date(data.pajak.tgglBayar));
          setPajak(data.pajak);
        }, 1500);
      }
    } catch (err) {
      alert(getError(err));
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Pajak">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb">
        <h1>Pajak</h1>
        <ul>
          <li>{userInfo && userInfo.role === 1 && <span>Superadmin</span>}</li>
          <li className="divider las las-arrow-right"></li>
          <li>Edit Pajak</li>
          <li className="divider las las-arrow-right"></li>
          <li>{pajakId && pajakId}</li>
        </ul>
      </section>

      <div className="lg:flex lg:-mx-4">
        <div className="w-full lg:px-4">
          <div className="card p-5">
            <nav className="tab-nav mb-5">
              <button className="nav-link h5 uppercase active">
                Form Edit
              </button>
            </nav>
            <form onSubmit={handleSubmit(pajaksHandler)}>
              <input hidden {...register("pajakId", { required: true })} />
              <input hidden {...register("totJual", { required: true })} />
              <input hidden {...register("totPajak", { required: true })} />
              <input hidden {...register("sttsPajak", { required: true })} />
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-5">
                  <label className="label block mb-2" htmlFor="wajibPajak">
                    Wajib Pajak
                  </label>
                  <div className="custom-select">
                    <select
                      className="form-control"
                      {...register("wajibPajak", { required: true })}
                    >
                      <option value="">Pilih wajib pajak</option>
                      {wajibPajaks &&
                        wajibPajaks.map((wp) => (
                          <option key={wp._id} value={wp._id}>
                            {wp.namaPemilik}
                          </option>
                        ))}
                    </select>
                    <div className="custom-select-icon las las-caret-down"></div>
                  </div>
                  <small className="block my-2 invalid-feedback">
                    {errors.wajibPajak?.type === "required" &&
                      "Field diatas tidak boleh kosong"}
                  </small>
                </div>
                <div className="mb-5">
                  <label className="label block mb-2" htmlFor="volTon">
                    Volume / Tonase Penjualan (kg)
                  </label>
                  <NumberFormat
                    name="volTon"
                    value={volTon}
                    className="form-control"
                    thousandSeparator={true}
                    {...register("volTon", { required: true })}
                    onValueChange={(values) => {
                      const { formattedValue, value } = values;
                      // formattedValue = $2,223
                      // value ie, 2223
                      setVolTon();
                      setSttsPajak();
                      setValue("volTon", value);
                      const totJual = getValues("nilJual") * value;
                      const totPajak = (totJual * 10) / 100;
                      getTotJual(totJual);
                      getTotPajak(totPajak);
                      const jumBayar = getValues("jumBayar");
                      getSttsPajak(jumBayar, totPajak);
                    }}
                  />
                  <small className="block my-2 invalid-feedback">
                    {errors.volTan?.type === "required" &&
                      "Field diatas tidak boleh kosong"}
                  </small>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-5">
                  <label className="label block mb-2" htmlFor="nilJual">
                    Nilai Jual (per kg)
                  </label>
                  <NumberFormat
                    name="nilJual"
                    value={nilJual}
                    className="form-control"
                    thousandSeparator={true}
                    {...register("nilJual", { required: true })}
                    onValueChange={(values) => {
                      const { formattedValue, value } = values;
                      // formattedValue = $2,223
                      // value ie, 2223
                      setNilJual();
                      setSttsPajak();
                      setValue("nilJual", value);
                      const totJual = getValues("volTon") * value;
                      const totPajak = (totJual * 10) / 100;
                      const jumBayar = getValues("jumBayar");
                      // console.log(totJual, totPajak);
                      getTotJual(totJual);
                      getTotPajak(totPajak);
                      getSttsPajak(jumBayar, totPajak);
                    }}
                  />
                  <small className="block my-2 invalid-feedback">
                    {errors.nilJual?.type === "required" &&
                      "Field diatas tidak boleh kosong"}
                  </small>
                </div>
                <div className="mb-5">
                  <label className="label block mb-2" htmlFor="tgglJual">
                    Tanggal Jual
                  </label>
                  {/* <input
                    id="tgglJual"
                    type="text"
                    className="form-control"
                    {...register("tgglJual", { required: true })}
                  /> */}
                  <DatePicker
                    locale="id"
                    isClearable
                    innerRef={{
                      ...register("tgglJual", { required: true }),
                    }}
                    className={"form-control"}
                    selected={startDate}
                    onChange={(val) => {
                      setStartDate(val);
                      setValue("tgglJual", val);
                    }}
                  />
                  <small className="block my-2 invalid-feedback">
                    {errors.tgglJual?.type === "required" &&
                      "Field diatas tidak boleh kosong"}
                  </small>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-5">
                  <label className="label block mb-2" htmlFor="jumBayar">
                    Jumlah Pembayaran
                  </label>
                  <NumberFormat
                    name="jumBayar"
                    value={jumBayar}
                    className="form-control"
                    thousandSeparator={true}
                    {...register("jumBayar", { required: true })}
                    onValueChange={(values) => {
                      const { formattedValue, value } = values;
                      // formattedValue = $2,223
                      // value ie, 2223
                      setJumBayar();
                      setValue("jumBayar", value);
                      const totPajak = getValues("totPajak");
                      getSttsPajak(value, totPajak);
                    }}
                  />
                  <small className="block my-2 invalid-feedback">
                    {errors.jumBayar?.type === "required" &&
                      "Field diatas tidak boleh kosong"}
                  </small>
                </div>
                <div className="mb-5">
                  <label className="label block mb-2" htmlFor="tgglBayar">
                    Tanggal Pembayaran
                  </label>
                  <DatePicker
                    locale="id"
                    isClearable
                    innerRef={{
                      ...register("tgglBayar", { required: true }),
                    }}
                    className={"form-control"}
                    selected={startDate2}
                    onChange={(val) => {
                      setStartDate2(val);
                      setValue("tgglBayar", val);
                    }}
                  />
                  <small className="block my-2 invalid-feedback">
                    {errors.tgglBayar?.type === "required" &&
                      "Field diatas tidak boleh kosong"}
                  </small>
                </div>
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
                    <span>Simpan</span>
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

          <div className="mt-5">
            <div className="card lg:flex">
              <div
                className="flex items-center 
            p-5 border-t lg:border-t-0 border-gray-200 dark:border-gray-900"
              >
                <span className="ltr:mr-2 rtl:ml-2">Total Penjualan :</span>
                <span className="ltr:ml-auto rtl:mr-auto font-semibold">
                  <NumberFormat
                    value={totJual}
                    displayType="text"
                    thousandSeparator={true}
                    prefix="Rp"
                  />
                </span>
              </div>
              <div className="flex items-center p-5 border-t lg:border-t-0 lg:ltr:border-l lg:rtl:border-r border-gray-200 dark:border-gray-900">
                <span className="ltr:mr-2 rtl:ml-2">10% Pajak :</span>
                <span className="ltr:ml-auto rtl:mr-auto font-semibold">
                  <NumberFormat
                    value={totPajak}
                    displayType="text"
                    thousandSeparator={true}
                    prefix="Rp"
                  />
                </span>
              </div>

              <div className="flex items-center p-5 border-t lg:border-t-0 lg:ltr:border-l lg:rtl:border-r border-gray-200 dark:border-gray-900">
                <span className="ltr:mr-2 rtl:ml-2">
                  Status Pembayaran Pajak :
                </span>
                <span className="ltr:ml-auto rtl:mr-auto font-semibold">
                  {sttsPajak}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(Pajaks), { ssr: false });

export async function getServerSideProps({ params }) {
  return { props: { params } };
}
