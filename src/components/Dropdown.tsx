import React from 'react';

const Dropdown = () => {
  return (
    <div className="max-w-[700px] w-full min-h-[150px] flex  bg-slate-700 rounded-lg mt-8 text-white duration-700 py-4">
      <div className="flex flex-col items-start mt-4 justify-start px-4 w-full gap-4 h-auto">
        <div className="hover:bg-slate-500 rounded-md w-full  h-10  flex items-center justify-start px-6  ">
          <a href="/" className="">
            My Profile
          </a>
        </div>

        <div className="hover:bg-slate-500 rounded-md w-full  h-10 flex items-center justify-start px-6">
          <a href="/" className="">
            Settings
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
