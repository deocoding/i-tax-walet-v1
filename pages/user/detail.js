import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import UserLayout from "../../components/layouts/user/UserLayout";
import { Store } from "../../utils/Store";

export default function UserDetail() {
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
    <UserLayout title="User Detail">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb">
        <h1>User Detail</h1>
        <ul>
          <li>
            <span>User</span>
          </li>
          <li className="divider las las-arrow-right"></li>
          <li>Detail</li>
        </ul>
      </section>

      <div className="lg:flex lg:-mx-4">
        {/* <!-- Content --> */}
        <div className="lg:w-1/2 xl:w-3/4 lg:px-4">
          <div className="card p-5">
            <form>
              <div className="mb-5 xl:w-1/2">
                <label className="label block mb-2" htmlFor="namaLengkap">
                  Nama Lengkap
                </label>
                <input id="namaLengkap" type="text" className="form-control" />
              </div>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="alamatLengkap">
                  Alamat Lengkap
                </label>
                <textarea
                  id="alamatLengkap"
                  className="form-control"
                  rows="16"
                ></textarea>
              </div>
              <div className="mb-5 xl:w-1/2">
                <label className="label block mb-2" htmlFor="kecamatan">
                  Kecamatan
                </label>
                <input id="kecamatan" type="text" className="form-control" />
              </div>
              <div className="mb-5 xl:w-1/2">
                <label className="label block mb-2" htmlFor="kabupatenkota">
                  Kabupaten/Kota
                </label>
                <input
                  id="kabupatenkota"
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="mb-5 xl:w-1/2">
                <label className="label block mb-2" htmlFor="hptelpon">
                  Nomor HP/Telpon
                </label>
                <input id="hptelpon" type="text" className="form-control" />
              </div>
            </form>
          </div>
        </div>

        {/* <!-- Detail --> */}
        <div className="lg:w-1/2 xl:w-1/4 lg:px-4 pt-5 lg:pt-0">
          {/* <!-- Featured Image --> */}
          <div className="card p-5">
            <h3>Foto Profil</h3>
            <button className="mt-5 btn btn_outlined btn_secondary uppercase">
              Browse
            </button>
          </div>
          <div className="relative mt-5 card p-5">
            <h3>Detail Akun</h3>
            <form className="mt-5">
              <div className="flex items-center">
                <div className="w-1/4">
                  <label className="label block">Username</label>
                </div>
                <div className="w-3/4 ml-2">
                  <div className="custom-select">
                    <input id="username" type="text" className="form-control" />
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-5">
                <div className="w-1/4">
                  <label className="label block">Email</label>
                </div>
                <div className="w-3/4 ml-2">
                  <input id="email" type="email" className="form-control" />
                </div>
              </div>
              <div className="flex items-center mt-5">
                <div className="w-1/4">
                  <label className="label block">Password</label>
                </div>
                <div className="w-3/4 ml-2">
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="relative mt-5 card p-5">
            <h3>Detail NPWPD</h3>
            <form className="mt-5">
              <div className="flex items-center">
                <div className="w-1/4">
                  <label className="label block">Status</label>
                </div>
                <div className="w-3/4 ml-2">
                  <div className="custom-select">
                    <select className="form-control">
                      <option>Pendataan</option>
                      <option>Perubahan</option>
                      <option>Penghapusan</option>
                    </select>
                    <div className="custom-select-icon las las-caret-down"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-5">
                <div className="w-1/4">
                  <label className="label block">NPWPD</label>
                </div>
                <div className="w-3/4 ml-2">
                  <input id="npwpd" type="text" className="form-control" />
                </div>
              </div>
            </form>
            <div className="mt-5 flex items-center">
              <button className="w-1/2 btn btn_primary mt-5 ltr:mr-2 rtl:ml-2 uppercase">
                Aktifkan
              </button>
              <button className="w-1/2 btn btn_outlined btn_secondary mt-5 uppercase">
                Simpan Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
