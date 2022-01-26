import Link from "next/link";
import { useState } from "react";
import AdminLayout from "../../components/layouts/admin/AdminLayout";

export default function PajakList() {
  return (
    <AdminLayout title="Pajak">
      {/* <!-- Breadcrumb --> */}
      <section className="breadcrumb lg:flex items-start">
        <div>
          <h1>Pajak</h1>
          <ul>
            <li>
              <a href="#">Admin</a>
            </li>
            <li className="divider las las-arrow-right"></li>
            <li>Daftar Pembayaran Pajak</li>
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
              />
              <button
                type="button"
                className="btn btn-link text-secondary dark:text-gray-700 hover:text-primary dark:hover:text-primary text-xl leading-none las las-search ltr:mr-4 rtl:ml-4"
              ></button>
            </label>
          </form>

          <div className="flex mt-5 lg:mt-0">
            {/* <!-- Sort By --> */}
            <div className="dropdown lg:ltr:ml-2 lg:rtl:mr-2">
              <button
                className="btn btn_outlined btn_secondary uppercase"
                data-toggle="dropdown-menu"
                aria-expanded="false"
              >
                Urut Berdasarkan
                <span className="ltr:ml-3 rtl:mr-3 las las-caret-down text-xl leading-none"></span>
              </button>
              <div className="dropdown-menu">
                <a href="#">Ascending</a>
                <a href="#">Descending</a>
              </div>
            </div>

            {/* <!-- Add New --> */}
            <Link href="/admin/pajak_add" passHref>
              <button className="btn btn_primary uppercase ltr:ml-2 rtl:mr-2">
                Tambah Baru
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* <!-- List --> */}
      <div className="card p-5">
        <div className="overflow-x-auto">
          <table className="table table-auto table_hoverable w-full">
            <thead>
              <tr>
                <th className="w-px">
                  <label className="custom-checkbox">
                    <input type="checkbox" defaultChecked="" partial="" />
                    <span></span>
                  </label>
                </th>
                <th className="w-1/5 ltr:text-left rtl:text-right uppercase">
                  NPWPD
                </th>
                <th className="text-center uppercase">Nama Lengkap</th>
                <th className="text-center uppercase">Total Pajak</th>
                <th className="text-center uppercase">Status</th>
                <th className="text-center uppercase">Tanggal Pembayaran</th>
                <th className="uppercase"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <label className="custom-checkbox">
                    <input type="checkbox" data-toggle="rowSelection" />
                    <span></span>
                  </label>
                </td>
                <td>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </td>
                <td className="text-center">Lorem Ipsum</td>
                <td className="text-center">Loram Ipsum</td>
                <td className="text-center">
                  <div className="badge badge_outlined badge_warning uppercase">
                    Kurang Bayar
                  </div>
                </td>
                <td className="text-center">December 15, 2019</td>
                <td className="ltr:text-right rtl:text-left whitespace-nowrap">
                  <div className="inline-flex ltr:ml-auto rtl:mr-auto">
                    <a
                      href="#"
                      className="btn btn-icon btn_outlined btn_secondary"
                    >
                      <span className="las las-pen-fancy"></span>
                    </a>
                    <a
                      href="#"
                      className="btn btn-icon btn_outlined btn_danger ltr:ml-2 rtl:mr-2"
                    >
                      <span className="las las-trash-alt"></span>
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label className="custom-checkbox">
                    <input type="checkbox" data-toggle="rowSelection" />
                    <span></span>
                  </label>
                </td>
                <td>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </td>
                <td className="text-center">Lorem Ipsum</td>
                <td className="text-center">Loram Ipsum</td>
                <td className="text-center">
                  <div className="badge badge_outlined badge_info uppercase">
                    Dalam Proses
                  </div>
                </td>
                <td className="text-center">December 15, 2019</td>
                <td className="ltr:text-right rtl:text-left whitespace-nowrap">
                  <div className="inline-flex ltr:ml-auto rtl:mr-auto">
                    <a
                      href="#"
                      className="btn btn-icon btn_outlined btn_secondary"
                    >
                      <span className="las las-pen-fancy"></span>
                    </a>
                    <a
                      href="#"
                      className="btn btn-icon btn_outlined btn_danger ltr:ml-2 rtl:mr-2"
                    >
                      <span className="las las-trash-alt"></span>
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label className="custom-checkbox">
                    <input type="checkbox" data-toggle="rowSelection" />
                    <span></span>
                  </label>
                </td>
                <td>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </td>
                <td className="text-center">Lorem Ipsum</td>
                <td className="text-center">Loram Ipsum</td>
                <td className="text-center">
                  <div className="badge badge_outlined badge_success uppercase">
                    Lunas
                  </div>
                </td>
                <td className="text-center">December 15, 2019</td>
                <td className="ltr:text-right rtl:text-left whitespace-nowrap">
                  <div className="inline-flex ltr:ml-auto rtl:mr-auto">
                    <a
                      href="#"
                      className="btn btn-icon btn_outlined btn_secondary"
                    >
                      <span className="las las-pen-fancy"></span>
                    </a>
                    <a
                      href="#"
                      className="btn btn-icon btn_outlined btn_danger ltr:ml-2 rtl:mr-2"
                    >
                      <span className="las las-trash-alt"></span>
                    </a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <label className="custom-checkbox">
                    <input type="checkbox" data-toggle="rowSelection" />
                    <span></span>
                  </label>
                </td>
                <td>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </td>
                <td className="text-center">Lorem Ipsum</td>
                <td className="text-center">Loram Ipsum</td>
                <td className="text-center">
                  <div className="badge badge_outlined badge_danger uppercase">
                    Denda
                  </div>
                </td>
                <td className="text-center">December 15, 2019</td>
                <td className="ltr:text-right rtl:text-left whitespace-nowrap">
                  <div className="inline-flex ltr:ml-auto rtl:mr-auto">
                    <a
                      href="#"
                      className="btn btn-icon btn_outlined btn_secondary"
                    >
                      <span className="las las-pen-fancy"></span>
                    </a>
                    <a
                      href="#"
                      className="btn btn-icon btn_outlined btn_danger ltr:ml-2 rtl:mr-2"
                    >
                      <span className="las las-trash-alt"></span>
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5">
        {/* <!-- Pagination --> */}
        <div className="card lg:flex">
          <nav className="flex flex-wrap p-5">
            <a
              href="#"
              className="btn ltr:mr-2 rtl:ml-2 mb-2 lg:mb-0 btn_primary"
            >
              Awal
            </a>
            <a
              href="#"
              className="btn ltr:mr-2 rtl:ml-2 mb-2 lg:mb-0 btn_primary"
            >
              1
            </a>
            <a
              href="#"
              className="btn ltr:mr-2 rtl:ml-2 mb-2 lg:mb-0 btn_outlined btn_secondary"
            >
              2
            </a>
            <a
              href="#"
              className="btn ltr:mr-2 rtl:ml-2 mb-2 lg:mb-0 btn_outlined btn_secondary"
            >
              3
            </a>
            <a
              href="#"
              className="btn ltr:mr-2 rtl:ml-2 mb-2 lg:mb-0 btn_outlined btn_secondary"
            >
              4
            </a>
            <a
              href="#"
              className="btn ltr:mr-2 rtl:ml-2 mb-2 lg:mb-0 btn_outlined btn_secondary"
            >
              5
            </a>
            <a
              href="#"
              className="btn ltr:mr-2 rtl:ml-2 mb-2 lg:mb-0 btn_secondary"
            >
              Akhir
            </a>
          </nav>
          <div className="flex items-center ltr:ml-auto rtl:mr-auto p-5 border-t lg:border-t-0 border-gray-200 dark:border-gray-900">
            Menampilkan 1-5 of 100 item
          </div>
          <div className="flex items-center p-5 border-t lg:border-t-0 lg:ltr:border-l lg:rtl:border-r border-gray-200 dark:border-gray-900">
            <span className="ltr:mr-2 rtl:ml-2">Tampil</span>
            <div className="dropdown">
              <button
                className="btn btn_outlined btn_secondary"
                data-toggle="dropdown-menu"
                aria-expanded="false"
              >
                5
                <span className="ltr:ml-3 rtl:mr-3 las las-caret-down text-xl leading-none"></span>
              </button>
              <div className="dropdown-menu">
                <a href="#">5</a>
                <a href="#">10</a>
                <a href="#">15</a>
              </div>
            </div>
            <span className="ltr:ml-2 rtl:mr-2">item</span>
          </div>
        </div>
      </div>

      {/* <!-- Footer Bar --> */}
      <div className="footer-bar">
        <div className="flex items-center uppercase">
          <span className="text-base badge badge_primary  ltr:mr-2 rtl:ml-2">
            1
          </span>
          Item Terpilih
        </div>
        <div className="ltr:ml-auto rtl:mr-auto">
          <button className="btn btn_danger uppercase">
            <span className="las las-trash-alt text-xl leading-none ltr:mr-2 rtl:ml-2"></span>
            Hapus
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
