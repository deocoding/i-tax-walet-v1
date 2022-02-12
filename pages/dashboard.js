import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import AppLayout from "../components/layouts/app/AppLayout";
import { Store } from "../utils/Store";
import NumberFormat from "react-number-format";

function Dashboard() {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [totalRealisasi, setTotalRealisasi] = useState(null);
  const [totalRealisasiBerjalan, setTotalRealisasiBerjalan] = useState(null);
  const [totalLunas, setTotalLunas] = useState();
  const [totalKurang, setTotalKurang] = useState();
  const [totalDenda, setTotalDenda] = useState();
  const [totalBlmData, setTotalBlmData] = useState();
  const [totalBlmSurvey, setTotalBlmSurvey] = useState();
  const [prediksiRupiah, setPrediksiRupiah] = useState();
  const [prediksiPersenBulat, setPrediksiPersenBulat] = useState();
  const [sebaranKecamatan, setSebaranKecamatan] = useState();
  const [totalBangunan, setTotalBangunan] = useState();
  const [totalPopulasi, setTotalPopulasi] = useState();

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      const fetchDashboard = async () => {
        try {
          const { data } = await axios.get(`/api/dashboard`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setTotalRealisasi(data.totalRealisasi);
          setTotalRealisasiBerjalan(data.totalRealisasiBerjalan);
          setTotalLunas(data.totalLunas);
          setTotalKurang(data.totalKurang);
          setTotalDenda(data.totalDenda);
          setTotalBlmData(data.totalBlmData);
          setTotalBlmSurvey(data.totalBlmSurvey);
          setPrediksiRupiah(data.prediksiRupiah);
          setPrediksiPersenBulat(data.prediksiPersenBulat);
          setSebaranKecamatan(data.sebaranKecamatan);
          setTotalBangunan(data.totalBangunan);
          setTotalPopulasi(data.totalPopulasi);
        } catch (err) {
          console.log(err);
        }
      };
      fetchDashboard();
    }
  }, [userInfo]);

  return (
    <AppLayout title="Dashboard">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb">
        <h1>Dashboard</h1>
        <ul>
          <li>
            <a>
              {userInfo && userInfo.role == 1 && <span>Superadmin</span>}
              {userInfo && userInfo.role == 2 && <span>Admin</span>}
              {userInfo && userInfo.role == 3 && <span>Surveyor</span>}
              {userInfo && userInfo.role == 4 && <span>Operator</span>}
            </a>
          </li>
          <li className="divider las las-arrow-right"></li>
          <li>Dashboard</li>
        </ul>
      </section>

      <div className="lg:flex lg:-mx-4">
        <div className="lg:w-1/2 lg:px-4">
          {/* <!-- Table Sebaran Per Kecamatan --> */}
          <div className="card p-5">
            <h3 className="uppercase pb-3">
              Sebaran Objek Pajak &#38; Populasi per Kecamatan
            </h3>
            <table className="table table_list mt-3 w-full">
              <thead>
                <tr>
                  <th className="w-px ltr:text-left rtl:text-right uppercase">
                    Kecamatan
                  </th>
                  <th className="w-px uppercase">Jumlah Bangunan</th>
                  <th className="w-px uppercase">Jumlah Populasi</th>
                </tr>
              </thead>
              <tbody>
                {sebaranKecamatan &&
                  sebaranKecamatan.map((seb) => (
                    <tr key={seb.kec}>
                      <td>{seb.kec}</td>
                      <td className="text-center">{seb.bnykObjek}</td>
                      <td className="text-center">{seb.totPop}</td>
                    </tr>
                  ))}
              </tbody>

              <tbody>
                <tr>
                  <th className="ltr:text-left rtl:text-right uppercase">
                    Jumlah
                  </th>
                  <th className="w-px uppercase">
                    {totalBangunan ? totalBangunan : 0}
                  </th>
                  <th className="w-px uppercase">
                    {totalPopulasi ? totalPopulasi : 0}
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:w-1/2 lg:px-4 pt-5 lg:pt-0">
          <div className="lg:flex lg:-mx-4">
            <div className="lg:w-1/2 lg:px-4">
              {/* Total Realisasi*/}
              <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                <span className="text-primary text-5xl leading-none las las-cash-register"></span>
                <p className="mt-2">Realisasi Keseluruhan</p>
                <div className="text-primary mt-5 text-3xl leading-none">
                  <NumberFormat
                    value={totalRealisasi ? totalRealisasi : 0}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp"}
                  />
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 lg:px-4 pt-5 lg:pt-0">
              {/* Realisasi Tahun Berjalan */}
              <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                <span className="text-primary text-5xl leading-none las las-chart-line"></span>
                <p className="mt-2">Realisasi Tahun Ini</p>
                <div className="text-primary mt-5 text-3xl leading-none">
                  <NumberFormat
                    value={totalRealisasiBerjalan ? totalRealisasiBerjalan : 0}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp"}
                  />
                </div>
              </div>
            </div>
          </div>

          {userInfo && (userInfo.role == 1 || userInfo.role == 4) && (
            <div className="lg:flex mt-5 lg:-mx-4">
              <div className="lg:w-1/3 lg:px-4">
                {/* Total Wajib Pajak */}
                <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                  <span className="text-primary text-5xl leading-none las las-receipt"></span>
                  <p className="mt-2">Lunas</p>
                  <div className="text-primary mt-5 text-3xl leading-none">
                    <NumberFormat
                      value={totalLunas ? totalLunas : 0}
                      displayType={"text"}
                    />{" "}
                    Orang
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                {/* Total Objek Pajak */}
                <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                  <span className="text-primary text-5xl leading-none las las-receipt"></span>
                  <p className="mt-2">Kurang Bayar</p>
                  <div className="text-primary mt-5 text-3xl leading-none">
                    <NumberFormat
                      value={totalKurang ? totalKurang : 0}
                      displayType={"text"}
                    />{" "}
                    Orang
                  </div>
                </div>
              </div>
              <div className="lg:w-1/3 lg:px-4 pt-5 lg:pt-0">
                {/* Total Pembayaran Pajak */}
                <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                  <span className="text-primary text-5xl leading-none las las-receipt"></span>
                  <p className="mt-2">Denda</p>
                  <div className="text-primary mt-5 text-3xl leading-none">
                    <NumberFormat
                      value={totalDenda ? totalDenda : 0}
                      displayType={"text"}
                    />{" "}
                    Orang
                  </div>
                </div>
              </div>
            </div>
          )}

          {userInfo && (userInfo.role == 1 || userInfo.role == 3) && (
            <div className="lg:flex mt-5 lg:-mx-4">
              <div className="lg:w-1/2 lg:px-4">
                {/* Realisasi Pajak Tahun Berjalan */}
                <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                  <span className="text-primary text-5xl leading-none las las-map-marked"></span>
                  <p className="mt-2">Belum Pendataan</p>
                  <div className="text-primary mt-5 text-3xl leading-none">
                    <NumberFormat
                      value={totalBlmData ? totalBlmData : 0}
                      displayType={"text"}
                    />{" "}
                    Objek
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 lg:px-4 pt-5 lg:pt-0">
                {/* Realisasi Pajak Seluruhnya */}
                <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                  <span className="text-primary text-5xl leading-none las las-search-location"></span>
                  <p className="mt-2">Belum Survei</p>
                  <div className="text-primary mt-5 text-3xl leading-none">
                    <NumberFormat
                      value={totalBlmSurvey ? totalBlmSurvey : 0}
                      displayType={"text"}
                    />{" "}
                    Objek
                  </div>
                </div>
              </div>
            </div>
          )}

          {userInfo && (userInfo.role == 1 || userInfo.role == 2) && (
            <div className="lg:flex mt-5 lg:-mx-4">
              <div className="lg:w-1/2 lg:px-4">
                {/* Realisasi Pajak Tahun Berjalan */}
                <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                  <span className="text-primary text-5xl leading-none las las-glasses"></span>
                  <p className="mt-2">Prediksi Pajak Mendatang</p>
                  <div className="text-primary mt-5 text-3xl leading-none">
                    {prediksiRupiah && prediksiRupiah >= 0 && (
                      <div className="text-green-500">
                        <i className="las las-level-up-alt"></i>
                        <NumberFormat
                          value={prediksiRupiah}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"Rp"}
                        />
                      </div>
                    )}
                    {prediksiRupiah && prediksiRupiah < 0 && (
                      <div className="text-red-500">
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
              </div>

              <div className="lg:w-1/2 lg:px-4 pt-5 lg:pt-0">
                {/* Realisasi Pajak Seluruhnya */}
                <div className="card px-4 py-8 text-center lg:transform hover:scale-110 hover:shadow-lg transition-transform duration-200">
                  <span className="text-primary text-5xl leading-none las las-divide"></span>
                  <p className="mt-2">Persentase Pajak Mendatang</p>
                  <div className="text-primary mt-5 text-3xl leading-none">
                    {prediksiPersenBulat && prediksiPersenBulat >= 0 && (
                      <div className="text-green-500">
                        <i className="las las-level-up-alt"></i>
                        <NumberFormat
                          value={prediksiPersenBulat}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix="%"
                        />
                      </div>
                    )}
                    {prediksiPersenBulat && prediksiPersenBulat < 0 && (
                      <div className="text-red-500">
                        <i className="las las-level-down-alt"></i>
                        <NumberFormat
                          value={prediksiPersenBulat}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix="%"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
