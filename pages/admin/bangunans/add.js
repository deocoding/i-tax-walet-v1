import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ProyeksiChart } from "../../../components/charts/ProyeksiChart.tsx";
import AdminLayout from "../../../components/layouts/admin/AdminLayout";
import { Store } from "../../../utils/Store";
import ReactMapGL, {
  Marker,
  Popup,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";
import Moment from "react-moment";
import "moment/locale/id";
import { getError } from "../../../utils/error";
import axios from "axios";
import dynamic from "next/dynamic";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { useForm } from "react-hook-form";
import id from "date-fns/locale/id";
registerLocale("id", id);

function UserBangunan() {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [bangunans, setBangunans] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);

  const [bangunanId, setBangunanId] = useState(null);
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");

  const [proyeksi, setProyeksi] = useState(false);
  const [bangBulans, setBangBulans] = useState([]);
  const [bangBurungs, setBangBurungs] = useState([]);
  const [bangSarangs, setBangSarangs] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

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
    latitude: -1.9978,
    longitude: 113.7621,
    zoom: 9,
  });

  const {
    register,
    formState: { errors },
    setValue,
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
      const fetchBangunans = async () => {
        try {
          const res = await axios.get("/api/admin/bangunans/", {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setBangunans(res.data);
        } catch (err) {
          console.log(err);
        }
      };

      fetchBangunans();

      const fetchUsers = async () => {
        try {
          const res = await axios.get("/api/admin/users/", {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setUsers(res.data);
        } catch (err) {
          console.log(err);
        }
      };

      fetchUsers();
    }
  }, []);

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
    status,
    proyeksi
  ) => {
    setNewPlace(null);
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });

    setValue("bangunanId", id);
    setValue("lat", lat);
    setValue("long", long);
    setValue("kec", kec);
    setValue("tipe", tipe);
    setValue("userBangunan", user);
    setValue("alamat", alamat);
    setValue("tipe", tipe);
    setValue("jumLan", jumLan);
    setValue("simb", simb);
    setValue("situ", situ);
    setValue("status", status);
    setProyeksi(true);

    setValue2("bangunanId", id);
    setValue2("bulTah", new Date());

    bangBulanHandler(id);
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

    setValue("bangunanId", null);
    setValue("kec", "");
    setValue("tipe", "");
    setValue("userBangunan", "");
    setValue("alamat", "");
    setValue("tipe", "");
    setValue("jumLan", "");
    setValue("simb", "");
    setValue("situ", "");
    setValue("status", "");

    setProyeksi(false);
  };

  const closePopupHandler = (e) => {
    setCurrentPlaceId(null);
    setBangunanId(null);

    setValue("bangunanId", null);
    setValue("lat", "");
    setValue("long", "");
    setValue("kec", "");
    setValue("tipe", "");
    setValue("userBangunan", "");
    setValue("alamat", "");
    setValue("tipe", "");
    setValue("jumLan", "");
    setValue("simb", "");
    setValue("situ", "");
    setValue("status", "");

    setProyeksi(false);
  };

  let inputProps = {
    autoComplete: false,
  };

  const bangBulanHandler = async (bangId) => {
    try {
      const { data } = await axios.get(
        `/api/admin/bangunans/bulans?id=${bangId}`,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (data) {
        setBangBulans(data.bulans);
        setBangBurungs(data.burungs);
        setBangSarangs(data.sarangs);
      }
    } catch (err) {
      alert(getError(err));
    }
  };

  console.log(JSON.stringify(bangBulans));

  const bangunansHandler = async ({
    bangunanId,
    lat,
    long,
    userBangunan,
    kec,
    alamat,
    tipe,
    simb,
    situ,
    jumLan,
    jumBur,
    status,
  }) => {
    try {
      const { data } = await axios.post(
        "/api/admin/bangunans/add",
        {
          bangunanId,
          lat,
          long,
          userBangunan,
          kec,
          alamat,
          tipe,
          simb,
          situ,
          jumLan,
          jumBur,
          status,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      alert(data.pesan);
      // Cookies.set("userInfo", data);
      return router.reload();
    } catch (err) {
      alert(getError(err));
    }
  };

  const proyeksiHandler = async ({ bangunanId, bulTah, jumBur }) => {
    try {
      const { data } = await axios.post(
        "/api/admin/bangunans/proyeksi",
        {
          bangunanId,
          bulTah,
          jumBur,
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      // console.log(data);
      alert(data.pesan);
      // Cookies.set("userInfo", data);
      return router.reload();
    } catch (err) {
      alert(getError(err));
    }
  };

  // console.log(proyeksi);

  return (
    <AdminLayout title="Bangunan">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb">
        <h1>Bangunan</h1>
        <ul>
          <li>
            <span>User</span>
          </li>
          <li className="divider las las-arrow-right"></li>
          <li>Tambah Bangunan</li>
        </ul>
      </section>

      <div className="lg:flex lg:-mx-4">
        {/* <!-- Content --> */}
        <div className="lg:w-1/2 xl:w-2/3 lg:px-4">
          <div className="card p-5">
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

                    {bangunans &&
                      bangunans.map((bangunan) => (
                        <span key={bangunan._id}>
                          <Marker
                            latitude={JSON.parse(bangunan.lat)}
                            longitude={JSON.parse(bangunan.long)}
                          >
                            {bangunan.status === 1 && (
                              <span>
                                <svg
                                  height={SIZE}
                                  viewBox="0 0 272 272"
                                  style={{
                                    cursor: "pointer",
                                    fill: "rgb(85 85 85 / 1)",
                                    stroke: "none",
                                    transform: `translate(${
                                      -SIZE / 2
                                    }px,${-SIZE}px)`,
                                  }}
                                  onClick={() =>
                                    handleMarkerClick(
                                      bangunan._id,
                                      JSON.parse(bangunan.lat),
                                      JSON.parse(bangunan.long),
                                      bangunan.kec,
                                      bangunan.tipe,
                                      bangunan.alamat,
                                      bangunan.user,
                                      bangunan.jumLan,
                                      bangunan.imb,
                                      bangunan.itu,
                                      bangunan.status,
                                      bangunan.proyeksi
                                    )
                                  }
                                >
                                  <path d={LINE1} />
                                  <path d={LINE2} />
                                </svg>
                              </span>
                            )}
                            {bangunan.status === 2 && (
                              <span>
                                <svg
                                  height={SIZE}
                                  viewBox="0 0 272 272"
                                  style={{
                                    cursor: "pointer",
                                    fill: "rgb(23 162 184 / 1)",
                                    stroke: "none",
                                    transform: `translate(${
                                      -SIZE / 2
                                    }px,${-SIZE}px)`,
                                  }}
                                  onClick={() =>
                                    handleMarkerClick(
                                      bangunan._id,
                                      JSON.parse(bangunan.lat),
                                      JSON.parse(bangunan.long),
                                      bangunan.kec,
                                      bangunan.tipe,
                                      bangunan.alamat,
                                      bangunan.user,
                                      bangunan.jumLan,
                                      bangunan.imb,
                                      bangunan.itu,
                                      bangunan.status,
                                      bangunan.proyeksi
                                    )
                                  }
                                >
                                  <path d={LINE1} />
                                  <path d={LINE2} />
                                </svg>
                              </span>
                            )}
                            {bangunan.status === 3 && (
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
                                      bangunan._id,
                                      JSON.parse(bangunan.lat),
                                      JSON.parse(bangunan.long),
                                      bangunan.kec,
                                      bangunan.tipe,
                                      bangunan.alamat,
                                      bangunan.user,
                                      bangunan.jumLan,
                                      bangunan.imb,
                                      bangunan.itu,
                                      bangunan.status,
                                      bangunan.proyeksi
                                    )
                                  }
                                >
                                  <path d={LINE1} />
                                  <path d={LINE2} />
                                </svg>
                              </span>
                            )}
                          </Marker>
                          {bangunan._id === currentPlaceId && (
                            <Popup
                              latitude={JSON.parse(bangunan.lat)}
                              longitude={JSON.parse(bangunan.long)}
                              closeButton={true}
                              closeOnClick={false}
                              anchor="left"
                              onClose={() => closePopupHandler(null)}
                            >
                              <div className="flex justify-center">
                                <div className="block text-center">
                                  <div className="pb-2 border-b border-gray-300">
                                    {bangunan.status === 1 && (
                                      <div className="badge badge_outlined badge_secondary uppercase">
                                        Pendaftaran
                                      </div>
                                    )}
                                    {bangunan.status === 2 && (
                                      <div className="badge badge_outlined badge_info uppercase">
                                        Pendataan
                                      </div>
                                    )}
                                    {bangunan.status === 3 && (
                                      <div className="badge badge_outlined badge_success uppercase">
                                        Valid
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-4">
                                    <h5 className="text-xl font-medium mb-2">
                                      {bangunan.alamat}
                                    </h5>
                                    <p className="text-gray-700 text-normal mb-2">
                                      {"Kec. " +
                                        bangunan.kec +
                                        ", " +
                                        bangunan.kabKot}
                                    </p>
                                    {bangunan.jumLan && bangunan.jumBur && (
                                      <p className="text-gray-700 text-base mb-2">
                                        {bangunan.jumLan} lantai,{" "}
                                        {bangunan.jumBur} burung
                                      </p>
                                    )}
                                  </div>
                                  <div className="pt-3 border-t border-gray-300 text-gray-600">
                                    <Moment fromNow>
                                      {bangunan.updatedAt}
                                    </Moment>
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
          {proyeksi && (
            <div className="card p-5 mt-5">
              <div className="tabs">
                <nav className="tab-nav">
                  <button className="nav-link h5 uppercase active">
                    Potensi Pajak
                  </button>
                </nav>
                <div className="tab-content mt-5">
                  <div id="tab-2" className="collapse open">
                    <div className="mt-5">
                      <ProyeksiChart
                        bulans={bangBulans}
                        burungs={bangBurungs}
                        sarangs={bangSarangs}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Potensi */}

        {/* <!-- Featured Image --> */}

        <div className="lg:w-1/2 xl:w-1/3 lg:px-4 pt-5 lg:pt-0">
          <div className="card p-5">
            <h3>Tambah Bangunan</h3>
            <div className="mt-5">
              <form onSubmit={handleSubmit(bangunansHandler)}>
                {bangunanId && (
                  <input type="hidden" {...register("bangunanId")} />
                )}

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
                    <label className="label block mb-2" htmlFor="userName">
                      User
                    </label>
                    <div className="custom-select">
                      <select
                        className="form-control"
                        {...register("userBangunan", { required: true })}
                      >
                        {users &&
                          users.map((user) => (
                            <option key={user._id} value={user._id}>
                              {user.namaLengkap}
                            </option>
                          ))}
                      </select>
                      <div className="custom-select-icon las las-caret-down"></div>
                    </div>
                    <small className="block my-2 invalid-feedback">
                      {errors.userBangunan?.type === "required" &&
                        "Field diatas tidak boleh kosong"}
                    </small>
                  </div>
                  <div className="mb-5">
                    <label className="label block mb-2" htmlFor="kecamatan">
                      Kecamatan
                    </label>
                    <div className="custom-select">
                      <select
                        className="form-control"
                        {...register("kec", { required: true })}
                      >
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
                    rows="4"
                    {...register("alamat", { required: true })}
                  ></textarea>
                  <small className="block my-2 invalid-feedback">
                    {errors.alamat?.type === "required" &&
                      "Field diatas tidak boleh kosong"}
                  </small>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="mb-5">
                    <label className="label block mb-2" htmlFor="simb">
                      No. SIMB
                    </label>
                    <input
                      id="simb"
                      type="text"
                      className="form-control"
                      {...register("simb")}
                    />
                  </div>
                  <div className="mb-5">
                    <label className="label block mb-2" htmlFor="situ">
                      No. SITU
                    </label>
                    <input
                      id="situ"
                      type="text"
                      className="form-control"
                      {...register("situ")}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="label block mb-2" htmlFor="status">
                    Status
                  </label>
                  <div className="custom-select">
                    <select
                      className="form-control"
                      {...register("status", { required: true })}
                    >
                      <option defaultValue>Pilih status</option>
                      <option value={1}>Pendaftaran</option>
                      <option value={2}>Pendataan</option>
                      <option value={3}>Valid</option>
                    </select>
                    <div className="custom-select-icon las las-caret-down"></div>
                  </div>
                  <small className="block my-2 invalid-feedback">
                    {errors.status?.type === "required" &&
                      "Field diatas tidak boleh kosong"}
                  </small>
                </div>

                <div className="mt-5">
                  <button type="submit" className="btn btn_primary uppercase">
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* <div className="card p-5 mt-5">
            <h3>Upload Foto Bangunan </h3>
            <div className="dropzone mt-5">
              <h3>Geser dan lepaskan gambar disini</h3>
            </div>
          </div> */}

          {proyeksi && (
            <div className="card p-5 mt-5">
              <h3>Pendataan Berkala</h3>
              <div className="mt-5">
                <form
                  onSubmit={handleSubmit2(proyeksiHandler)}
                  autoComplete="off"
                >
                  {bangunanId && (
                    <input type="hidden" {...register2("bangunanId")} />
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mb-5">
                      <label className="label block mb-2" htmlFor="pendataanAt">
                        Bulan Tahun
                      </label>
                      <DatePicker
                        locale="id"
                        isClearable
                        innerRef={{
                          ...register2("bulTah", { required: true }),
                        }}
                        className={"form-control"}
                        selected={startDate}
                        dateFormat="dd/MM/yyyy"
                        showMonthYearPicker
                        onChange={(val) => {
                          setStartDate(val);
                          setValue2("bulTah", val);
                        }}
                      />

                      {/* <div className="input-group mt-5">
                        <input
                          type="text"
                          className="form-control input-group-item"
                          placeholder="Input"
                        />
                        <button
                          className="btn btn_primary uppercase input-group-item"
                          onClick={openCalendar}
                        >
                          Button
                        </button>
                      </div> */}

                      <small className="block my-2 invalid-feedback">
                        {errors2.bulTah?.type === "required" &&
                          "Field diatas tidak boleh kosong"}
                      </small>
                    </div>
                    <div className="mb-5">
                      <label className="label block mb-2" htmlFor="jumBur">
                        Jumlah Burung
                      </label>
                      <input
                        id="jumBur"
                        type="number"
                        className="form-control"
                        {...register2("jumBur", { required: true })}
                      />
                      <small className="block my-2 invalid-feedback">
                        {errors2.jumBur?.type === "required" &&
                          "Field diatas tidak boleh kosong"}
                      </small>
                    </div>
                  </div>
                  <div className="mt-5">
                    <button className="btn btn_primary uppercase">
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default dynamic(() => Promise.resolve(UserBangunan), { ssr: false });
