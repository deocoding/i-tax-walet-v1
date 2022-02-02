import Link from "next/link";
import React from "react";

export const COLUMNS = [
  {
    Header: "Username",
    accessor: "username",
    className: "w-1/5 ltr:text-left rtl:text-right uppercase",
  },
  {
    Header: "Email",
    accessor: "email",
    className: "text-left uppercase",
  },
  {
    Header: "Hak Akses",
    accessor: "role",
    className: "text-left uppercase",
    Cell: ({ row }) => (
      <>
        {row.original.role === 2 && <span>Admin</span>}
        {row.original.role === 3 && <span>Surveyor</span>}
        {row.original.role === 4 && <span>Operator</span>}
      </>
    ),
  },
  {
    Header: () => null,
    id: "aksi",
    classNameCell: "ltr:text-right rtl:text-left whitespace-nowrap",
    Cell: ({ row }) => (
      <div className="inline-flex ltr:ml-auto rtl:mr-auto">
        <Link href={`/users/${row.original._id}`} passHref>
          <a className="btn btn-icon btn_outlined btn_secondary">
            <span className="las las-pen-fancy"></span>
          </a>
        </Link>
      </div>
    ),
  },
];
