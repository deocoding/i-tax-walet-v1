import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import {
  useTable,
  usePagination,
  useRowSelect,
  useGlobalFilter,
} from "react-table";
import { getError } from "../../utils/error";
import { Store } from "../../utils/Store";
import { GlobalFilter } from "./GlobalFilter";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <label className="custom-checkbox">
          <input type="checkbox" ref={resolvedRef} {...rest} />
          <span></span>
        </label>
      </>
    );
  }
);

const defaultPropGetter = () => ({});

function Table({
  columns,
  data,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
}) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 5 },
    },
    useGlobalFilter,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            </div>
          ),
          className: "w-px",
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  const deleteAllHandler = async (objekPajaksIds) => {
    if (!window.confirm("Yakin dihapus?")) {
      return;
    }
    try {
      const { data } = await axios.delete(
        `/api/objek-pajaks?ids=${objekPajaksIds}`,
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      alert(data.pesan);
      router.reload();
    } catch (err) {
      alert(getError(err));
    }
  };

  const { globalFilter } = state;

  // Render the UI for your table
  return (
    <>
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
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

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

      <div className="card p-5">
        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="table table-auto table_hoverable w-full"
          >
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps([
                        {
                          className: column.className,
                          style: column.style,
                        },
                        getColumnProps(column),
                        getHeaderProps(column),
                      ])}
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps([
                            {
                              className: cell.column.classNameCell,
                              style: cell.column.style,
                            },
                            getColumnProps(cell.column),
                            getCellProps(cell),
                          ])}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* 
          Pagination can be built however you'd like. 
          This is just a very basic UI implementation:
        */}
      <div className="mt-5">
        {/* <!-- Pagination --> */}
        <div className="card lg:flex">
          <nav className="flex flex-wrap p-5">
            <a
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className={
                !canPreviousPage
                  ? "btn ltr:mr-2 rtl:ml-2 mb-2 lg:mb-0 btn_outlined btn_secondary"
                  : "btn ltr:mr-2 rtl:ml-2 mb-2 lg:mb-0 btn_primary cursor-pointer"
              }
            >
              Awal
            </a>
            <a
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className={
                !canPreviousPage
                  ? "btn ltr:mr-2 rtl:ml-2 mb-2 lg:mb-0 btn_outlined btn_secondary"
                  : "btn ltr:mr-2 rtl:ml-2 mb-2 lg:mb-0 btn_primary cursor-pointer"
              }
            >
              {"<"}
            </a>
            <a
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className={
                !canNextPage
                  ? "btn ltr:mr-2 rtl:ml-2 mb-2 lg:mb-0 btn_outlined btn_secondary"
                  : "btn ltr:mr-2 rtl:ml-2 mb-2 lg:mb-0 btn_secondary cursor-pointer"
              }
            >
              {">"}
            </a>
            <a
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className={
                !canNextPage
                  ? "btn ltr:mr-2 rtl:ml-2 mb-2 lg:mb-0 btn_outlined btn_secondary"
                  : "btn ltr:mr-2 rtl:ml-2 mb-2 lg:mb-0 btn_secondary cursor-pointer"
              }
            >
              Akhir
            </a>
          </nav>
          <div className="flex items-center ltr:ml-auto rtl:mr-auto p-5 border-t lg:border-t-0 border-gray-200 dark:border-gray-900">
            <span>
              Halaman {pageIndex + 1} dari {pageOptions.length} &nbsp;{" "}
            </span>{" "}
            <span>
              {" "}
              | &nbsp;ke halaman :{" "}
              <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                className="form-control btn btn_outlined btn_secondary"
                style={{ width: "100px" }}
              />
            </span>
          </div>
          <div className="flex items-center p-5 border-t lg:border-t-0 lg:ltr:border-l lg:rtl:border-r border-gray-200 dark:border-gray-900">
            <span className="ltr:mr-2 rtl:ml-2">Tampil</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
              className="form-control btn_outlined btn_secondary"
            >
              {[5, 10, 15, 20].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <span className="ltr:ml-2 rtl:mr-2">item</span>
          </div>
        </div>
      </div>

      {selectedFlatRows.length > 0 && (
        <div className="footer-bar">
          <div className="flex items-center uppercase">
            <span className="text-base badge badge_primary  ltr:mr-2 rtl:ml-2">
              {selectedFlatRows.length}
            </span>
            Item Terpilih
          </div>
          <div className="ltr:ml-auto rtl:mr-auto">
            <button
              className="btn btn_danger uppercase"
              // onClick={() =>
              //   deleteAllHandler(selectedFlatRows.map((d) => d.original._id))
              // }
              onClick={() =>
                deleteAllHandler(selectedFlatRows.map((d) => d.original._id))
              }
            >
              <span className="las las-trash-alt text-xl leading-none ltr:mr-2 rtl:ml-2"></span>
              Hapus
            </button>
          </div>
        </div>
      )}

      {/* <div className="mt-5">
        <pre>
          <code>
            {JSON.stringify(
              {
                selectedRowIds: selectedRowIds,
                "selectedFlatRows[].length": selectedFlatRows.length,
                "selectedFlatRows[].original": selectedFlatRows.map(
                  (d) => d.original._id
                ),
              },
              null,
              2
            )}
          </code>
        </pre>
      </div> */}
    </>
  );
}

function WajibPajaksTable({ data }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Nama Pemilik",
        accessor: "namaPemilik",
        className: "w-1/5 ltr:text-left rtl:text-right uppercase",
      },
      {
        Header: "NPWPD",
        accessor: "npwpd",
        className: "text-left uppercase",
      },
      {
        Header: "Alamat Lengkap",
        accessor: "alamatLengkap",
        className: "text-left uppercase",
      },
      {
        Header: "Kecamatan",
        accessor: "kec",
        className: "text-left uppercase",
      },
      {
        Header: () => null,
        id: "aksi",
        classNameCell: "ltr:text-right rtl:text-left",
        Cell: ({ row }) => (
          <div className="inline-flex ltr:ml-auto rtl:mr-auto justify-center items-center">
            <Link href={`/objek-pajaks/survey/${row.original._id}`} passHref>
              {row.original.sdhProyeksi ? (
                <a className="btn btn-icon btn_success ml-3">
                  <span className="las las-chart-line"></span>
                </a>
              ) : (
                <a className="btn btn-icon btn_outlined btn_secondary ml-3">
                  <span className="las las-chart-line"></span>
                </a>
              )}
            </Link>
            <Link href={`/objek-pajaks/${row.original._id}/pendataan`} passHref>
              {row.original.sdhData ? (
                <a className="btn btn-icon btn_success ml-3">
                  <span className="las las-map-marked-alt"></span>
                </a>
              ) : (
                <a className="btn btn-icon btn_outlined btn_secondary ml-3">
                  <span className="las las-map-marked-alt"></span>
                </a>
              )}
            </Link>
            <Link href={`/objek-pajaks/${row.original._id}`} passHref>
              <a className="btn btn-icon btn_outlined btn_secondary ml-3">
                <span className="las las-pen-fancy"></span>
              </a>
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  return <Table columns={columns} data={data} />;
}

export default dynamic(() => Promise.resolve(WajibPajaksTable), { ssr: false });
