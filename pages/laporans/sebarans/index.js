import React, { useContext, useEffect, useState } from "react";
import AppLayout from "../../../components/layouts/app/AppLayout";
import dynamic from "next/dynamic";
import { Store } from "../../../utils/Store";
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
              <a>
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
          <li className="divider las las-arrow-right"></li>
          <li>Sebaran</li>
        </ul>
      </div>

      <div className="lg:flex lg:-mx-4 mt-5">
        <div className="lg:w-full lg:px-4">
          <div className="sm:flex sm:flex-wrap sm:-mx-4">
            {/* Folder Laporan Pajak */}
            <div className="sm:w-1/2 lg:w-1/3 mb-5 sm:px-4">
              <div className="card card_hoverable card_list cursor-pointer">
                <div className="image image_icon">
                  <span className="las las-file-excel las-4x"></span>
                </div>
                <div className="body">
                  <h5>Sebaran per Kecamatan</h5>
                </div>
              </div>
            </div>
            {/* Folder Laporan Prediksi */}
            <div className="sm:w-1/2 lg:w-1/3 mb-5 sm:px-4">
              <div className="relative card p-5">
                <form className="mt-5">
                  <div className="flex items-center">
                    <div className="w-1/4">
                      <label className="label block">Tipe</label>
                    </div>
                    <div className="w-3/4 ml-2">
                      <div className="custom-select">
                        <select className="form-control">
                          <option>Bulanan</option>
                          <option>Triwulan</option>
                          <option>Semester</option>
                          <option>Tahunan</option>
                        </select>
                        <div className="custom-select-icon las las-caret-down"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center mt-5">
                    <div className="w-1/4">
                      <label className="label block">Bulan ke</label>
                    </div>
                    <div className="w-3/4 ml-2">
                      <div className="custom-select">
                        <select className="form-control">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                          <option>6</option>
                          <option>7</option>
                          <option>8</option>
                          <option>9</option>
                          <option>10</option>
                          <option>11</option>
                          <option>12</option>
                        </select>
                        <div className="custom-select-icon la la-caret-down"></div>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="mt-5">
                  <button className="btn btn_primary mt-5 ltr:mr-2 rtl:ml-2 uppercase">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default dynamic(() => Promise.resolve(Laporans), { ssr: false });
