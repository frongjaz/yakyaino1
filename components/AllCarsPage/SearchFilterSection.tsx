"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getImagePath } from "@/lib/utils";
import { apiGet } from "@/lib/api";

interface SearchFilterSectionProps {
  initialBrands?: string[];
}

const SearchFilterSection = ({ initialBrands }: SearchFilterSectionProps = {}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedTab, setSelectedTab] = useState<"all" | "new">(
    (searchParams.get("tab") as "all" | "new") || "all"
  );
  const [selectedBrand, setSelectedBrand] = useState(
    searchParams.get("brand") || ""
  );
  const [priceRange, setPriceRange] = useState("");

  const [brands, setBrands] = useState<string[]>(
    initialBrands
      ? ["ทั้งหมด", ...initialBrands.filter((b) => b !== "ทั้งหมด")]
      : []
  );
  const [loadingBrands, setLoadingBrands] = useState(!initialBrands);

  const priceRanges = [
    "ทั้งหมด",
    "0 - 500,000",
    "500,000 - 1,000,000",
    "1,000,000 - 2,000,000",
    "2,000,000 - 5,000,000",
    "5,000,000+",
  ];

  // Fetch brands from API only when not provided via SSR
  useEffect(() => {
    if (initialBrands) return;

    const fetchBrands = async () => {
      try {
        setLoadingBrands(true);
        const data = await apiGet<{ success: boolean; data: string[] }>('/api/brands');
        if (data.success && data.data && Array.isArray(data.data)) {
          const uniqueBrands = data.data.filter(brand => brand && brand !== 'ทั้งหมด');
          setBrands(['ทั้งหมด', ...uniqueBrands]);
        } else {
          setBrands(['ทั้งหมด']);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
        setBrands(['ทั้งหมด']);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Parse price range to min/max values
  const parsePriceRange = (range: string): { min: number | null; max: number | null } => {
    if (!range || range === "ทั้งหมด") {
      return { min: null, max: null };
    }
    
    if (range === "5,000,000+") {
      return { min: 5000000, max: null };
    }
    
    const parts = range.split(" - ");
    if (parts.length === 2) {
      const min = parseInt(parts[0].replace(/,/g, ""));
      const max = parseInt(parts[1].replace(/,/g, ""));
      return { min, max };
    }
    
    return { min: null, max: null };
  };

  // Convert numeric price to range string
  const priceToRange = (price: number | null): string => {
    if (price === null) return "";
    
    if (price >= 5000000) return "5,000,000+";
    if (price >= 2000000) return "2,000,000 - 5,000,000";
    if (price >= 1000000) return "1,000,000 - 2,000,000";
    if (price >= 500000) return "500,000 - 1,000,000";
    if (price >= 0) return "0 - 500,000";
    
    return "";
  };

  // Sync state with URL params on mount and when params change
  useEffect(() => {
    const urlMinPrice = searchParams.get("minPrice");
    const urlMaxPrice = searchParams.get("maxPrice");
    const urlBrand = searchParams.get("brand") || "";
    const urlTab = (searchParams.get("tab") as "all" | "new") || "all";
    
    // Update brand if changed
    setSelectedBrand(urlBrand);
    
    // Update tab if changed
    setSelectedTab(urlTab);
    
    // Update price range from URL params
    let matchedRange = "";
    if (urlMinPrice || urlMaxPrice) {
      // Try to find matching range from min or max price
      const min = urlMinPrice ? parseInt(urlMinPrice) : null;
      const max = urlMaxPrice ? parseInt(urlMaxPrice) : null;
      
      // Find the range that matches the URL params
      for (const range of priceRanges) {
        if (range === "ทั้งหมด") continue;
        const { min: rangeMin, max: rangeMax } = parsePriceRange(range);
        
        // Match if min price falls within range
        if (min !== null && rangeMin !== null && min >= rangeMin) {
          if (rangeMax === null || min <= rangeMax) {
            matchedRange = range;
            break;
          }
        }
        // Match if max price falls within range
        if (max !== null) {
          if (rangeMax !== null && max <= rangeMax && (rangeMin === null || max >= rangeMin)) {
            matchedRange = range;
            break;
          } else if (rangeMax === null && rangeMin !== null && max >= rangeMin) {
            matchedRange = range;
            break;
          }
        }
      }
    }
    setPriceRange(matchedRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Update URL with current filters
  const updateFilters = useCallback((updates: {
    tab?: "all" | "new";
    brand?: string;
    priceRange?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (updates.tab !== undefined) {
      if (updates.tab === "all") {
        params.delete("tab");
      } else {
        params.set("tab", updates.tab);
      }
    }
    
    if (updates.brand !== undefined) {
      if (!updates.brand || updates.brand === "ทั้งหมด") {
        params.delete("brand");
      } else {
        params.set("brand", updates.brand);
      }
    }
    
    if (updates.priceRange !== undefined) {
      if (!updates.priceRange || updates.priceRange === "ทั้งหมด") {
        params.delete("minPrice");
        params.delete("maxPrice");
      } else {
        const { min, max } = parsePriceRange(updates.priceRange);
        if (min !== null) {
          params.set("minPrice", min.toString());
        } else {
          params.delete("minPrice");
        }
        if (max !== null) {
          params.set("maxPrice", max.toString());
        } else {
          params.delete("maxPrice");
        }
      }
    }
    
    // Remove search query if filtering
    if (updates.brand || updates.priceRange) {
      params.delete("q");
    }
    
    router.push(`/cars?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Handle tab change
  const handleTabChange = (tab: "all" | "new") => {
    setSelectedTab(tab);
    updateFilters({ tab });
  };

  // Handle brand change with debounce
  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    updateFilters({ brand });
  };

  // Handle price range change
  const handlePriceRangeChange = (range: string) => {
    setPriceRange(range);
    updateFilters({ priceRange: range });
  };

  // Reset filters
  const handleReset = () => {
    setSelectedTab("all");
    setSelectedBrand("");
    setPriceRange("");
    router.push("/cars", { scroll: false });
  };

  return (
    <section className="relative overflow-hidden py-8 md:py-12">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={getImagePath("/images/about/S__5800084_0.webp")}
          alt="Car Dealership Background"
          fill
          className="h-full w-full object-cover"
          style={{ 
            objectPosition: "75% 74%",
            transform: "scale(1.2)"
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Search Interface Container with red border */}
        <div className="mx-auto max-w-4xl rounded-lg border border-[#EF4444] bg-gray-800/90 p-6 backdrop-blur-sm">
          {/* Tab Buttons */}
          <div className="mb-6 flex gap-0">
            <button
              onClick={() => handleTabChange("all")}
              className={`px-6 py-3 font-semibold text-white transition ${
                selectedTab === "all"
                  ? "bg-[#EF4444]"
                  : "bg-gray-700 border-b-2 border-[#EF4444] hover:bg-gray-600"
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => handleTabChange("new")}
              className={`px-6 py-3 font-semibold text-white transition ${
                selectedTab === "new"
                  ? "bg-[#EF4444]"
                  : "bg-gray-700 border-b-2 border-[#EF4444] hover:bg-gray-600"
              }`}
            >
              ใหม่
            </button>
          </div>

          {/* Filter Dropdowns */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Brand Dropdown */}
            <div className="relative">
              <select
                value={selectedBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                disabled={loadingBrands}
                aria-label="กรองตามยี่ห้อรถ"
                className="w-full appearance-none rounded-lg border border-[#EF4444] bg-gray-800/90 px-4 py-3 text-white transition-all focus:border-[#EF4444] focus:outline-none focus:ring-2 focus:ring-[#EF4444]/20 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-gray-800">
                  {loadingBrands ? "กำลังโหลดยี่ห้อ..." : "ยี่ห้อรถที่ต้องการ"}
                </option>
                {brands.map((brand) => (
                  <option key={brand} value={brand} className="bg-gray-800">
                    {brand}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Price Range Dropdown */}
            <div className="relative">
              <select
                value={priceRange}
                onChange={(e) => handlePriceRangeChange(e.target.value)}
                aria-label="กรองตามช่วงราคา"
                className="w-full appearance-none rounded-lg border border-[#EF4444] bg-gray-800/90 px-4 py-3 text-white transition-all focus:border-[#EF4444] focus:outline-none focus:ring-2 focus:ring-[#EF4444]/20 hover:bg-gray-800"
              >
                <option value="" className="bg-gray-800">
                  ราคา
                </option>
                {priceRanges.map((price) => (
                  <option key={price} value={price} className="bg-gray-800">
                    {price}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Search Actions */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {(selectedBrand || priceRange) && (
              <button
                onClick={handleReset}
                className="text-sm text-white hover:text-[#EF4444] transition-colors underline"
              >
                ล้างตัวกรอง
              </button>
            )}
            {!(selectedBrand || priceRange) && (
              <div className="text-sm text-gray-400">
                เลือกตัวกรองเพื่อค้นหา
              </div>
            )}
            <div className="flex items-center gap-2">
              {(selectedBrand || priceRange) && (
                <span className="text-xs text-gray-400">
                  กำลังกรอง...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchFilterSection;

