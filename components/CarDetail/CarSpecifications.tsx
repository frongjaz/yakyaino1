"use client";
import Image from "next/image";
import { getImagePath } from "@/lib/utils";

interface CarSpecificationsProps {
  brand: string;
  model: string;
  grade?: string;
  year: number;
  engine?: string;
  type?: string;
  gearbox?: string;
  color: string;
  mileage: string;
  licensePlate: string;
  location: string;
}

const CarSpecifications = ({
  brand,
  model,
  grade,
  year,
  engine,
  type,
  gearbox,
  color,
  mileage,
  licensePlate,
  location,
}: CarSpecificationsProps) => {
  const specs = [
    {
      icon: "tag",
      label: "Brand",
      value: brand,
    },
    {
      icon: "car",
      label: "Model",
      value: model,
    },
    {
      icon: "star",
      label: "Grade",
      value: grade || "N/A",
    },
    {
      icon: "calendar",
      label: "Year",
      value: year.toString(),
    },
    {
      icon: "engine",
      label: "Engine",
      value: engine || "N/A",
    },
    {
      icon: "gear",
      label: "Type",
      value: type || "N/A",
    },
    {
      icon: "gearbox",
      label: "Gearbox",
      value: gearbox || "N/A",
    },
    {
      icon: "color",
      label: "Color",
      value: color,
    },
    {
      icon: "speedometer",
      label: "Mileage",
      value: mileage,
    },
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "tag":
        return (
         <Image src={getImagePath("/images/logo/car_pageRIcon-32.svg")} alt="Share" width={50} height={50} />
        );
      case "car":
        return (
        <Image src={getImagePath("/images/logo/car_pageRIcon-33.svg")} alt="Share" width={50} height={50} />
        );
      case "star":
        return (
        <Image src={getImagePath("/images/logo/car_pageRIcon-34.svg")} alt="Share" width={50} height={50} />
        );
      case "calendar":
        return (
        <Image src={getImagePath("/images/logo/car_pageRIcon-35.svg")} alt="Share" width={50} height={50} />
        );
      case "gear":
        return (
        <Image src={getImagePath("/images/logo/car_pageRIcon-36.svg")} alt="Share" width={50} height={50} />
        );
      case "gearbox":
        return (
        <Image src={getImagePath("/images/logo/car_pageRIcon-37.svg")} alt="Share" width={50} height={50} />
        );
      case "color":
        return (
        <Image src={getImagePath("/images/logo/car_pageRIcon-38.svg")} alt="Share" width={50} height={50} />
        );
      case "speedometer":
        return (
        <Image src={getImagePath("/images/logo/car_pageRIcon-39.svg")} alt="Share" width={50} height={50} />
        );
      case "engine":
        return (
        <Image src={getImagePath("/images/logo/car_pageRIcon-36.svg")} alt="Engine" width={50} height={50} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        {brand} {model} {year}
      </h2>
      <div className="space-y-4">
        {specs.map((spec, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white text-[#EF4444]">
              {getIcon(spec.icon)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                <span className="text-gray-500">{spec.label}:</span> {spec.value}
              </p>
            </div>
          </div>
        ))}
        <hr className="my-4 border-gray-200" />
        <div className="flex items-center gap-3">
      
          <div className="flex-1">
            <div className="inline-flex items-center rounded-full border border-[#EF4444] bg-white px-4 py-2">
              <p className="text-sm font-medium text-black">
                ทะเบียน {licensePlate} {location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarSpecifications;

