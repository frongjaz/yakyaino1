"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import menuData from "./menuData";

const Header = () => {
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  const usePathName = usePathname();

  return (
    <>
      <header
        className={`header left-0 top-0 z-40 flex w-full items-center ${
          sticky
            ? "fixed z-[9999] bg-[#2C2C2C] shadow-sticky transition"
            : "absolute bg-[#2C2C2C]"
        }`}
      >
        {/* Red top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#EF4444]"></div>
        
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            {/* Logo on left */}
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link
                href="/"
                className={`header-logo block w-full ${
                  sticky ? "py-5 lg:py-2" : "py-8"
                } `}
              >
                <div className="flex items-center gap-2">
                  {/* Shield/crest logo with car silhouette */}
                  <svg
                    width="45"
                    height="45"
                    viewBox="0 0 45 45"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-shrink-0"
                  >
                    {/* Shield outline */}
                    <path
                      d="M22.5 3L7 9V19C7 29 15 37 22.5 39C30 37 38 29 38 19V9L22.5 3Z"
                      stroke="#C0C0C0"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    {/* Car silhouette inside shield */}
                    <path
                      d="M15 22C15 20.8954 15.8954 20 17 20H28C29.1046 20 30 20.8954 30 22V26C30 27.1046 29.1046 28 28 28H17C15.8954 28 15 27.1046 15 26V22Z"
                      fill="#EF4444"
                    />
                    <circle cx="19" cy="28" r="2" fill="#EF4444" />
                    <circle cx="26" cy="28" r="2" fill="#EF4444" />
                    <path
                      d="M18 20L19 18H26L27 20"
                      stroke="#EF4444"
                      strokeWidth="1"
                      fill="none"
                    />
                  </svg>
                  
                </div>
              </Link>
            </div>

            {/* Menu items centered */}
            <div className="flex-1 flex items-center justify-center px-4">
              <button
                onClick={navbarToggleHandler}
                id="navbarToggler"
                aria-label="Mobile Menu"
                className="absolute right-4 top-1/2 block translate-y-[-50%] rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden z-50"
              >
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] bg-white transition-all duration-300 ${
                    navbarOpen ? " top-[7px] rotate-45" : " "
                  }`}
                />
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] bg-white transition-all duration-300 ${
                    navbarOpen ? "opacity-0 " : " "
                  }`}
                />
                <span
                  className={`relative my-1.5 block h-0.5 w-[30px] bg-white transition-all duration-300 ${
                    navbarOpen ? " top-[-8px] -rotate-45" : " "
                  }`}
                />
              </button>
              <nav
                id="navbarCollapse"
                className={`navbar absolute right-0 z-30 w-[250px] rounded border-[.5px] border-body-color/50 bg-white px-6 py-4 duration-300 lg:visible lg:static lg:w-auto lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 ${
                  navbarOpen
                    ? "visibility top-full opacity-100"
                    : "invisible top-[120%] opacity-0"
                }`}
              >
                <ul className="flex items-center gap-0">
                  {menuData.map((menuItem, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 && (
                        <span className="h-4 w-[1px] bg-gray-400 mx-2 lg:mx-4"></span>
                      )}
                      <Link
                        href={menuItem.path || "#"}
                        className={`px-3 lg:px-4 py-4 lg:py-6 text-sm lg:text-base transition-colors whitespace-nowrap ${
                          usePathName === menuItem.path
                            ? "text-[#EF4444] hover:text-[#EF4444]"
                            : "text-gray-300 hover:text-white"
                        }`}
                      >
                        {menuItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Search input on right */}
            <div className="flex items-center justify-end px-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder=""
                  className="w-[180px] lg:w-[220px] h-9 lg:h-10 px-4 pl-9 lg:pl-10 rounded-full border border-gray-400 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-colors"
                />
                <svg
                  className="absolute left-2.5 lg:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
