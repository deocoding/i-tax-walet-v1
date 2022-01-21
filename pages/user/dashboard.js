import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import UserLayout from "../../components/layouts/user/UserLayout";
import { Store } from "../../utils/Store";

export default function Dashboard() {
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
            <div className="lg:w-1/3 lg:px-4">
              <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                <span className="text-primary text-5xl leading-none las las-industry"></span>
                <p className="mt-2">Status Bangunan</p>
                <div className="text-primary mt-5 text-3xl leading-none">
                  Pendaftaran
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
              <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                <span className="text-primary text-5xl leading-none las las-receipt"></span>
                <p className="mt-2">Pelaporan Pajak</p>
                <div className="text-primary mt-5 text-3xl leading-none">0</div>
              </div>
            </div>
            <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
              <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                <span className="text-primary text-5xl leading-none las las-address-book"></span>
                <p className="mt-2">Status Pemilik</p>
                <div className="text-primary mt-5 text-3xl leading-none">
                  Pendaftaran
                </div>
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
