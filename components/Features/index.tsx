import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = () => {
  return (
    <>
      <section id="features" className="py-16 md:py-20 lg:py-28">
        <div className="container">
          <SectionTitle
            title="ทำไมคนขายรถถึงมั่นใจใน V-Autocar"
            paragraph="เรารับซื้อรถจำนวนมากจากเจ้าของรถ บริษัทฟลีต และดีลเลอร์ทั่วประเทศ พร้อมขั้นตอนที่โปร่งใส การประเมินรวดเร็ว และทีมงานที่ดูแลทุกขั้นตอนของการขายให้เสร็จสมบูรณ์."
            center
          />

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map((feature) => (
              <SingleFeature key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
