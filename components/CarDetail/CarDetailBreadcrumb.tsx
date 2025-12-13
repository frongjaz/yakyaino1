"use client";
import Link from "next/link";

interface CarDetailBreadcrumbProps {
  brand: string;
  model: string;
  year: number;
}

const CarDetailBreadcrumb = ({
  brand,
  model,
  year,
}: CarDetailBreadcrumbProps) => {
  return (
    <section className="bg-white py-4">
      
      <div className="container mx-auto px-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="text-gray-600 hover:text-[#EF4444] transition"
          >
            HOME
          </Link>
          <span className="text-gray-400">{" > "}</span>
          <Link
            href="/cars"
            className="text-gray-600 hover:text-[#EF4444] transition"
          >
            ขายรถ
          </Link>
          <span className="text-gray-400">{" > "}</span>
          <span className="text-gray-900 font-medium">
            {brand} {model} {year}
          </span>
        </nav>
      </div>
    </section>
  );
};

export default CarDetailBreadcrumb;

