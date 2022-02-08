import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import Moment from "react-moment";
import NumberFormat from "react-number-format";
import {
  useTable,
  usePagination,
  useRowSelect,
  useGlobalFilter,
} from "react-table";
import { getError } from "../../utils/error";
import { Store } from "../../utils/Store";
import { GlobalFilter } from "./GlobalFilter";
import "moment/locale/id";

const defaultPropGetter = () => ({});

function Table({
  columns,
  data,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getFooterProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
}) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
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
    useRowSelect
    // (hooks) => {
    //   hooks.visibleColumns.push((columns) => [
    //     // Let's make a column for selection
    //     {
    //       id: "selection",
    //       // The header can use the table's getToggleAllRowsSelectedProps method
    //       // to render a checkbox
    //       Header: ({ getToggleAllPageRowsSelectedProps }) => (
    //         <div>
    //           <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
    //         </div>
    //       ),
    //       className: "w-px",
    //       // The cell can use the individual row's getToggleRowSelectedProps method
    //       // to the render a checkbox
    //       Cell: ({ row }) => (
    //         <div>
    //           <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
    //         </div>
    //       ),
    //     },
    //     ...columns,
    //   ]);
    // }
  );

  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  // const deleteAllHandler = async (prediksisIds) => {
  //   if (!window.confirm("Yakin dihapus?")) {
  //     return;
  //   }
  //   try {
  //     const { data } = await axios.delete(`/api/pajaks?ids=${pajaksIds}`, {
  //       headers: { authorization: `Bearer ${userInfo.token}` },
  //     });
  //     alert(data.pesan);
  //     router.reload();
  //   } catch (err) {
  //     alert(getError(err));
  //   }
  // };

  const { globalFilter } = state;

  // Render the UI for your table
  return (
    <>
      <div className="lg:flex items-center ltr:ml-auto rtl:mr-auto mt-5 lg:mt-0"></div>
      <div className="card p-5 mt-5">
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
        <div className="card ">
          <nav className="flex flex-wrap p-5 items-center justify-center">
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
          <div className="flex items-center justify-center ltr:ml-auto rtl:mr-auto p-5 border-t border-gray-200 dark:border-gray-900">
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
          <div className="flex items-center p-5 border-t g:ltr:border-l lg:rtl:border-r border-gray-200 dark:border-gray-900">
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
        Header: "Tahun",
        accessor: "_id.tahun",
        className: "text-left uppercase",
      },
      {
        Header: "Bulan",
        accessor: "_id.bulan",
        className: "text-left uppercase",
      },
      {
        Header: "Total Populasi (Y)",
        accessor: "total_populasi",
        className: "text-left uppercase",
        Cell: ({ row }) => (
          <NumberFormat
            value={row.original.total_populasi}
            displayType={"text"}
            thousandSeparator={true}
          />
        ),
      },
    ],
    []
  );

  return <Table columns={columns} data={data} />;
}

export default dynamic(() => Promise.resolve(WajibPajaksTable), { ssr: false });
