import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { VisitorsChart } from "../../components/charts/VisitorsChart.tsx";
import UserLayout from "../../components/layouts/user/UserLayout";
import { Store } from "../../utils/Store";
import ReactMapGL, {
  Marker,
  Popup,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";
import Moment from "react-moment";
import "moment/locale/id";
import { getError } from "../../utils/error";
import axios from "axios";
import dynamic from "next/dynamic";

function UserBangunan() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const [bangunans, setBangunans] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);

  const [alamat, setAlamat] = useState("");
  const [kec, setKec] = useState("");
  const [kabKot, setKabKot] = useState("");
  const [tipe, setTipe] = useState("");
  const [jumLan, setJumLan] = useState(null);
  const [jumBur, setJumBur] = useState(null);
  const [simb, setSimb] = useState("");
  const [situ, setSitu] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");

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
    latitude: -2.2074,
    longitude: 113.9164,
    zoom: 12,
  });

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      const fetchBangunans = async () => {
        try {
          const res = await axios.get("/api/bangunans/", {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setBangunans(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      const fetchLokAkhir = async () => {
        try {
          const res = await axios.get("/api/bangunans/last", {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          if (res) {
            setViewport({
              ...viewport,
              latitude: Number(res.data.latAkhir),
              longitude: Number(res.data.longAkhir),
            });
          }
        } catch (err) {
          console.log(err);
        }
      };

      fetchBangunans();
      fetchLokAkhir();
    }
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat,
      long,
    });
    setLat(lat);
    setLong(long);
  };

  const bangunansHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/bangunans",
        { alamat, kec, tipe, lat, long },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      // Cookies.set("userInfo", data);
      return router.reload();
    } catch (err) {
      alert(getError(err));
    }
  };

  return (
    <UserLayout title="Bangunan">
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
                                      JSON.parse(bangunan.long)
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
                                      JSON.parse(bangunan.long)
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
                                      JSON.parse(bangunan.long)
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
                              onClose={() => setCurrentPlaceId(null)}
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
                    {newPlace && (
                      <Popup
                        latitude={newPlace.lat}
                        longitude={newPlace.long}
                        closeButton={true}
                        closeOnClick={false}
                        anchor="left"
                        onClose={() => setNewPlace(null)}
                      >
                        <div className="p-2">
                          <h3>Tambah Bangunan</h3>
                          <div className="mt-3">
                            <form onSubmit={bangunansHandler}>
                              <input
                                type="hidden"
                                defaultValue={newPlace.long}
                                onChange={(e) => setLong(e.target.value)}
                              />
                              <input
                                type="hidden"
                                defaultValue={newPlace.lat}
                                onChange={(e) => setLat(e.target.value)}
                              />

                              <div className="mb-2">
                                <label
                                  className="label block mb-2"
                                  htmlFor="alamatLengkap"
                                >
                                  Alamat Lengkap
                                </label>
                                <textarea
                                  id="alamatLengkap"
                                  className="form-control"
                                  rows="4"
                                  onChange={(e) => setAlamat(e.target.value)}
                                ></textarea>
                              </div>
                              <div className="mb-2">
                                <label
                                  className="label block mb-2"
                                  htmlFor="kecamatan"
                                >
                                  Kecamatan
                                </label>
                                <input
                                  id="kecamatan"
                                  type="text"
                                  className="form-control"
                                  onChange={(e) => setKec(e.target.value)}
                                />
                              </div>
                              <div className="mb-2">
                                <label
                                  className="label block mb-2"
                                  htmlFor="tipe-bangunan"
                                >
                                  Tipe Bangunan
                                </label>
                                <div className="custom-select">
                                  <select
                                    className="form-control"
                                    onChange={(e) => setTipe(e.target.value)}
                                  >
                                    <option defaultValue>Tipe bangunan</option>
                                    <option value="Permanen">Permanen</option>
                                    <option value="Semi Permanen">
                                      Semi Permanen
                                    </option>
                                    <option value="Darurat">Darurat</option>
                                  </select>
                                  <div className="custom-select-icon las las-caret-down"></div>
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
                      </Popup>
                    )}
                    <GeolocateControl style={geolocateStyle} />
                    <FullscreenControl style={fullscreenControlStyle} />
                  </ReactMapGL>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Potensi */}
        <div className="lg:w-1/2 xl:w-1/3 lg:px-4 pt-5 lg:pt-0">
          {/* <!-- Featured Image --> */}
          <div className="card p-5">
            <div className="tabs">
              <nav className="tab-nav">
                <button className="nav-link h5 uppercase active">
                  Potensi
                </button>
              </nav>
              <div className="tab-content mt-5">
                <div id="tab-2" className="collapse open">
                  <div className="mt-5">
                    <VisitorsChart />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card mt-5 p-5">
            <h3>Upload Foto Bangunan </h3>
            <div className="dropzone mt-5">
              <h3>Geser dan lepaskan gambar disini</h3>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default dynamic(() => Promise.resolve(UserBangunan), { ssr: false });
