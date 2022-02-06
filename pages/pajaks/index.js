import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import AppLayout from "../../components/layouts/app/AppLayout";
import { GlobalFilter } from "../../components/tables/GlobalFilter";
import PajaksTable from "../../components/tables/PajaksTable";
import { Store } from "../../utils/Store";

function Pajaks() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const [pajaks, setPajaks] = useState([]);

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      const fetchPajaks = async () => {
        try {
          const res = await axios.get(`/api/pajaks`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setPajaks(res.data);
        } catch (err) {
          console.log(err);
        }
      };

      fetchPajaks();
    }
  }, [userInfo]);

  return (
    <AppLayout title="Pajak">
      {/* <!-- Breadcrumb --> */}

      <PajaksTable data={pajaks} />
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(Pajaks), { ssr: false });
