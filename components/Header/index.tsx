"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import menuData from "./menuData";
import { apiGet } from "@/lib/api";
import { encodeCarId } from "@/lib/id-encoder";

interface SearchCar {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
}

const Header = () => {
  const router = useRouter();
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

  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchCar[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If query is empty, clear results
    if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Debounce search API call
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await apiGet<{ success: boolean; data: SearchCar[] }>(`/api/cars?q=${encodeURIComponent(value)}`);
        if (data.success && data.data) {
          setSearchResults(data.data.slice(0, 5)); // Limit to 5 results
          setShowResults(true);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce
  };

  // Handle search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/cars?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
      setSearchQuery("");
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close search results on route change
  useEffect(() => {
    setShowResults(false);
  }, [usePathName]);

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
       
        
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            {/* Logo on left */}
            <div className="w-64 max-w-full px-4 xl:mr-12">
              <Link
                href="/"
                className={`header-logo block w-full ${
                  sticky ? "py-3 lg:py-1" : "py-4"
                } `}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={getImagePath("/images/logo/checkkub.png")}
                    alt="CheckKub Premium Used Cars"
                    width={180}
                    height={72}
                    className="h-auto max-h-14 lg:max-h-20 w-auto object-contain"
                    priority
                  />
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
                        <span className="h-3 w-[1px] bg-gray-400 mx-1.5 lg:mx-3"></span>
                      )}
                      <Link
                        href={menuItem.path || "#"}
                        className={`px-2 lg:px-3 py-2 lg:py-3 text-xs lg:text-sm transition-colors whitespace-nowrap ${
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
              <div className="relative hidden md:block" ref={searchContainerRef}>
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    placeholder="ค้นหารถยนต์..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => {
                      if (searchResults.length > 0) {
                        setShowResults(true);
                      }
                    }}
                    className="w-[160px] lg:w-[200px] h-8 lg:h-9 px-3 pl-8 lg:pl-9 rounded-full border border-gray-400 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-colors text-sm"
                  />
                  <button
                    type="submit"
                    className="absolute left-2.5 lg:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400 hover:text-white transition-colors"
                    aria-label="ค้นหา"
                  >
                    <svg
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
                  </button>
                </form>

                {/* Search Results Dropdown */}
                {showResults && (searchResults.length > 0 || isSearching) && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto z-50">
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#EF4444] mx-auto mb-2"></div>
                        <p className="text-sm">กำลังค้นหา...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        {searchResults.map((car) => (
                          <Link
                            key={car.id}
                            href={`/cars/${encodeCarId(car.id)}`}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            onClick={() => {
                              setShowResults(false);
                              setSearchQuery("");
                            }}
                          >
                            <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                              <Image
                                src={getImagePath(car.image)}
                                alt={`${car.brand} ${car.model}`}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 truncate">
                                {car.brand} {car.model}
                              </h4>
                              <p className="text-xs text-gray-500">
                                ปี {car.year}
                              </p>
                              <p className="text-sm font-bold text-[#EF4444] mt-1">
                                {new Intl.NumberFormat('th-TH').format(car.price)} บาท
                              </p>
                            </div>
                          </Link>
                        ))}
                        {searchQuery.trim() && (
                          <div className="p-3 border-t border-gray-200 bg-gray-50">
                            <Link
                              href={`/cars?q=${encodeURIComponent(searchQuery.trim())}`}
                              className="block text-center text-sm text-[#EF4444] hover:underline font-medium"
                              onClick={() => {
                                setShowResults(false);
                                setSearchQuery("");
                              }}
                            >
                              ดูผลการค้นหาทั้งหมด →
                            </Link>
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
      </header>
      
    </>
  );
};

export default Header;
