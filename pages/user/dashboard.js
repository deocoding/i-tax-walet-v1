import { useState } from "react";
import UserLayout from "../../components/layouts/user/UserLayout";

export default function Dashboard() {
  return (
    <UserLayout title="Dashboard">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb">
        <h1>Dashboard</h1>
        <ul>
          <li>
            <a href="#">Login</a>
          </li>
          <li className="divider las las-arrow-right"></li>
          <li>Dashboard</li>
        </ul>
      </section>

      <div className="lg:flex lg:-mx-4">
        <div className="lg:w-1/2 lg:px-4">
          {/* <!-- Categories --> */}
          <div className="card p-5">
            <h3>Map</h3>
            <div className="mt-5">
              <canvas
                id="categoriesChart"
                width="762"
                height="900"
                style={{
                  display: "block",
                  boxSizing: "border-box",
                  height: 570 + "px",
                  width: 381 + "px",
                }}
              ></canvas>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 lg:px-4 pt-5 lg:pt-0">
          {/* <!-- Summaries --> */}
          <div className="lg:flex lg:-mx-4">
            <div className="lg:w-1/2 lg:px-4">
              <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                <span className="text-primary text-5xl leading-none las las-bullseye"></span>
                <p className="mt-2">Target Penerimaan</p>
                <div className="text-primary mt-5 text-3xl leading-none">
                  Rp.500.000.000
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 lg:px-4 pt-5 lg:pt-0">
              <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                <span className="text-primary text-5xl leading-none las las-chart-line"></span>
                <p className="mt-2">Realisasi Penerimaan</p>
                <div className="text-primary mt-5 text-3xl leading-none">
                  Rp.200.000.000
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Summaries --> */}
          <div className="lg:flex mt-5 lg:-mx-4">
            <div className="lg:w-1/3 lg:px-4">
              <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                <span className="text-primary text-5xl leading-none las las-industry"></span>
                <p className="mt-2">Bangunan NPWPD</p>
                <div className="text-primary mt-5 text-3xl leading-none">
                  18
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
              <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                <span className="text-primary text-5xl leading-none las las-receipt"></span>
                <p className="mt-2">Sudah Membayar</p>
                <div className="text-primary mt-5 text-3xl leading-none">
                  16
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
              <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                <span className="text-primary text-5xl leading-none las las-user-plus"></span>
                <p className="mt-2">Usul Baru</p>
                <div className="text-primary mt-5 text-3xl leading-none">9</div>
              </div>
            </div>
          </div>

          {/* <!-- Recent Posts --> */}
          <div className="card mt-5 p-5">
            <h3 className="uppercase pb-3">
              Sebaran &#38; Potensi Pajak per Kecamatan
            </h3>
            <table className="table table_list mt-3 w-full">
              <thead>
                <tr>
                  <th className="w-px ltr:text-left rtl:text-right uppercase">
                    Kecamatan
                  </th>
                  <th className="w-px uppercase">Jumlah Bangunan</th>
                  <th className="w-px uppercase">Potensi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Pahandut</td>
                  <td className="text-center">121</td>
                  <td className="text-center">
                    <div className="badge badge_outlined badge_secondary uppercase">
                      32,52%
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Jekan Raya</td>
                  <td className="text-center">168</td>
                  <td className="text-center">
                    <div className="badge badge_outlined badge_success uppercase">
                      82%
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Sabangau</td>
                  <td className="text-center">46</td>
                  <td className="text-center">
                    <div className="badge badge_outlined badge_warning uppercase">
                      67%
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Bukit Batu</td>
                  <td className="text-center">18</td>
                  <td className="text-center">
                    <div className="badge badge_outlined badge_success uppercase">
                      4,84%
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Rakumpit</td>
                  <td className="text-center">9</td>
                  <td className="text-center">
                    <div className="badge badge_outlined badge_secondary uppercase">
                      2,42%
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody>
                <tr>
                  <th className="ltr:text-left rtl:text-right uppercase">
                    Jumlah
                  </th>
                  <th className="w-px uppercase">372</th>
                  <th className="w-px uppercase">
                    500.000.000 <br />
                    (Naik 31,6%)
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
