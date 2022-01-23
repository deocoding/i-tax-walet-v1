import React from "react";

const SkeletonElement = ({ type }) => {
  const classes = `skeleton ${type}`;
  return <div className={(classes, `skeleton ${type}`)}></div>;
};

export default SkeletonElement;
