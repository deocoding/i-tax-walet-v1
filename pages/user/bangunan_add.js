import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import UserLayout from "../../components/layouts/user/UserLayout";
import { Store } from "../../utils/Store";

export default function UserBangunanAdd() {
  const router = useRouter();
  const { redirect } = router.query;
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }
  });

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
            <h3>Tabs</h3>
            <div className="tabs">
              <nav className="tab-nav mt-5">
                <button
                  className="nav-link h5 uppercase active"
                  data-toggle="tab"
                  data-target="#tab-1"
                >
                  Tab One
                </button>
                <button
                  className="nav-link h5 uppercase"
                  data-toggle="tab"
                  data-target="#tab-2"
                >
                  Tab Two
                </button>
                <button
                  className="nav-link h5 uppercase"
                  data-toggle="tab"
                  data-target="#tab-3"
                >
                  Tab Three
                </button>
              </nav>
              <div className="tab-content mt-5">
                <div id="tab-1" className="collapse open">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Commodi veritatis officiis, quidem placeat autem nihil
                  voluptatem velit quaerat adipisci veniam iste. Quae odio sint
                  dolorum aliquid eos numquam est ducimus! Lorem ipsum dolor,
                  sit amet consectetur adipisicing elit. Itaque enim alias odit
                  facilis, necessitatibus quam nulla! Sapiente nostrum nulla ut,
                  aspernatur nisi unde enim quas ipsam laudantium excepturi vel
                  consequuntur.
                </div>
                <div id="tab-2" className="collapse">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Commodi veritatis officiis, quidem placeat autem nihil
                  voluptatem velit quaerat adipisci veniam iste. Quae odio sint
                  dolorum aliquid eos numquam est ducimus! Lorem ipsum dolor,
                  sit amet consectetur adipisicing elit. Itaque enim alias odit
                  facilis, necessitatibus quam nulla! Sapiente nostrum nulla ut,
                  aspernatur nisi unde enim quas ipsam laudantium excepturi vel
                  consequuntur. Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Commodi veritatis officiis, quidem placeat
                  autem nihil voluptatem velit quaerat adipisci veniam iste.
                  Quae odio sint dolorum aliquid eos numquam est ducimus! Lorem
                  ipsum dolor, sit amet consectetur adipisicing elit. Itaque
                  enim alias odit facilis, necessitatibus quam nulla! Sapiente
                  nostrum nulla ut, aspernatur nisi unde enim quas ipsam
                  laudantium excepturi vel consequuntur.
                </div>
                <div id="tab-3" className="collapse">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Commodi veritatis officiis, quidem placeat autem nihil
                  voluptatem velit quaerat adipisci veniam iste. Quae odio sint
                  dolorum aliquid eos numquam est ducimus! Lorem ipsum dolor,
                  sit amet consectetur adipisicing elit. Itaque enim alias odit
                  facilis, necessitatibus quam nulla! Sapiente nostrum nulla ut,
                  aspernatur nisi unde enim quas ipsam laudantium excepturi vel
                  consequuntur.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Potensi */}
        <div className="lg:w-1/2 xl:w-1/3 lg:px-4 pt-5 lg:pt-0">
          {/* <!-- Featured Image --> */}
          <div className="card p-5">
            <h3>Foto Bangunan</h3>
            <button className="mt-5 btn btn_outlined btn_secondary uppercase">
              Browse
            </button>
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
        </div>
      </div>
    </UserLayout>
  );
}
