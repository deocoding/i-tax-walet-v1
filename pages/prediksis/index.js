import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { ProyeksiChart } from "../../components/charts/ProyeksiChart.tsx";
import AppLayout from "../../components/layouts/app/AppLayout";
import PrediksisTable from "../../components/tables/PrediksisTable";
import { Store } from "../../utils/Store";

function Prediksis() {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [prediksiPelaporan, setPrediksiPelaporan] = useState([]);
  const [prediksiRupiah, setPrediksiRupiah] = useState("");
  const [prediksiPersen, setPrediksiPersen] = useState("");
  const [bulans, setBulans] = useState([]);
  const [pendapatans, setPendapatans] = useState([]);

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      const fetchPrediksis = async () => {
        try {
          const res = await axios.get(`/api/prediksis/pelaporan`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setPrediksiPelaporan(res.data.prediksis);
          setPrediksiRupiah(res.data.prediksiRupiah);
          setPrediksiPersen(res.data.prediksiBulat);
          setBulans(res.data.bulans);
          setPendapatans(res.data.pendapatans);
        } catch (err) {
          console.log(err);
        }
      };
    }

    fetchPrediksis();
  }, [userInfo]);

  // console.log(res);

  return (
    <AppLayout title="Prediksi">
      <section className="breadcrumb lg:flex items-start">
        <div>
          <h1>Prediksi</h1>
          <ul>
            <li>
              <a href="#">
                {userInfo && userInfo.role === 1 && <span>Superadmin</span>}
              </a>
            </li>
            <li className="divider las las-arrow-right"></li>
            <li>Prediksi Potensi Pajak</li>
            <li className="divider las las-arrow-right"></li>
            <li>Bulan Berikutnya</li>
          </ul>
        </div>
      </section>

      {/* <!-- Layout --> */}
      <div className="flex mt-0">
        <a href="#" className="btn btn-icon btn-icon_large btn_primary">
          <span className="las las-globe-asia"></span>
        </a>
        <a
          href="blog-list-card-rows.html"
          className="btn btn-icon btn-icon_large btn_outlined btn_secondary ltr:ml-2 rtl:mr-2"
        >
          <span className="las las-money-check"></span>
        </a>
        <a
          href="blog-list-card-columns.html"
          className="btn btn-icon btn-icon_large btn_outlined btn_secondary ltr:ml-2 rtl:mr-2"
        >
          <span className="las las-feather"></span>
        </a>
      </div>

      <div className="lg:flex lg:-mx-4">
        <div className="lg:w-1/2 xl:w-2/3 lg:px-4 pt-5">
          <div className="lg:flex lg:-mx-4">
            <div className="lg:w-1/2 lg:px-4">
              <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                <span className="text-primary text-5xl leading-none las las-bullseye"></span>
                <p className="mt-2">Prediksi Rupiah</p>
                {prediksiRupiah >= 0 && (
                  <div className="text-green-500 mt-5 text-3xl leading-none">
                    <i className="las las-level-up-alt"></i>
                    <NumberFormat
                      value={prediksiRupiah}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"Rp"}
                    />
                  </div>
                )}
                {prediksiRupiah < 0 && (
                  <div className="text-red-500 mt-5 text-3xl leading-none">
                    <i className="las las-level-down-alt"></i>
                    <NumberFormat
                      value={prediksiRupiah}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"Rp"}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="lg:w-1/2 lg:px-4 pt-5 lg:pt-0">
              <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                <span className="text-primary text-5xl leading-none las las-chart-line"></span>
                <p className="mt-2">Prediksi Persentase</p>
                {prediksiPersen >= 0 && (
                  <div className="text-green-500 mt-5 text-3xl leading-none">
                    <i className="las las-level-up-alt"></i>
                    {prediksiPersen}
                  </div>
                )}
                {prediksiPersen < 0 && (
                  <div className="text-red-500 mt-5 text-3xl leading-none">
                    <i className="las las-level-down-alt"></i>
                    {prediksiPersen}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:flex lg:-mx-4 pt-5">
            <div className="lg:w-full lg:px-4">
              <div className="card p-5">
                <div className="tabs">
                  <nav className="tab-nav">
                    <button className="nav-link h5 uppercase active">
                      Grafik Potensi
                    </button>
                  </nav>
                  <div className="tab-content mt-5">
                    <div id="tab-2" className="collapse open">
                      <div className="mt-5">
                        <ProyeksiChart
                          bulans={bulans}
                          pendapatans={pendapatans}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 xl:w-1/3 lg:px-4 lg:pt-0">
          <PrediksisTable data={prediksiPelaporan} />
        </div>
      </div>
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(Prediksis), { ssr: false });
