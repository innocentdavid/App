import React from 'react'

const Navbar = () => {
  return (
    <nav className="w-full px-[4rem] mx-auto bg-black">
      <div className="flex justify-between items-center">
        <div className="">
          <h1 className="text-3xl text-white font-bold font-serif">Logo</h1>
        </div>

        <div className="hidden md:flex items-center justify-center ">
          <ul className="flex items-center gap-8">
            <li className="text-white font-semibold hover:text-orange-300 duration-500">
              <a href="/" className="">
                Home
              </a>
            </li>
            <li className="text-white font-semibold hover:text-orange-300 duration-500">
              <a href="/" className="">
                About
              </a>
            </li>
            <li className="text-white font-semibold hover:text-orange-300 duration-500">
              <a href="/" className="">
                Contact Us
              </a>
            </li>
            <li className="text-white font-semibold hover:text-orange-300 duration-500">
              <a href="/" className="">
                Login
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar