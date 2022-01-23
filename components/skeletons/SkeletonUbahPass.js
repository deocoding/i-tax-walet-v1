import React from "react";
import Shimmer from "./Shimmer";
import SkeletonElement from "./SkeletonElement";

const SkeletonUbahPass = ({ type }) => {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton-ubah-pass">
        <SkeletonElement type="title" />
        <SkeletonElement type="label" />
        <SkeletonElement type="form" />
        <SkeletonElement type="button" />
      </div>
      <Shimmer />
    </div>
  );
};

export default SkeletonUbahPass;
