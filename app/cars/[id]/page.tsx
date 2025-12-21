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
  // Mockup data - different data based on car ID
  if (id === "2") {
    // Benz CLS 250
    return {
      id,
      brand: "BENZ",
      model: "CLS 250",
      grade: "2.0 AMG",
      year: 2016,
      engine: "2000 CC",
      type: "ดีเซล",
      gearbox: "AT",
      color: "เทา",
      mileage: "14x,xxx",
      licensePlate: "5กค-8551",
      location: "กทม",
      price: 1090000,
      monthlyPayment: 19000,
      mainImage: "/images/hero/main11.jpg",
      images: [
        "/images/hero/main12.jpg",
        "/images/hero/main13.jpg",
        "/images/hero/main14.jpg",
      ],
      totalPhotos: 3,
    };
  }
  
  if (id === "3") {
    // Toyota Corolla Altis
    return {
      id,
      brand: "TOYOTA",
      model: "Corolla Altis",
      grade: "1.8 GR SPORT",
      year: 2023,
      engine: "1800 CC",
      type: "เบนซิน",
      gearbox: "AT",
      color: "แดง",
      mileage: "67,XXX",
      licensePlate: "4ขณ-8326",
      location: "กรุงเทพ",
      price: 699000,
      monthlyPayment: 12000,
      mainImage: "/images/hero/main21.jpg",
      images: [
        "/images/hero/main22.jpg",
        "/images/hero/main23.jpg",
        "/images/hero/main24.jpg",
      ],
      totalPhotos: 5,
    };
  }
  
  if (id === "4") {
    // Honda Accord
    return {
      id,
      brand: "HONDA",
      model: "ACCORD",
      grade: "2.0 HYBRID TECH",
      year: 2022,
      engine: "2000 CC",
      type: "เบนซิน-ไฟฟ้า",
      gearbox: "AT",
      color: "ดำ",
      mileage: "9x,xxx",
      licensePlate: "2ขบ-274",
      location: "กรุงเทพ",
      price: 899000,
      monthlyPayment: 16000,
      mainImage: "/images/hero/main31.jpg",
      images: [
        "/images/hero/main32.jpg",
        "/images/hero/main33.jpg",
        "/images/hero/main34.jpg",
      ],
      totalPhotos: 4,
    };
  }
  
  if (id === "5") {
    // Toyota Harrier
    return {
      id,
      brand: "TOYOTA",
      model: "Harrier",
      grade: "Hybrid",
      year: 2014,
      engine: "2500 CC",
      type: "เบนซิน-ไฟฟ้า",
      gearbox: "AT",
      color: "น้ำตาล",
      mileage: "8x,XXX",
      licensePlate: "ขย-899",
      location: "ชลบุรี",
      price: 699000,
      monthlyPayment: 12000,
      mainImage: "/images/hero/main41.jpg",
      images: [
        "/images/hero/main42.jpg",
        "/images/hero/main43.jpg",
        "/images/hero/main44.jpg",
      ],
      totalPhotos: 6,
    };
  }
  
  if (id === "6") {
    // BMW 530E
    return {
      id,
      brand: "BMW",
      model: "530E",
      grade: "2.0 ELITE",
      year: 2020,
      engine: "2000 CC",
      type: "เบนซิน+ไฟฟ้า",
      gearbox: "AT",
      color: "ดำ",
      mileage: "78,xxx",
      licensePlate: "5ขง-2353",
      location: "กทม",
      price: 799000,
      monthlyPayment: 14000,
      mainImage: "/images/hero/main51.jpg",
      images: [
        "/images/hero/main52.jpg",
        "/images/hero/main53.jpg",
        "/images/hero/main54.jpg",
      ],
      totalPhotos: 3,
    };
  }
  
  if (id === "7") {
    // Toyota Alphard
    return {
      id,
      brand: "TOYOTA",
      model: "Alphard",
      grade: "2.5 Hybrid SCR Package",
      year: 2023,
      engine: "2500 CC",
      type: "เบนซิน-ไฟฟ้า",
      gearbox: "AT",
      color: "แดง",
      mileage: "38,XXX",
      licensePlate: "6ขฎ-2563",
      location: "กรุงเทพ",
      price: 2459000,
      monthlyPayment: 44000,
      mainImage: "/images/hero/main61.jpg",
      images: [
        "/images/hero/main62.jpg",
        "/images/hero/main63.jpg",
        "/images/hero/main64.jpg",
      ],
      totalPhotos: 5,
    };
  }
  
  if (id === "8") {
    // Benz SLK200
    return {
      id,
      brand: "Benz",
      model: "SLK200",
      grade: "Roadster",
      year: 2013,
      engine: "1800 CC",
      type: "เบนซิน",
      gearbox: "AT",
      color: "ขาว",
      mileage: "8X,XXX",
      licensePlate: "3กค-38",
      location: "กรุงเทพ",
      price: 899000,
      monthlyPayment: 16000,
      mainImage: "/images/hero/main71.jpg",
      images: [
        "/images/hero/main72.jpg",
        "/images/hero/main73.jpg",
        "/images/hero/main74.jpg",
      ],
      totalPhotos: 4,
    };
  }
  
  if (id === "9") {
    // BMW 740LI
    return {
      id,
      brand: "BMW",
      model: "740LI",
      grade: "Limousine RHD",
      year: 2017,
      engine: "3000 CC",
      type: "เบนซิน",
      gearbox: "AT",
      color: "ขาว",
      mileage: "14X,XXX",
      licensePlate: "จษ-606",
      location: "เชียงใหม่",
      price: 1269000,
      monthlyPayment: 22000,
      mainImage: "/images/hero/main81.jpg",
      images: [
        "/images/hero/main82.jpg",
        "/images/hero/main83.jpg",
        "/images/hero/main84.jpg",
      ],
      totalPhotos: 6,
    };
  }
  
  // Default: Benz GLA200
  return {
    id,
    brand: "Benz",
    model: "GLA200",
    grade: "PROGRESSIVE",
    year: 2022,
    engine: "1300 CC",
    type: "เบนซิน",
    gearbox: "AT",
    color: "ดำ",
    mileage: "60,XXX",
    licensePlate: "3ขร-8954",
    location: "กรุงเทพ",
    price: 1199000,
    monthlyPayment: 21000,
    mainImage: "/images/hero/main1.png",
    images: [
      "/images/hero/main2.png",
      "/images/hero/main3.png",
      "/images/hero/main4.png",
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
                  engine={car.engine}
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

      <RelatedCars currentCarId={car.id} />
    </>
  );
}

