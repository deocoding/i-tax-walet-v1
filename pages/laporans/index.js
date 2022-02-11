import React, { useContext, useEffect, useState } from "react";
import AppLayout from "../../components/layouts/app/AppLayout";
import dynamic from "next/dynamic";
import { Store } from "../../utils/Store";
import { useRouter } from "next/router";
import Link from "next/link";

function Laporans() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo) {
      router.push("/");
    }
  });
  return (
    <AppLayout title="Laporan">
      <section className="breadcrumb lg:flex items-start">
        <div>
          <h1>Laporan</h1>
          <ul>
            <li>
              <a href="#">
                {userInfo && userInfo.role === 1 && <span>Superadmin</span>}
              </a>
            </li>
            <li className="divider las las-arrow-right"></li>
            <li>Daftar Laporan</li>
          </ul>
        </div>
      </section>

      <div className="breadcrumb breadcrumb_alt mt-5 p-4">
        <ul>
          <li>
            <Link href="/laporans" passHref>
              <a>
                <span className="las las-folder text-xl ltr:mr-2 rtl:ml-2"></span>
                Utama
              </a>
            </Link>
          </li>
        </ul>
      </div>

      <div className="lg:flex lg:-mx-4 mt-5">
        <div className="lg:w-full lg:px-4">
          <div className="sm:flex sm:flex-wrap sm:-mx-4">
            {/* Folder Laporan Pajak */}
            <div className="sm:w-1/2 lg:w-1/3 mb-5 sm:px-4">
              <Link href="/laporans/pajaks">
                <div className="card card_hoverable card_list cursor-pointer">
                  <div className="image image_icon">
                    <span className="las las-folder las-4x"></span>
                  </div>
                  <div className="body">
                    <h5>Pembayaran Pajak</h5>
                  </div>
                </div>
              </Link>
            </div>
            {/* Folder Laporan Prediksi */}
            <div className="sm:w-1/2 lg:w-1/3 mb-5 sm:px-4">
              <Link href="/laporans/prediksis">
                <div className="card card_hoverable card_list cursor-pointer">
                  <div className="image image_icon">
                    <span className="las las-folder las-4x"></span>
                  </div>
                  <div className="body">
                    <h5>Prediksi Pajak</h5>
                  </div>
                </div>
              </Link>
            </div>
            {/* Folder Laporan Rekap */}
            <div className="sm:w-1/2 lg:w-1/3 mb-5 sm:px-4">
              <Link href="/laporans/sebarans">
                <div className="card card_hoverable card_list cursor-pointer">
                  <div className="image image_icon">
                    <span className="las las-folder las-4x"></span>
                  </div>
                  <div className="body">
                    <h5>Sebaran per Kecamatan</h5>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(Laporans), { ssr: false });
