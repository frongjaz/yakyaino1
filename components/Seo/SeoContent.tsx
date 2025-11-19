const SeoContent = () => {
  const highlight = "text-primary font-semibold";

  return (
    <section id="seo" className="bg-gray-light py-16 dark:bg-bg-color-dark md:py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-black dark:text-white sm:text-4xl">
            บริการรับซื้อรถจำนวนมากทั่วประเทศ ครบทุกขั้นตอนในที่เดียว
          </h2>
          <p className="text-base leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg">
            V-Autocar เชี่ยวชาญด้านการ
            <span className={highlight}> รับซื้อรถจำนวนมาก </span>
            ทั้งรถบ้าน รถบริษัท รถเช่าระยะยาว และฟลีตรถขนส่งทุกประเภท เราออกข้อเสนอที่ยุติธรรมจากข้อมูลตลาดปัจจุบัน
            พร้อมจัดทีมตรวจสภาพ โอนกรรมสิทธิ์ และโอนเงินแบบไม่ต้องรอนาน
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-three dark:bg-gray-dark dark:shadow-two">
            <h3 className="mb-4 text-2xl font-semibold text-black dark:text-white">
              ทำไมธุรกิจชั้นนำถึงขายรถให้เรา
            </h3>
            <ul className="space-y-3 text-base text-body-color dark:text-body-color-dark">
              <li>
                • ทีมประเมินราคาที่เข้าใจตลาดไทยและสามารถปิดดีล
                <span className={highlight}> รถจำนวนมากภายในไม่กี่วัน</span>
              </li>
              <li>
                • โครงข่ายทีมภาคสนามกว่า 30 จังหวัด รองรับการนัดตรวจ
                <span className={highlight}> พร้อมกันหลายสถานที่</span>
              </li>
              <li>
                • เอกสารมาตรฐานบริษัท โปร่งใส ตรวจสอบย้อนหลังได้ทุกขั้นตอน
              </li>
              <li>• เลือกวิธีรับเงินได้ทั้งโอนบริษัท เช็คแคชเชียร์ หรือ Letter of Guarantee</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-three dark:bg-gray-dark dark:shadow-two">
            <h3 className="mb-4 text-2xl font-semibold text-black dark:text-white">
              โซลูชันสำหรับเจ้าของรถและองค์กร
            </h3>
            <dl className="space-y-4 text-base text-body-color dark:text-body-color-dark">
              <div>
                <dt className="font-semibold text-black dark:text-white">รถบ้านและรถครอบครัว</dt>
                <dd>นัดตรวจถึงบ้านหรือที่ทำงาน ประเมินและโอนทันทีเมื่อเอกสารครบ</dd>
              </div>
              <div>
                <dt className="font-semibold text-black dark:text-white">ฟลีตรถบริษัท / รถเช่าทางธุรกิจ</dt>
                <dd>จัดรอบตรวจตามจำนวนรถ พร้อมรายงานสภาพละเอียดสำหรับฝ่ายบัญชีและจัดซื้อ</dd>
              </div>
              <div>
                <dt className="font-semibold text-black dark:text-white">ดีลเลอร์และเต็นท์รถ</dt>
                <dd>รับซื้อสต็อกล็อตใหญ่ ช่วยดึงเงินสดหมุนเวียน และวางแผนปล่อยรถตามฤดูกาล</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-white p-8 shadow-three dark:bg-gray-dark dark:shadow-two">
          <h3 className="mb-6 text-2xl font-semibold text-black dark:text-white">
            คำถามที่พบบ่อยเกี่ยวกับการรับซื้อรถจำนวนมาก
          </h3>
          <div className="space-y-6">
            <details className="group rounded-xl border border-body-color/20 bg-white p-4 dark:border-white/10 dark:bg-transparent">
              <summary className="cursor-pointer text-lg font-semibold text-black dark:text-white">
                ขั้นตอนรับซื้อรถจำนวนมากกับ V-Autocar ใช้เวลานานแค่ไหน
              </summary>
              <p className="mt-3 text-base text-body-color dark:text-body-color-dark">
                หลังได้รับข้อมูลรถครบ ทีมงานจะเสนอราคาภายใน 24 ชั่วโมง นัดตรวจสภาพตามจำนวนรถที่มี
                และปิดดีลพร้อมโอนเงินภายใน 1-3 วันทำการ ขึ้นอยู่กับปริมาณรถและเอกสารที่เตรียมไว้
              </p>
            </details>
            <details className="group rounded-xl border border-body-color/20 bg-white p-4 dark:border-white/10 dark:bg-transparent">
              <summary className="cursor-pointer text-lg font-semibold text-black dark:text-white">
                ต้องเตรียมเอกสารอะไรบ้างหากเป็นรถบริษัทหรือรถลีสซิ่ง
              </summary>
              <p className="mt-3 text-base text-body-color dark:text-body-color-dark">
                เราต้องการสำเนาทะเบียนรถ หนังสือปลดภาระ (ถ้ามี) หนังสือมอบอำนาจ และเอกสารบริษัทนิติบุคคล
                ทีมงานจะส่งเช็กลิสต์และตัวอย่างเอกสารให้ล่วงหน้าเพื่อประหยัดเวลาในวันที่นัดหมาย
              </p>
            </details>
            <details className="group rounded-xl border border-body-color/20 bg-white p-4 dark:border-white/10 dark:bg-transparent">
              <summary className="cursor-pointer text-lg font-semibold text-black dark:text-white">
                รับซื้อรถสภาพอย่างไรบ้าง และมีบริการรับรถนอกพื้นที่หรือไม่
              </summary>
              <p className="mt-3 text-base text-body-color dark:text-body-color-dark">
                V-Autocar รับซื้อรถทุกสภาพ ทั้งใช้งานปกติ รถชนเล็กน้อย หรือรถที่ต้องซ่อมก่อนขาย
                เรามีทีมงานเดินทางได้ทั่วประเทศ รวมถึงบริการยกรถและขนส่งตามความเหมาะสมของแต่ละดีล
              </p>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeoContent;

