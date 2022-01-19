import { useState } from "react";
import AdminLayout from "../../components/layouts/admin/AdminLayout";

export default function BangunanAdd() {
  return (
    <AdminLayout title="Bangunan">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb">
        <h1>Bangunan</h1>
        <ul>
          <li>
            <a href="#">Admin</a>
          </li>
          <li className="divider las las-arrow-right"></li>
          <li>
            <a href="#">Tambah Bangunan</a>
          </li>
        </ul>
      </section>

      <div className="lg:flex lg:-mx-4">
        {/* <!-- Content --> */}
        <div className="lg:w-1/2 xl:w-3/5 lg:px-4">
          <div className="card p-5">
            {/* Peta Lokasi | Grafik Potensi */}
            <h3>Peta Lokasi | Grafik Potensi</h3>
            <div className="mt-5">
              <canvas
                id="visitorsChart"
                width="762"
                height="500"
                style={{
                  display: "block",
                  boxSizing: "border-box",
                  height: 600 + "px",
                  width: 600 + "px",
                }}
              ></canvas>
            </div>
          </div>
        </div>

        {/* Potensi */}
        <div className="lg:w-1/2 xl:w-1/5 lg:px-4 pt-5 lg:pt-0">
          <div className="card p-5">
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
                Simpan
              </button>
            </div>
          </div>
        </div>

        {/* <!-- Detail --> */}
        <div className="lg:w-1/2 xl:w-1/5 lg:px-4 pt-5 lg:pt-0">
          {/* <!-- Featured Image --> */}
          <div className="card p-5">
            <h3>Foto Bangunan</h3>
            <button className="mt-5 btn btn_outlined btn_secondary uppercase">
              Browse
            </button>
          </div>
          <div className="relative mt-5 card p-5">
            <h3>Detail Burung</h3>
            <form className="mt-5">
              <div className="flex items-center">
                <div className="w-1/4">
                  <label className="label block">Banyak Burung</label>
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
                  <label className="label block">Per Tanggal</label>
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
            </form>
            <div className="mt-5 flex items-center">
              <button className="w-1/2 btn btn_primary mt-5 ltr:mr-2 rtl:ml-2 uppercase">
                Simpan
              </button>
            </div>
          </div>
          <div className="relative mt-5 card p-5">
            <h3 className="text-center">
              Potensi Pajak:{" "}
              <i className="las las-level-up-alt text-green-600 font-bold text-2xl">
                12%
              </i>
            </h3>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
