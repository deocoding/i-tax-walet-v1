import { useState } from "react";
import AdminLayout from "../../components/layouts/admin/AdminLayout";

export default function PajakAdd() {
  return (
    <AdminLayout title="User">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb">
        <h1>Pajak</h1>
        <ul>
          <li>
            <a href="#">Admin</a>
          </li>
          <li className="divider las las-arrow-right"></li>
          <li>
            <a href="#">Tambah Pajak</a>
          </li>
        </ul>
      </section>

      <div className="lg:flex lg:-mx-4">
        {/* <!-- Content --> */}
        <div className="lg:w-1/2 xl:w-3/4 lg:px-4">
          <div className="card p-5">
            <form>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="namaLengkap">
                  NPWPD
                </label>
                <input id="namaLengkap" type="text" className="form-control" />
              </div>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="kecamatan">
                  Volume/Tonase
                </label>
                <input id="kecamatan" type="text" className="form-control" />
              </div>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="kabupatenkota">
                  Nilai Jual
                </label>
                <input
                  id="kabupatenkota"
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="hptelpon">
                  Total Pajak
                </label>
                <input id="hptelpon" type="text" className="form-control" />
              </div>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="kabupatenkota">
                  Total Pembayaran
                </label>
                <input
                  id="kabupatenkota"
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="hptelpon">
                  Pada Tanggal
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
            <h3>Foto Bukti Pembayaran</h3>
            <button className="mt-5 btn btn_outlined btn_secondary uppercase">
              Browse
            </button>
          </div>
          <div className="relative mt-5 card p-5">
            <h3>Detail Pembayaran Pajak</h3>
            <form className="mt-5">
              <div className="flex items-center">
                <div className="w-1/4">
                  <label className="label block">Status</label>
                </div>
                <div className="w-3/4 ml-2">
                  <div className="custom-select">
                    <select className="form-control">
                      <option>Lunas</option>
                      <option>Kurang Bayar</option>
                      <option>Denda</option>
                    </select>
                    <div className="custom-select-icon las las-caret-down"></div>
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
      </div>
    </AdminLayout>
  );
}
