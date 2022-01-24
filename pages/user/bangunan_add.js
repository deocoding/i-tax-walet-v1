import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { VisitorsChart } from "../../components/charts/VisitorsChart.tsx";
import UserLayout from "../../components/layouts/user/UserLayout";
import { Store } from "../../utils/Store";

export default function UserBangunanAdd() {
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const [toggleState, setToggleState] = useState(1);

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }
  });

  const toggleTab = (index) => {
    setToggleState(index);
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
                <button
                  className={
                    toggleState === 1
                      ? "nav-link h5 uppercase active"
                      : "nav-link h5 uppercase"
                  }
                  onClick={() => toggleTab(1)}
                >
                  Peta Lokasi
                </button>
                <button
                  className={
                    toggleState === 2
                      ? "nav-link h5 uppercase active"
                      : "nav-link h5 uppercase"
                  }
                  onClick={() => toggleTab(2)}
                >
                  Potensi
                </button>
              </nav>
              <div className="tab-content mt-5">
                <div
                  id="tab-1"
                  className={toggleState === 1 ? "collapse open" : "collapse"}
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Commodi veritatis officiis, quidem placeat autem nihil
                  voluptatem velit quaerat adipisci veniam iste. Quae odio sint
                  dolorum aliquid eos numquam est ducimus! Lorem ipsum dolor,
                  sit amet consectetur adipisicing elit. Itaque enim alias odit
                  facilis, necessitatibus quam nulla! Sapiente nostrum nulla ut,
                  aspernatur nisi unde enim quas ipsam laudantium excepturi vel
                  consequuntur.
                </div>
                <div
                  id="tab-2"
                  className={toggleState === 2 ? "collapse open" : "collapse"}
                >
                  <div className="mt-5">
                    <VisitorsChart />
                  </div>
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
          <div className="relative mt-5 card p-5">
            <h3>Detail Alamat</h3>
            <form className="mt-5">
              <div className="flex items-center">
                <div className="w-1/4">
                  <label className="label block">Alamat Lengkap</label>
                </div>
                <div className="w-3/4 ml-2">
                  <div className="custom-select">
                    <input
                      id="alamatLengkap"
                      type="text"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-5">
                <div className="w-1/4">
                  <label className="label block">Kecamatan</label>
                </div>
                <div className="w-3/4 ml-2">
                  <div className="custom-select">
                    <input
                      id="kecamatan"
                      type="text"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-5">
                <div className="w-1/4">
                  <label className="label block">Kabupaten/ Kota</label>
                </div>
                <div className="w-3/4 ml-2">
                  <div className="custom-select">
                    <input
                      id="kabupatenkota"
                      type="text"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-5">
                <div className="w-1/4">
                  <label className="label block">Latitude</label>
                </div>
                <div className="w-3/4 ml-2">
                  <div className="custom-select">
                    <input id="latitude" type="text" className="form-control" />
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-5">
                <div className="w-1/4">
                  <label className="label block">Longitude</label>
                </div>
                <div className="w-3/4 ml-2">
                  <div className="custom-select">
                    <input
                      id="longitude"
                      type="text"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="relative mt-5 card p-5">
            <h3>Detail Bangunan</h3>
            <form className="mt-5">
              <div className="flex items-center">
                <div className="w-1/4">
                  <label className="label block">Tipe</label>
                </div>
                <div className="w-3/4 ml-2">
                  <div className="custom-select">
                    <select className="form-control">
                      <option>Permanen</option>
                      <option>Semi Permanen</option>
                    </select>
                    <div className="custom-select-icon las las-caret-down"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-5">
                <div className="w-1/4">
                  <label className="label block">Banyak Lantai</label>
                </div>
                <div className="w-3/4 ml-2">
                  <div className="custom-select">
                    <input
                      id="longitude"
                      type="text"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-5">
                <div className="w-1/4">
                  <label className="label block">No. SIMB</label>
                </div>
                <div className="w-3/4 ml-2">
                  <div className="custom-select">
                    <input
                      id="longitude"
                      type="text"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-5">
                <div className="w-1/4">
                  <label className="label block">No. SITU</label>
                </div>
                <div className="w-3/4 ml-2">
                  <div className="custom-select">
                    <input
                      id="longitude"
                      type="text"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </form>
            <div className="mt-5 flex items-center">
              <button className="w-1/2 btn btn_primary mt-5 ltr:mr-2 rtl:ml-2 uppercase">
                Ajukan Pendataan
              </button>
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
