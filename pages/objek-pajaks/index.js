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

  console.log(objekPajaks);
  return (
    <AppLayout title="Objek Pajak">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb lg:flex items-start">
        <div>
          <h1>Objek Pajak</h1>
          <ul>
            <li>
              <a href="#">
                {userInfo && userInfo.role === 1 && <span>Superadmin</span>}
              </a>
            </li>
            <li className="divider las las-arrow-right"></li>
            <li>Daftar Objek Pajak</li>
          </ul>
        </div>

        <div className="lg:flex items-center ltr:ml-auto rtl:mr-auto mt-5 lg:mt-0">
          {/* <!-- Layout --> */}
          <div className="flex mt-5 lg:mt-0">
            <a
              href="#"
              className="btn btn-icon btn-icon_large btn_outlined btn_primary"
            >
              <span className="las las-bars"></span>
            </a>
            <a
              href="blog-list-card-rows.html"
              className="btn btn-icon btn-icon_large btn_outlined btn_secondary ltr:ml-2 rtl:mr-2"
            >
              <span className="las las-list"></span>
            </a>
            <a
              href="blog-list-card-columns.html"
              className="btn btn-icon btn-icon_large btn_outlined btn_secondary ltr:ml-2 rtl:mr-2"
            >
              <span className="las las-th-large"></span>
            </a>
          </div>

          {/* <!-- Search --> */}
          <form
            className="flex items-center lg:ltr:ml-2 lg:rtl:mr-2 mt-5 lg:mt-0"
            action="#"
          >
            <label className="form-control-addon-within rounded-full border-secondary">
              <input
                type="text"
                className="form-control border-none"
                placeholder="Cari"
                value={cari}
                onChange={(e) => setCari(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-link text-secondary dark:text-gray-700 hover:text-primary dark:hover:text-primary text-xl leading-none las las-search ltr:mr-4 rtl:ml-4"
              ></button>
            </label>
          </form>

          <div className="flex mt-5 lg:mt-0">
            {/* <!-- Add New --> */}
            <Link href="/objek-pajaks/add" passHref>
              <button className="btn btn_primary uppercase ltr:ml-2 rtl:mr-2">
                Tambah Baru
              </button>
            </Link>
          </div>
        </div>
      </section>

      <ObjekPajaksTable data={objekPajaks} />
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(ObjekPajaks), { ssr: false });
