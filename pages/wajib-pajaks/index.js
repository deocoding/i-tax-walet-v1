import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import AppLayout from "../../components/layouts/app/AppLayout";
import WajibPajaksTable from "../../components/tables/WajibPajaksTable";
import { Store } from "../../utils/Store";

function WajibPajaks() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const [wajibPajaks, setWajibPajaks] = useState([]);
  const [cari, setCari] = useState("");

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      const fetchWajibPajaks = async () => {
        try {
          const res = await axios.get(`/api/wajib-pajaks?cari=${cari}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setWajibPajaks(res.data);
        } catch (err) {
          console.log(err);
        }
      };

      fetchWajibPajaks();
    }
  }, [cari]);

  return (
    <AppLayout title="Wajib Pajak">
      <WajibPajaksTable data={wajibPajaks} />
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(WajibPajaks), { ssr: false });
