import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AppLayout from "../../../components/layouts/app/AppLayout";
import { Store } from "../../../utils/Store";

import DatePicker, { registerLocale } from "react-datepicker";
import id from "date-fns/locale/id";
import PopulasiTable from "../../../components/tables/PopulasiTable";
registerLocale("id", id);

function Survey({ params }) {
  const objekPajakId = params.id;

  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [wajibPajak, setWajibPajak] = useState([]);
  const [proyPopuls, setProyPopuls] = useState([]);
  const [objekPajak, setObjekPajak] = useState([]);
  const [dateProyeksi, setDateProyeksi] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    setFocus,
  } = useForm();

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      const fetchObjekPajak = async () => {
        try {
          const { data } = await axios.get(
            `/api/objek-pajaks/survey/${objekPajakId}`,
            {
              headers: {
                authorization: `Bearer ${userInfo.token}`,
              },
            }
          );
          if (data) {
            setValue("tgglProyeksi", new Date());
            setObjekPajak(data.objekPajak);
            setWajibPajak(data.wajibPajak);
            setProyPopuls(data.proyPopuls);
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchObjekPajak();
    }
  }, [objekPajakId]);

  const populasiHandler = async ({ objekPajakId, tgglProyeksi, jumBur }) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/objek-pajaks/survey",
        {
          objekPajakId,
          tgglProyeksi,
          jumBur,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (data.pesan) {
        alert(data.pesan);
        setLoading(false);
      } else {
        setPesan(true);
        setLoading(false);
        setTimeout(async () => {
          setPesan(false);
          router.reload();
        }, 1500);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // console.log(proyPopuls);

  return (
    <AppLayout title="Objek Pajak">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb">
        <h1>Objek Pajak</h1>
        <ul>
          <li>{userInfo && userInfo.role === 1 && <span>Superadmin</span>}</li>
          <li className="divider las las-arrow-right"></li>
          <li>Proyeksi Populasi</li>
        </ul>
      </section>

      <div className="lg:flex lg:-mx-4">
        <div className="w-full lg:px-4">
          <div className="card lg:flex">
            <div
              className="flex items-center 
            p-5 border-t lg:border-t-0 border-gray-200 dark:border-gray-900"
            >
              <span className="ltr:mr-2 rtl:ml-2">id :</span>
              <span className="ltr:ml-auto rtl:mr-auto font-semibold">
                {objekPajakId}
              </span>
            </div>
            <div className="flex items-center p-5 border-t lg:border-t-0 lg:ltr:border-l lg:rtl:border-r border-gray-200 dark:border-gray-900">
              <span className="ltr:mr-2 rtl:ml-2">Nama Pemilik :</span>
              <span className="ltr:ml-auto rtl:mr-auto font-semibold">
                {wajibPajak.namaPemilik}
              </span>
            </div>

            <div className="flex items-center p-5 border-t lg:border-t-0 lg:ltr:border-l lg:rtl:border-r border-gray-200 dark:border-gray-900">
              <span className="ltr:mr-2 rtl:ml-2">No. NPWPD :</span>
              <span className="ltr:ml-auto rtl:mr-auto font-semibold">
                {wajibPajak.npwpd}
              </span>
            </div>
            <div className="flex items-center p-5 border-t lg:border-t-0 lg:ltr:border-l lg:rtl:border-r border-gray-200 dark:border-gray-900">
              <span className="ltr:mr-2 rtl:ml-2">Usia Bangunan :</span>
              <span className="ltr:ml-auto rtl:mr-auto font-semibold">
                {objekPajak.usia} Tahun
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:flex lg:-mx-4">
        <div className="lg:w-1/2 xl:w-2/3 lg:px-4">
          <div className="mt-5">
            <PopulasiTable data={proyPopuls} />
          </div>
        </div>

        <div className="lg:w-1/2 xl:w-1/3 lg:px-4 lg:pt-0">
          <div className="card p-5 mt-5">
            <div className="tabs">
              <nav className="tab-nav">
                <button className="nav-link h5 uppercase active">
                  Form Populasi
                </button>
              </nav>

              <div className="tab-content mt-5">
                <div className="collapse open">
                  <form
                    autoComplete="off"
                    onSubmit={handleSubmit(populasiHandler)}
                  >
                    <input
                      hidden
                      {...register("objekPajakId", { required: true })}
                      value={objekPajakId}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="mb-5">
                        <label
                          className="label block mb-2"
                          htmlFor="tgglProyeksi"
                        >
                          Tanggal Pendataan
                        </label>
                        <DatePicker
                          locale="id"
                          isClearable
                          dateFormat="dd/MM/yyyy"
                          innerRef={{
                            ...register("tgglProyeksi", { required: true }),
                          }}
                          className={"form-control"}
                          selected={dateProyeksi}
                          onChange={(val) => {
                            setDateProyeksi(val);
                            setValue("tgglProyeksi", val);
                          }}
                          showMonthDropdown
                          showYearDropdown
                          yearDropdownItemNumber={15}
                          scrollableYearDropdown
                          withPortal
                          portalId="root-portal"
                        />
                        <small className="block my-2 invalid-feedback">
                          {errors.tgglProyeksi?.type === "required" &&
                            "Field diatas tidak boleh kosong"}
                        </small>
                      </div>

                      <div className="mb-5">
                        <label className="label block mb-2" htmlFor="jumBur">
                          Populasi Burung
                        </label>
                        <input
                          id="jumBur"
                          type="number"
                          className="form-control"
                          {...register("jumBur", { required: true })}
                        />
                        <small className="block my-2 invalid-feedback">
                          {errors.jumBur?.type === "required" &&
                            "Field diatas tidak boleh kosong"}
                        </small>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <button
                        className="btn btn_primary ltr:mr-2 rtl:ml-2 uppercase"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(Survey), { ssr: false });

export async function getServerSideProps({ params }) {
  return { props: { params } };
}
