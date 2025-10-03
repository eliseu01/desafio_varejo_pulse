import React from "react";
import IconLoading from "../icons/Loading";

const LoadData = ({ message }: { message: string }) => {
  return (
    <div className='flex flex-col items-center justify-center text-slate-500'>
      <IconLoading className='h-8 w-8 animate-spin' />
    </div>
  );
};

export default LoadData;