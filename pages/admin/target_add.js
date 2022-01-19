import { useState } from "react";
import AdminLayout from "../../components/layouts/admin/AdminLayout";

export default function TargetAdd() {
  return (
    <AdminLayout title="Target">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb">
        <h1>Target</h1>
        <ul>
          <li>
            <a href="#">Admin</a>
          </li>
          <li className="divider las las-arrow-right"></li>
          <li>
            <a href="#">Tambah Target</a>
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
                  Tahun
                </label>
                <input id="namaLengkap" type="text" className="form-control" />
              </div>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="kecamatan">
                  Target Penerimaan
                </label>
                <input id="kecamatan" type="text" className="form-control" />
              </div>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="kecamatan">
                  Dasar Hukum (Deskripsi singkat)
                </label>
                <input id="kecamatan" type="text" className="form-control" />
              </div>
              <div className="mb-5">
                <label className="label block mb-2" htmlFor="alamatLengkap">
                  Keterangan
                </label>
                <textarea
                  id="alamatLengkap"
                  className="form-control"
                  rows="16"
                ></textarea>
              </div>
            </form>
          </div>
        </div>

        {/* <!-- Detail --> */}
        <div className="lg:w-1/2 xl:w-1/4 lg:px-4 pt-5 lg:pt-0">
          {/* <!-- Featured Image --> */}
          <div className="card p-5">
            <h3>Dasar Hukum (PDF)</h3>
            <button className="mt-5 btn btn_outlined btn_secondary uppercase">
              Upload
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
