import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AppLayout from "../../components/layouts/app/AppLayout";
import { Store } from "../../utils/Store";
import { getError } from "../../utils/error";
import dynamic from "next/dynamic";
import Image from "next/image";

function ObjekPajaksAdd() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setFocus,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState(false);
  const [objekPajaks, setObjekPajaks] = useState([]);
  const [wajibPajaks, setWajibPajaks] = useState([]);

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      const fetchWajibPajaks = async () => {
        try {
          const { data } = await axios.get(`/api/objek-pajaks/wp-all`, {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          });
          if (data) {
            setWajibPajaks(data);
            setFocus("wajibPajak");
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchWajibPajaks();
    }
  }, []);

  const objekPajaksHandler = async ({
    wajibPajak,
    alamatLengkap,
    kec,
    simb,
    situ,
  }) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/objek-pajaks",
        {
          wajibPajak,
          alamatLengkap,
          kec,
          simb,
          situ,
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
          setObjekPajaks(data);

          setFocus("wajibPajak");
        }, 1500);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Objek Pajak">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb">
        <h1>Objek Pajak</h1>
        <ul>
          <li>{userInfo && userInfo.role === 1 && <span>Superadmin</span>}</li>
          <li className="divider las las-arrow-right"></li>
          <li>Tambah Objek Pajak</li>
        </ul>
      </section>

      <div className="lg:flex lg:-mx-4">
        <div className="w-full lg:px-4">
          <div className="card p-5">
            <nav className="tab-nav mb-5">
              <button className="nav-link h5 uppercase active">
                Form Tambah
              </button>
            </nav>
            <form onSubmit={handleSubmit(objekPajaksHandler)}>
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
                  <label className="label block mb-2" htmlFor="kec">
                    Kecamatan
                  </label>
                  <div className="custom-select">
                    <select
                      className="form-control"
                      {...register("kec", { required: true })}
                    >
                      <option value="">Pilih kecamatan</option>
                      <option value="Pahandut">Pahandut</option>
                      <option value="Jekan Raya">Jekan Raya</option>
                      <option value="Sabangau">Sabangau</option>
                      <option value="Bukit Batu">Bukit Batu</option>
                      <option value="Rakumpit">Rakumpit</option>
                    </select>
                    <div className="custom-select-icon las las-caret-down"></div>
                  </div>
                  <small className="block my-2 invalid-feedback">
                    {errors.kec?.type === "required" &&
                      "Field diatas tidak boleh kosong"}
                  </small>
                </div>
              </div>

              <div className="mb-5">
                <label className="label block mb-2" htmlFor="alamatLengkap">
                  Alamat Lengkap
                </label>
                <textarea
                  id="alamatLengkap"
                  className="form-control"
                  {...register("alamatLengkap", { required: true })}
                  rows="4"
                ></textarea>
                <small className="block my-2 invalid-feedback">
                  {errors.alamatLengkap?.type === "required" &&
                    "Field diatas tidak boleh kosong"}
                </small>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-5">
                  <label className="label block mb-2" htmlFor="simb">
                    Surat Ijin Mendirikan Bangunan
                  </label>
                  <input
                    id="simb"
                    type="text"
                    className="form-control"
                    {...register("simb", { required: true })}
                  />
                  <small className="block my-2 invalid-feedback">
                    {errors.simb?.type === "required" &&
                      "Field diatas tidak boleh kosong"}
                  </small>
                </div>

                <div className="mb-5">
                  <label className="label block mb-2" htmlFor="situ">
                    Surat Ijin Tempat Usaha
                  </label>
                  <input
                    id="situ"
                    type="text"
                    className="form-control"
                    {...register("situ", { required: true })}
                  />
                  <small className="block my-2 invalid-feedback">
                    {errors.situ?.type === "required" &&
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
        </div>
      </div>
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(ObjekPajaksAdd), { ssr: false });
