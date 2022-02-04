import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import AppLayout from "../../components/layouts/app/AppLayout";
import UsersTable from "../../components/tables/UsersTable";
import { Store } from "../../utils/Store";

function Users() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const [users, setUsers] = useState([]);
  const [cari, setCari] = useState("");

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    } else {
      const fetchUsers = async () => {
        try {
          const res = await axios.get(`/api/users?cari=${cari}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setUsers(res.data);
        } catch (err) {
          console.log(err);
        }
      };

      fetchUsers();
    }
  }, [cari]);

  return (
    <AppLayout title="User">
      <UsersTable data={users} />
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(Users), { ssr: false });
