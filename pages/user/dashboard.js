import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ReactMapGL, { Marker, StaticMap } from "react-map-gl";
import UserLayout from "../../components/layouts/user/UserLayout";
import { Store } from "../../utils/Store";

export default function Dashboard() {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [bangunans, setBangunans] = useState([]);

  const LINE1 = `M210.29,164.71H61.71A5.71,5.71,0,0,0,56,170.43h0a5.71,5.71,0,0,0,5.71,5.71H128V264h16V176.14h66.29a5.71,5.71,0,0,0,5.71-5.71h0A5.71,5.71,0,0,0,210.29,164.71Z`;
  const LINE2 = `M70.84,90.3,78.11,83l6.29,77.81.32,3.94H187.28l.33-3.94L193.94,83l7.22,7.29a5.73,5.73,0,0,0,8.15,0,5.87,5.87,0,0,0,0-8.23L144.15,16.28l0-.05L136,8l0,.05,0-.05-8.15,8.23,0,.05L62.68,82.07a5.87,5.87,0,0,0,0,8.23A5.73,5.73,0,0,0,70.84,90.3Zm65.16-17a31.43,31.43,0,1,1-31.43,31.42A31.43,31.43,0,0,1,136,73.29Z`;

  const SIZE = 40;
  const [viewport, setViewport] = useState({
    width: "100%",
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

  return (
    <UserLayout title="Dashboard">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb">
        <h1>Dashboard</h1>
        <ul>
          <li>
            <span>User</span>
          </li>
          <li className="divider las las-arrow-right"></li>
          <li>Dashboard</li>
        </ul>
      </section>

      <div className="lg:flex lg:-mx-4">
        <div className="lg:w-1/2 lg:px-4">
          {/* <!-- Categories --> */}
          <div className="card p-5">
            <div className="tabs">
              <nav className="tab-nav">
                <button className="nav-link h5 uppercase active">
                  Peta Lokasi
                </button>
              </nav>
              <div className="tab-content mt-5">
                <div id="tab-1" className="collapse open map">
                  <StaticMap
                    mapboxApiAccessToken={
                      process.env.NEXT_PUBLIC_MAPBOX_API_KEY
                    }
                    {...viewport}
                  >
                    {" "}
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
                                >
                                  <path d={LINE1} />
                                  <path d={LINE2} />
                                </svg>
                              </span>
                            )}
                          </Marker>
                        </span>
                      ))}
                  </StaticMap>
                  {/* <ReactMapGL
                    {...viewport}
                    mapboxApiAccessToken={
                      process.env.NEXT_PUBLIC_MAPBOX_API_KEY
                    }
                    onViewportChange={(nextViewport) =>
                      setViewport(nextViewport)
                    }
                    mapStyle="mapbox://styles/deocoding/ckyes3rpu0tch14nwh4xw3g2g"
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
                                >
                                  <path d={LINE1} />
                                  <path d={LINE2} />
                                </svg>
                              </span>
                            )}
                          </Marker>
                        </span>
                      ))}
                  </ReactMapGL> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 lg:px-4 pt-5 lg:pt-0">
          {/* <!-- Summaries --> */}
          <div className="lg:flex lg:-mx-4">
            <div className="lg:w-1/2 lg:px-4">
              <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                <span className="text-primary text-5xl leading-none las las-bullseye"></span>
                <p className="mt-2">Target Pajak</p>
                <div className="text-primary mt-5 text-3xl leading-none">
                  Rp0
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 lg:px-4 pt-5 lg:pt-0">
              <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                <span className="text-primary text-5xl leading-none las las-chart-line"></span>
                <p className="mt-2">Realisasi</p>
                <div className="text-primary mt-5 text-3xl leading-none">
                  Rp0
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Summaries --> */}
          <div className="lg:flex mt-5 lg:-mx-4">
            <div className="lg:w-1/3 lg:px-4 lg:pt-0">
              <div className="rrelative card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                <span className="text-primary text-5xl leading-none las las-address-book"></span>
                <p className="mt-2">Status Pemilik</p>
                <div className="badge badge_outlined badge_secondary uppercase mt-5">
                  <div className="p-2 text-lg leading-none">Pendaftaran</div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
              <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                <span className="text-primary text-5xl leading-none las las-industry"></span>
                <p className="mt-2">Status Bangunan</p>
                <div className="badge badge_outlined badge_secondary uppercase mt-5">
                  <div className="p-2 text-lg leading-none">Pendaftaran</div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
              <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                <span className="text-primary text-5xl leading-none las las-receipt"></span>
                <p className="mt-2">Pelaporan Pajak</p>
                <div className="p-2 text-2xl leading-none mt-5">0</div>
              </div>
            </div>
          </div>

          {/* <!-- Recent Posts --> */}
          <div className="card mt-5 p-5">
            <h3 className="uppercase pb-3">Pelaporan pajak terbaru</h3>
            <table className="table table_list mt-3 w-full">
              <thead>
                <tr>
                  <th className="w-px ltr:text-left rtl:text-right uppercase">
                    Penjualan
                  </th>
                  <th className="w-px uppercase">Total Pajak</th>
                  <th className="w-px uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3}>Data Kosong</td>
                </tr>
                {/* <tr>
                  <td>15 Kg</td>
                  <td className="text-center">Rp5.000.000</td>
                  <td className="text-center">
                    <div className="badge badge_outlined badge_secondary uppercase">
                      Denda
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>17 Kg</td>
                  <td className="text-center">Rp6.000.000</td>
                  <td className="text-center">
                    <div className="badge badge_outlined badge_success uppercase">
                      Lunas
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>4 Kg</td>
                  <td className="text-center">Rp1.500.000</td>
                  <td className="text-center">
                    <div className="badge badge_outlined badge_warning uppercase">
                      Kurang
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>24 Kg</td>
                  <td className="text-center">Rp10.000.000</td>
                  <td className="text-center">
                    <div className="badge badge_outlined badge_info uppercase">
                      Proses
                    </div>
                  </td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
