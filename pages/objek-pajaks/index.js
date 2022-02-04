import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import AppLayout from "../../components/layouts/app/AppLayout";
import ObjekPajaksTable from "../../components/tables/ObjekPajaksTable";
import { Store } from "../../utils/Store";

function ObjekPajaks() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const [objekPajaks, setObjekPajaks] = useState([]);
  const [cari, setCari] = useState("");

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      const fetchObjekPajaks = async () => {
        try {
          const res = await axios.get(`/api/objek-pajaks?cari=${cari}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setObjekPajaks(res.data);
        } catch (err) {
          console.log(err);
        }
      };

      fetchObjekPajaks();
    }
  }, [cari, userInfo]);

  return (
    <AppLayout title="Objek Pajak">
      {/* <!-- Breadcrumb --> */}
      <ObjekPajaksTable data={objekPajaks} />
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(ObjekPajaks), { ssr: false });
