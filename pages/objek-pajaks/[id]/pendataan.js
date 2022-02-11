import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AppLayout from "../../../components/layouts/app/AppLayout";
import { Store } from "../../../utils/Store";
import dynamic from "next/dynamic";

import DatePicker, { registerLocale } from "react-datepicker";
import id from "date-fns/locale/id";
registerLocale("id", id);
import "moment/locale/id";

import ReactMapGL, {
  Marker,
  Popup,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";

import Moment from "react-moment";
import ObjekPajakDropzone from "../../../components/dropzone/ObjekPajakDropzone";
import Image from "next/image";
import OpSlider from "../../../components/slider/OpSlider";

function ObjekPajaks({ params }) {
  const objekPajakId = params.id;
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const LINE1 = `M210.29,164.71H61.71A5.71,5.71,0,0,0,56,170.43h0a5.71,5.71,0,0,0,5.71,5.71H128V264h16V176.14h66.29a5.71,5.71,0,0,0,5.71-5.71h0A5.71,5.71,0,0,0,210.29,164.71Z`;
  const LINE2 = `M70.84,90.3,78.11,83l6.29,77.81.32,3.94H187.28l.33-3.94L193.94,83l7.22,7.29a5.73,5.73,0,0,0,8.15,0,5.87,5.87,0,0,0,0-8.23L144.15,16.28l0-.05L136,8l0,.05,0-.05-8.15,8.23,0,.05L62.68,82.07a5.87,5.87,0,0,0,0,8.23A5.73,5.73,0,0,0,70.84,90.3Zm65.16-17a31.43,31.43,0,1,1-31.43,31.42A31.43,31.43,0,0,1,136,73.29Z`;

  const SIZE = 40;

  const geolocateStyle = {
    top: 0,
    left: 0,
    padding: "10px",
  };

  const fullscreenControlStyle = {
    top: 36,
    left: 0,
    padding: "10px",
  };

  const [viewport, setViewport] = useState({
    width: "calc(100% - 88px)",
    height: "100%",
    latitude: -2.2139,
    longitude: 113.9196,
    zoom: 10,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    setFocus,
  } = useForm();

  const [wajibPajak, setWajibPajak] = useState([]);
  const [objPajaks, setObjPajaks] = useState([]);
  const [objekPajak, setObjekPajak] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState(false);

  const [dateSimb, setDateSimb] = useState();
  const [dateSitu, setDateSitu] = useState();

  const [newPlace, setNewPlace] = useState(null);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [bangunanId, setBangunanId] = useState(null);
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      const fetchObjekPajak = async () => {
        try {
          const { data } = await axios.get(
            `/api/objek-pajaks/pendataan/${objekPajakId}`,
            {
              headers: {
                authorization: `Bearer ${userInfo.token}`,
              },
            }
          );
          if (data) {
            setObjekPajak(data.objekPajak);
            setWajibPajak(data.wajibPajak);
            setValue("alamatLengkap", data.objekPajak.alamatLengkap);
            setValue("simb", data.objekPajak.simb);
            setValue("situ", data.objekPajak.situ);
            if (data.objekPajak.tgglSimb) {
              setValue("tgglSimb", new Date(data.objekPajak.tgglSimb));
              setDateSimb(new Date(data.objekPajak.tgglSimb));
            }
            if (data.objekPajak.tgglSitu) {
              setValue("tgglSitu", new Date(data.objekPajak.tgglSimb));
              setDateSitu(new Date(data.objekPajak.tgglSitu));
            }
            setValue("lat", data.objekPajak.lat);
            setValue("long", data.objekPajak.long);
            setValue("tipe", data.objekPajak.tipe);
            setValue("jumLan", data.objekPajak.jumLan);

            setObjPajaks(data.objPajaks);
            if (data.latAkhir && data.longAkhir) {
              setViewport({
                ...viewport,
                latitude: Number(data.latAkhir),
                longitude: Number(data.longAkhir),
                zoom: 11,
              });
            }
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchObjekPajak();
    }
  }, [objekPajakId]);

  // console.log(objekPajak.kumpFoto);

  const objekPajakHandler = async ({
    objekPajakId,
    alamatLengkap,
    simb,
    tgglSimb,
    situ,
    tgglSitu,
    lat,
    long,
    tipe,
    jumLan,
  }) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        "/api/objek-pajaks/pendataan",
        {
          objekPajakId,
          alamatLengkap,
          simb,
          tgglSimb,
          situ,
          tgglSitu,
          lat,
          long,
          tipe,
          jumLan,
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
          router.reload();
        }, 1500);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;
    setCurrentPlaceId(null);
    setNewPlace({
      lat,
      long,
    });

    setBangunanId(null);
    setLat(lat);
    setLong(long);

    setValue("lat", lat);
    setValue("long", long);

    setFocus("tipe");
  };

  const handleMarkerClick = (
    id,
    lat,
    long,
    kec,
    tipe,
    alamat,
    user,
    jumLan,
    simb,
    situ,
    status
  ) => {
    setNewPlace(null);
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const closePopupHandler = (e) => {
    setCurrentPlaceId(null);
  };

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // const onDrop = useCallback((acceptedFiles, rejectFiles) => {
  //   console.log("acceptedFiles", acceptedFiles);
  //   console.log("rejectFiles", rejectFiles);
  // });

  // const onDrop = useCallback((acceptedFiles) => {
  //   console.log("acceptedFiles", acceptedFiles);
  // }, []);

  return (
    <AppLayout title="Objek Pajak">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb">
        <h1>Objek Pajak</h1>
        <ul>
          <li>
            {userInfo && userInfo.role == 1 && <span>Superadmin</span>}
            {userInfo && userInfo.role == 2 && <span>Admin</span>}
            {userInfo && userInfo.role == 3 && <span>Surveyor</span>}
            {userInfo && userInfo.role == 4 && <span>Operator</span>}
          </li>
          <li className="divider las las-arrow-right"></li>
          <li>Pendataan</li>
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
          <div className="card p-5 mt-5">
            <div className="tabs">
              <nav className="tab-nav">
                <button className="nav-link h5 uppercase active">
                  Peta Lokasi
                </button>
              </nav>
              <div className="tab-content mt-5">
                <div id="tab-1" className="collapse open map">
                  <ReactMapGL
                    {...viewport}
                    mapboxApiAccessToken={
                      process.env.NEXT_PUBLIC_MAPBOX_API_KEY
                    }
                    onViewportChange={(nextViewport) =>
                      setViewport(nextViewport)
                    }
                    mapStyle="mapbox://styles/deocoding/ckyes3rpu0tch14nwh4xw3g2g"
                    onDblClick={handleAddClick}
                    transitionDuration={250}
                  >
                    {newPlace && (
                      <Marker latitude={newPlace.lat} longitude={newPlace.long}>
                        <span>
                          <svg
                            height={SIZE}
                            viewBox="0 0 272 272"
                            style={{
                              cursor: "pointer",
                              fill: "rgb(255 193 7 / 1)",
                              stroke: "none",
                              transform: `translate(${-SIZE / 2}px,${-SIZE}px)`,
                            }}
                          >
                            <path d={LINE1} />
                            <path d={LINE2} />
                          </svg>
                        </span>
                      </Marker>
                    )}

                    {objPajaks &&
                      objPajaks.map((wp) => (
                        <span key={wp._id}>
                          {wp.lat && wp.long && (
                            <Marker
                              latitude={JSON.parse(wp.lat)}
                              longitude={JSON.parse(wp.long)}
                            >
                              <span>
                                <svg
                                  height={SIZE}
                                  viewBox="0 0 272 272"
                                  style={{
                                    cursor: "pointer",
                                    fill: "rgb(40 167 69 / 1)",
                                    stroke: "none",
                                    transform: `translate(${
                                      -SIZE / 2
                                    }px,${-SIZE}px)`,
                                  }}
                                  onClick={() =>
                                    handleMarkerClick(
                                      wp._id,
                                      JSON.parse(wp.lat),
                                      JSON.parse(wp.long),
                                      wp.kec,
                                      wp.tipe,
                                      wp.alamatLengkap,
                                      wp.jumLan,
                                      wp.simb,
                                      wp.situ
                                    )
                                  }
                                >
                                  <path d={LINE1} />
                                  <path d={LINE2} />
                                </svg>
                              </span>
                            </Marker>
                          )}

                          {wp._id === currentPlaceId && wp.lat && wp.long && (
                            <Popup
                              latitude={JSON.parse(wp.lat)}
                              longitude={JSON.parse(wp.long)}
                              closeButton={true}
                              closeOnClick={false}
                              anchor="left"
                              onClose={() => closePopupHandler(null)}
                            >
                              <div className="flex justify-center">
                                <div className="block text-center">
                                  <div className="pb-2 border-b border-gray-300">
                                    {wp.sdhData && (
                                      <div className="badge badge_outlined badge_success uppercase">
                                        Pendataan{"  "}
                                        <i className="las las-check"></i>
                                      </div>
                                    )}

                                    {wp.sdhProyeksi ? (
                                      <div className="ml-2 badge badge_outlined badge_success uppercase">
                                        Proyeksi{"  "}
                                        <i className="las las-check"></i>
                                      </div>
                                    ) : (
                                      <div className="ml-2 badge badge_outlined badge_secondary uppercase">
                                        Proyeksi{"  "}
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-4">
                                    <h5 className="text-xl font-medium mb-2">
                                      {wp.alamatLengkap}
                                    </h5>
                                    <p className="text-gray-700 text-normal mb-2">
                                      {"Kec. " + wp.kec + ", " + wp.kabKot}
                                    </p>
                                    {wp.jumLan && (
                                      <p className="text-gray-700 text-base mb-2">
                                        {wp.jumLan} lantai
                                      </p>
                                    )}
                                  </div>
                                  <div className="pt-3 border-t border-gray-300 text-gray-600">
                                    <Moment fromNow>{wp.updatedAt}</Moment>
                                  </div>
                                </div>
                              </div>
                            </Popup>
                          )}
                        </span>
                      ))}
                    <GeolocateControl style={geolocateStyle} />
                    <FullscreenControl style={fullscreenControlStyle} />
                  </ReactMapGL>
                </div>
              </div>
            </div>
          </div>
          {objekPajak.kumpFoto && objekPajak.kumpFoto.length > 0 && (
            <div className="card p-5 mt-5">
              <OpSlider data={objekPajak.kumpFoto} />
            </div>
          )}
        </div>

        <div className="lg:w-1/2 xl:w-1/3 lg:px-4 lg:pt-0">
          <div className="card p-5 mt-5">
            <nav className="tab-nav mb-5">
              <button className="nav-link h5 uppercase active">
                Form Validasi
              </button>
            </nav>
            <form onSubmit={handleSubmit(objekPajakHandler)}>
              <input
                hidden
                {...register("objekPajakId", { required: true })}
                value={objekPajakId}
              />

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
                    No. SIMB
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
                  <label className="label block mb-2" htmlFor="tgglSimb">
                    Tanggal SIMB
                  </label>
                  <DatePicker
                    locale="id"
                    isClearable
                    innerRef={{
                      ...register("tgglSimb", { required: true }),
                    }}
                    className={"form-control"}
                    selected={dateSimb}
                    onChange={(val) => {
                      setDateSimb(val);
                      setValue("tgglSimb", val);
                    }}
                    showMonthDropdown
                    showYearDropdown
                    withPortal
                    portalId="root-portal"
                  />
                  <small className="block my-2 invalid-feedback">
                    {errors.tgglSimb?.type === "required" &&
                      "Field diatas tidak boleh kosong"}
                  </small>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-5">
                  <label className="label block mb-2" htmlFor="situ">
                    No.SITU
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

                <div className="mb-5">
                  <label className="label block mb-2" htmlFor="tgglSitu">
                    Tanggal SITU
                  </label>
                  <DatePicker
                    locale="id"
                    isClearable
                    innerRef={{
                      ...register("tgglSitu", { required: true }),
                    }}
                    className={"form-control"}
                    selected={dateSitu}
                    onChange={(val) => {
                      setDateSitu(val);
                      setValue("tgglSitu", val);
                    }}
                    showMonthDropdown
                    showYearDropdown
                    withPortal
                    portalId="root-portal"
                  />
                  <small className="block my-2 invalid-feedback">
                    {errors.tgglSitu?.type === "required" &&
                      "Field diatas tidak boleh kosong"}
                  </small>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-5">
                  <label className="label block mb-2" htmlFor="latitude">
                    Latitude
                  </label>
                  <input
                    id="latitude"
                    type="text"
                    className="form-control"
                    {...register("lat", { required: true })}
                  />
                  <small className="block my-2 invalid-feedback">
                    {errors.lat?.type === "required" &&
                      "Field diatas tidak boleh kosong"}
                  </small>
                </div>
                <div className="mb-5">
                  <label className="label block mb-2" htmlFor="longitude">
                    Longitude
                  </label>
                  <input
                    id="longitude"
                    type="text"
                    className="form-control"
                    {...register("long", { required: true })}
                  />
                  <small className="block my-2 invalid-feedback">
                    {errors.long?.type === "required" &&
                      "Field diatas tidak boleh kosong"}
                  </small>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="mb-5">
                  <label className="label block mb-2" htmlFor="tipeBangunan">
                    Tipe Bangunan
                  </label>
                  <div className="custom-select">
                    <select className="form-control" {...register("tipe")}>
                      <option value="Permanen">Permanen</option>
                      <option value="Semi Permanen">Semi Permanen</option>
                      <option value="Darurat">Darurat</option>
                    </select>
                    <div className="custom-select-icon las las-caret-down"></div>
                  </div>
                </div>
                <div className="mb-5">
                  <label className="label block mb-2" htmlFor="jumLan">
                    Jumlah Lantai
                  </label>
                  <input
                    id="jumLan"
                    type="number"
                    className="form-control"
                    {...register("jumLan")}
                  />
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

          <div className="card p-5 mt-5">
            <div className="tabs">
              <nav className="tab-nav">
                <button className="nav-link h5 uppercase active">
                  Upload Foto Bangunan
                </button>
              </nav>
            </div>
            <ObjekPajakDropzone id={objekPajakId} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(ObjekPajaks), { ssr: false });

export async function getServerSideProps({ params }) {
  return { props: { params } };
}
