"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getImagePath, LOGO_PLACEHOLDER, IMAGE_PLACEHOLDER } from "@/lib/utils";
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

  // Close navbar when clicking on a link
  const handleNavLinkClick = () => {
    setNavbarOpen(false);
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
        className={`header left-0 top-0 z-40 flex w-full items-center transition-all duration-300 ${
          sticky
            ? "fixed z-[9999] bg-[#2C2C2C]/95 backdrop-blur-md shadow-lg"
            : "absolute bg-[#2C2C2C]"
        } ${navbarOpen ? "lg:flex hidden" : ""}`}
      >
        {/* Red top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EF4444] via-[#DC2626] to-[#EF4444]"></div>
        
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between lg:justify-start">
            {/* Logo on left */}
            <div className="flex-shrink-0 px-4 xl:mr-12">
              <Link
                href="/"
                className={`header-logo block ${
                  sticky ? "py-3 lg:py-1" : "py-4"
                } `}
                onClick={handleNavLinkClick}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={getImagePath("/images/logo/checkkub.png")}
                    alt="CheckKub Premium Used Cars"
                    width={180}
                    height={72}
                    className="h-auto max-h-12 sm:max-h-14 lg:max-h-20 w-auto object-contain"
                    priority
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      if (t && t.src !== LOGO_PLACEHOLDER) t.src = LOGO_PLACEHOLDER;
                    }}
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Menu items centered */}
            <div className="hidden lg:flex flex-1 items-center justify-center px-4">
              <nav
                id="navbarCollapse"
                className="navbar flex visible static w-auto border-none bg-transparent p-0 opacity-100"
              >
                <ul className="flex items-center gap-1">
                  {menuData.map((menuItem, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 && (
                        <span className="h-4 w-[1px] bg-gray-500/50 mx-2"></span>
                      )}
                      <Link
                        href={menuItem.path || "#"}
                        className={`relative px-3 lg:px-4 py-2 lg:py-3 text-sm font-medium transition-all duration-300 whitespace-nowrap group ${
                          usePathName === menuItem.path
                            ? "text-[#EF4444]"
                            : "text-gray-300 hover:text-white"
                        }`}
                      >
                        <span className="relative z-10">{menuItem.title}</span>
                        {usePathName === menuItem.path && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EF4444] rounded-full"></span>
                        )}
                        <span className="absolute inset-0 bg-[#EF4444]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Mobile Search and Menu Button */}
            <div className="flex items-center gap-2 px-4 lg:hidden">
              {/* Mobile Search */}
              <div className="relative flex-1 max-w-[180px]" ref={searchContainerRef}>
                <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                    placeholder="ค้นหา..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => {
                      if (searchResults.length > 0) {
                        setShowResults(true);
                      }
                    }}
                    className="w-full h-9 px-3 pl-9 rounded-full border border-gray-500/50 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#EF4444]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#EF4444]/20 transition-all duration-300 text-xs"
                  />
                  <button
                    type="submit"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-white transition-colors"
                    aria-label="ค้นหา"
                  >
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
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

                {/* Mobile Search Results Dropdown */}
                {showResults && (searchResults.length > 0 || isSearching) && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-200/50 backdrop-blur-sm max-h-[300px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#EF4444] mx-auto mb-2"></div>
                        <p className="text-xs">กำลังค้นหา...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        {searchResults.map((car) => (
                          <Link
                            key={car.id}
                            href={`/cars/${encodeCarId(car.id)}`}
                            className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-[#EF4444]/5 hover:to-transparent transition-all duration-200 border-b border-gray-100 last:border-b-0 group"
                            onClick={() => {
                              setShowResults(false);
                              setSearchQuery("");
                              handleNavLinkClick();
                            }}
                          >
                            <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                              <Image
                                src={getImagePath(car.image)}
                                alt={`${car.brand} ${car.model}`}
                                fill
                                className="object-cover"
                                sizes="48px"
                                onError={(e) => {
                                  const t = e.target as HTMLImageElement;
                                  if (t && t.src !== IMAGE_PLACEHOLDER) t.src = IMAGE_PLACEHOLDER;
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-gray-900 truncate">
                                {car.brand} {car.model}
                              </h4>
                              <p className="text-[10px] text-gray-500">
                                ปี {car.year}
                              </p>
                              <p className="text-xs font-bold text-[#EF4444] mt-0.5">
                                {new Intl.NumberFormat('th-TH').format(car.price)} บาท
                              </p>
                            </div>
                          </Link>
                        ))}
                        {searchQuery.trim() && (
                          <div className="p-2 border-t border-gray-200 bg-gray-50">
                            <Link
                              href={`/cars?q=${encodeURIComponent(searchQuery.trim())}`}
                              className="block text-center text-xs text-[#EF4444] hover:underline font-medium"
                              onClick={() => {
                                setShowResults(false);
                                setSearchQuery("");
                                handleNavLinkClick();
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

              {/* Mobile Menu Button */}
              <button
                onClick={navbarToggleHandler}
                id="navbarToggler"
                aria-label="Mobile Menu"
                aria-expanded={navbarOpen}
                className="relative rounded-lg px-3 py-2 ring-primary focus:ring-2 z-50 hover:bg-white/10 transition-colors duration-300"
              >
                <div className="flex flex-col gap-1.5">
                  <span
                    className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                      navbarOpen ? "rotate-45 translate-y-2" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                      navbarOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                      navbarOpen ? "-rotate-45 -translate-y-2" : ""
                    }`}
                  />
                </div>
              </button>
            </div>

            {/* Desktop Search input on right */}
            <div className="hidden lg:flex items-center justify-end px-4">
              <div className="relative" ref={searchContainerRef}>
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
                    className="w-[160px] lg:w-[200px] h-9 lg:h-10 px-4 pl-10 lg:pl-11 rounded-full border border-gray-500/50 bg-white/5 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#EF4444]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#EF4444]/20 transition-all duration-300 text-sm"
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

                {/* Desktop Search Results Dropdown */}
                {showResults && (searchResults.length > 0 || isSearching) && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-200/50 backdrop-blur-sm max-h-[400px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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
                            className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-[#EF4444]/5 hover:to-transparent transition-all duration-200 border-b border-gray-100 last:border-b-0 group"
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
                                onError={(e) => {
                                  const t = e.target as HTMLImageElement;
                                  if (t && t.src !== IMAGE_PLACEHOLDER) t.src = IMAGE_PLACEHOLDER;
                                }}
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

      {/* Mobile Menu - Compact Side Drawer */}
      <nav
        id="navbarCollapseMobile"
        className={`lg:hidden fixed top-0 right-0 w-[260px] h-full bg-[#1e1e1e] z-40 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          navbarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Red top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#EF4444] via-[#DC2626] to-[#EF4444]"></div>

        <div className="flex flex-col h-full pt-1">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/50">
            <Link
              href="/"
              onClick={handleNavLinkClick}
              className="flex items-center"
            >
              <Image
                src={getImagePath("/images/logo/checkkub.png")}
                alt="CheckKub"
                width={100}
                height={40}
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  if (t && t.src !== LOGO_PLACEHOLDER) t.src = LOGO_PLACEHOLDER;
                }}
              />
            </Link>
            <button
              onClick={navbarToggleHandler}
              className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors duration-200"
              aria-label="Close Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <ul className="flex flex-col p-3 overflow-y-auto">
            {menuData.map((menuItem, index) => (
              <li key={index}>
                <Link
                  href={menuItem.path || "#"}
                  onClick={handleNavLinkClick}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    usePathName === menuItem.path
                      ? "text-white bg-[#EF4444]/90"
                      : "text-gray-400 hover:text-white hover:bg-white/8"
                  }`}
                >
                  {usePathName === menuItem.path && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></span>
                  )}
                  {menuItem.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {navbarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={navbarToggleHandler}
        />
      )}
      
    </>
  );
};

export default Header;
