import React, {useState} from 'react'

import { IoIosArrowDown } from "react-icons/io";
import Dropdown from './Dropdown';
const hero = () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="w-full px-[4rem] min-h-[620px] pt-[40px] mx-auto bg-black flex items-center flex-col ">
        <div className=" flex flex-col items-center justify-center">
          <div className="flex w-full h-full items-center gap-5">
            <div
              onClick={() => setOpen(!open)}
              className="   w-full flex items-center gap-10 justify-center bg-white rounded-xl text-black"
            >
              <button className=" w-[100px] cursor-pointer -500 flex items-center gap-3 justify-center  rounded-xl h-[50px]">
                <h1 className="text-[20px] ">Menu</h1>
              </button>
              <div className="  px-2 py-1 w-[50px] rounded-lg flex items-center justify-center">
                <IoIosArrowDown className="text-[25px]  " />
              </div>
            </div>
            <button className=" w-[100px] cursor-pointer bg-white flex items-center  gap-3 justify-center  rounded-xl h-[50px]">
              <h1 className="text-[20px] px-4 py-2">Submit</h1>
            </button>
          </div>

          {open && <Dropdown />}
        </div>

        <div className="flex items-start justify-center  w-[900px] min-h-[400px]  px-[4rem] py-[4rem]">
          <textarea
            name="text"
            id="text"
            cols="30"
            rows="10"
            className="w-full text-[20px] rounded-lg  bg-gray-300 px-4 py-4 overflow-auto  border-none"
          >
            Type here
          </textarea>
        </div>
      </div>
    );
}

export default hero