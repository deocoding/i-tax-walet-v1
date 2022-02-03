import React from "react";

export const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <span>
      <form
        className="flex items-center lg:ltr:ml-2 lg:rtl:mr-2 mt-5 lg:mt-0"
        action="#"
      >
        <label className="form-control-addon-within rounded-full border-secondary">
          <input
            type="text"
            className="form-control border-none"
            placeholder="Cari"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-link text-secondary dark:text-gray-700 hover:text-primary dark:hover:text-primary text-xl leading-none las las-search ltr:mr-4 rtl:ml-4"
          ></button>
        </label>
      </form>
    </span>
  );
};
