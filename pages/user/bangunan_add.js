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

function UserBangunanAdd() {
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
    width: "-webkit-calc(100% - 5.5rem)",
    height: "65vh",
    latitude: -2.2074,
    longitude: 113.9164,
    zoom: 13,
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
        { alamat, kec, kabKot, tipe, jumLan, jumBur, simb, situ, lat, long },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      // Cookies.set("userInfo", data);
      // return router.reload();
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
                <div
                  id="tab-1"
                  className="collapse open"
                  style={{
                    width: "calc(100%)",
                    height: "calc(65vh)",
                  }}
                >
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
                            offsetLeft={-30}
                            offsetTop={-30}
                          >
                            {bangunan.status === 1 && (
                              <span>
                                <i
                                  className="las las-map-pin"
                                  style={{
                                    fontSize: viewport.zoom * 4,
                                    color: "darkcyan",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleMarkerClick(
                                      bangunan._id,
                                      JSON.parse(bangunan.lat),
                                      JSON.parse(bangunan.long)
                                    )
                                  }
                                ></i>
                              </span>
                            )}
                            {bangunan.status === 2 && (
                              <span>
                                <i
                                  className="las las-map-pin"
                                  style={{
                                    fontSize: viewport.zoom * 4,
                                    color: "darkgoldenrod",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    handleMarkerClick(
                                      bangunan._id,
                                      JSON.parse(bangunan.lat),
                                      JSON.parse(bangunan.long)
                                    )
                                  }
                                ></i>
                              </span>
                            )}
                            {bangunan.status === 3 && (
                              <i
                                className="las las-map-pin"
                                style={{
                                  fontSize: viewport.zoom * 4,
                                  color: "darkblue",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleMarkerClick(
                                    bangunan._id,
                                    JSON.parse(bangunan.lat),
                                    JSON.parse(bangunan.long)
                                  )
                                }
                              ></i>
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
                                <div className="block rounded-lg shadow-lg bg-white max-w-sm text-center">
                                  <div className="py-3 px-6 border-b border-gray-300">
                                    Bangunan {bangunan.tipe}{" "}
                                    <i className="las las-check"></i>
                                  </div>
                                  <div className="p-6">
                                    <h5 className="text-gray-900 text-xl font-medium mb-2">
                                      {bangunan.jumLan} lantai,{" "}
                                      {bangunan.jumBur} burung
                                    </h5>
                                    <p className="text-gray-700 text-base mb-4">
                                      {bangunan.alamat +
                                        ", Kecamatan " +
                                        bangunan.kec +
                                        " " +
                                        bangunan.kabKot}
                                    </p>
                                  </div>
                                  <div className="py-3 px-6 border-t border-gray-300 text-gray-600">
                                    <Moment fromNow locale="id">
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
                        <div className="block p-6 rounded-lg shadow-lg bg-white max-w-md">
                          <div className="pb-2 uppercase font-bold">
                            Tambah Bangunan
                          </div>
                          <form onSubmit={bangunansHandler}>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="form-group mb-3">
                                <input
                                  type="text"
                                  className="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                  id="exampleInput123"
                                  aria-describedby="emailHelp123"
                                  placeholder="Longitude"
                                  defaultValue={newPlace.long}
                                  onChange={(e) => setLong(e.target.value)}
                                />
                              </div>
                              <div className="form-group mb-3">
                                <input
                                  type="text"
                                  className="form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                  id="exampleInput124"
                                  aria-describedby="emailHelp124"
                                  placeholder="Latitude"
                                  defaultValue={newPlace.lat}
                                  onChange={(e) => setLat(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="form-group mb-3">
                              <input
                                type="text"
                                autoFocus
                                className="form-control block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="exampleInput125"
                                placeholder="Alamat lengkap"
                                onChange={(e) => setAlamat(e.target.value)}
                              />
                            </div>
                            <div className="form-group mb-3">
                              <input
                                type="text"
                                className="form-control block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="exampleInput125"
                                placeholder="Kecamatan"
                                onChange={(e) => setKec(e.target.value)}
                              />
                            </div>
                            <div className="form-group mb-3">
                              <input
                                type="text"
                                className="form-control block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="exampleInput125"
                                placeholder="Kabupaten/Kota"
                                onChange={(e) => setKabKot(e.target.value)}
                              />
                            </div>
                            <div className="form-group mb-3">
                              <select
                                className="form-select appearance-none
      block
      w-full
      px-3
      py-1.5
      text-base
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                aria-label="Default select example"
                                onChange={(e) => setTipe(e.target.value)}
                              >
                                <option defaultValue>Tipe bangunan</option>
                                <option value="Permanen">Permanen</option>
                                <option value="Semi Permanen">
                                  Semi Permanen
                                </option>
                                <option value="Darurat">Darurat</option>
                              </select>
                            </div>
                            <div className="form-group mb-3">
                              <input
                                type="text"
                                className="form-control block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="exampleInput125"
                                placeholder="Jumlah Lantai"
                                onChange={(e) => setJumLan(e.target.value)}
                              />
                            </div>
                            <div className="form-group mb-3">
                              <input
                                type="text"
                                className="form-control block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="exampleInput125"
                                placeholder="Banyak Burung"
                                onChange={(e) => setJumBur(e.target.value)}
                              />
                            </div>
                            <div className="form-group mb-3">
                              <input
                                type="text"
                                className="form-control block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="exampleInput125"
                                placeholder="No. SIMB"
                                onChange={(e) => setSimb(e.target.value)}
                              />
                            </div>
                            <div className="form-group mb-3">
                              <input
                                type="text"
                                className="form-control block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                id="exampleInput125"
                                placeholder="No. SITU"
                                onChange={(e) => setSitu(e.target.value)}
                              />
                            </div>
                            <button
                              type="submit"
                              className="
      w-full
      px-6
      py-2.5
      bg-blue-600
      text-white
      font-medium
      text-xs
      leading-tight
      uppercase
      rounded
      shadow-md
      hover:bg-blue-700 hover:shadow-lg
      focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
      active:bg-blue-800 active:shadow-lg
      transition
      duration-150
      ease-in-out"
                            >
                              Ajukan Bangunan Baru
                            </button>
                          </form>
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
          <div className="relative card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
            <span className="text-primary text-6xl leading-none las las-address-book"></span>
            <p className="mt-2 text-xl">Status Bangunan</p>
            <div className="badge badge_outlined badge_secondary uppercase mt-5">
              <div className="p-2 text-2xl leading-none">Pendaftaran</div>
            </div>
          </div>
          <div className="card p-5 mt-5">
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
            <h3>Dropzone</h3>
            <div className="dropzone mt-5">
              <h3>Drop files here to upload</h3>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default dynamic(() => Promise.resolve(UserBangunanAdd), { ssr: false });
