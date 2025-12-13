import CarDetailBreadcrumb from "@/components/CarDetail/CarDetailBreadcrumb";
import CarImageGallery from "@/components/CarDetail/CarImageGallery";
import CarSpecifications from "@/components/CarDetail/CarSpecifications";
import CarPricing from "@/components/CarDetail/CarPricing";
import CarContactSection from "@/components/CarDetail/CarContactSection";
import RelatedCars from "@/components/CarDetail/RelatedCars";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "รายละเอียดรถ | V-Autocar",
  description: "ดูรายละเอียดรถยนต์",
};

// Generate static params for static export
export async function generateStaticParams() {
  // Sample car IDs - replace with actual database fetch
  // This would normally fetch all car IDs from database
  const carIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  
  return carIds.map((id) => ({
    id: id,
  }));
}

// This would normally fetch from database
async function getCarData(id: string) {
  // Sample data - replace with actual database fetch
  return {
    id,
    brand: "MAZDA",
    model: "CX-30 2.0 C",
    grade: "C",
    year: 2023,
    type: "SUV",
    gearbox: "Automatic",
    color: "White",
    mileage: "11x,xxx",
    licensePlate: "3ซส 7587",
    location: "กรุงเทพมหานคร",
    price: 1000000,
    monthlyPayment: 13000,
    mainImage: "/images/hero/1231384.png",
    images: [
      "/images/hero/1231384.png",
      "/images/hero/1231384.png",
      "/images/hero/1231384.png",
    ],
    totalPhotos: 6,
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const car = await getCarData(params.id);

  return (
    <>
      <CarDetailBreadcrumb
        brand={car.brand}
        model={car.model}
        year={car.year}
      />
      <br /><br /><br />
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            {/* Images - Full Width */}
            <CarImageGallery
              mainImage={car.mainImage}
              images={car.images}
              totalPhotos={car.totalPhotos}
            />
            
            {/* Specs and Contact - 2 Columns */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
              {/* Left Column - Specs and Pricing */}
              <div className="space-y-6">
                <CarSpecifications
                  brand={car.brand}
                  model={car.model}
                  grade={car.grade}
                  year={car.year}
                  type={car.type}
                  gearbox={car.gearbox}
                  color={car.color}
                  mileage={car.mileage}
                  licensePlate={car.licensePlate}
                  location={car.location}
                />
                <CarPricing
                  price={car.price}
                  monthlyPayment={car.monthlyPayment}
                />
              </div>

              {/* Right Column - Contact Section */}
              <div>
                <CarContactSection />
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedCars />
    </>
  );
}

