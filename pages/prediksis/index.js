import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import AppLayout from "../../components/layouts/app/AppLayout";
import { Store } from "../../utils/Store";

function Prediksis() {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [prediksiPelaporan, setPrediksiPelaporan] = useState([]);

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      const fetchPrediksis = async () => {
        try {
          const res = await axios.get(`/api/prediksis/pelaporan`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setPrediksiPelaporan(res.data);
        } catch (err) {
          console.log(err);
        }
      };
    }

    fetchPrediksis();
  }, [userInfo]);

  console.log(prediksiPelaporan);

  return <AppLayout title="Prediksi"></AppLayout>;
}

export default dynamic(() => Promise.resolve(Prediksis), { ssr: false });
