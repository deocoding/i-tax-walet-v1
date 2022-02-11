import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { ProyeksiChart } from "../../../components/charts/ProyeksiChart.tsx";
import AppLayout from "../../../components/layouts/app/AppLayout";
import PrediksisPemilikTable from "../../../components/tables/PrediksisPemilikTable";
import { Store } from "../../../utils/Store";

function Prediksis() {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [prediksiPemiliks, setPrediksiPemiliks] = useState([]);

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      const fetchPrediksis = async () => {
        try {
          const res = await axios.get(`/api/prediksis/pemilik`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setPrediksiPemiliks(res.data.prediksiPemiliks);
        } catch (err) {
          console.log(err);
        }
      };
    }

    fetchPrediksis();
  }, [userInfo]);

  console.log(prediksiPemiliks);

  return (
    <AppLayout title="Prediksi">
      <section className="breadcrumb lg:flex items-start">
        <div>
          <h1>Prediksi</h1>
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
            <li>Prediksi Potensi Pajak Pemilik</li>
            <li className="divider las las-arrow-right"></li>
            <li>Daftar Pemilik</li>
          </ul>
        </div>
      </section>

      <PrediksisPemilikTable data={prediksiPemiliks} />
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(Prediksis), { ssr: false });
