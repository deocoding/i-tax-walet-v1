import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import NumberFormat from "react-number-format";
import { ProyeksiChart } from "../../../components/charts/ProyeksiChart.tsx";
import AppLayout from "../../../components/layouts/app/AppLayout";
import PrediksisObjekTable from "../../../components/tables/PrediksisObjekTable";
import { Store } from "../../../utils/Store";

function Prediksis() {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [prediksisPopulasi, setPrediksisPopulasi] = useState([]);

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      const fetchPrediksis = async () => {
        try {
          const res = await axios.get(`/api/prediksis/populasi`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setPrediksisPopulasi(res.data.prediksisPopulasi);
        } catch (err) {
          console.log(err);
        }
      };
    }

    fetchPrediksis();
  }, [userInfo]);

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
            <li>Prediksi Potensi Objek Pajak</li>
            <li className="divider las las-arrow-right"></li>
            <li>Daftar Objek</li>
          </ul>
        </div>
      </section>

      <PrediksisObjekTable data={prediksisPopulasi} />
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(Prediksis), { ssr: false });
