const ITEMS = [
  {
    top: "10+",
    label: "ปีประสบการณ์",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" />
      </svg>
    ),
  },
  {
    top: "ทุกยี่ห้อ",
    label: "รับซื้อทุกรุ่น",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    top: "ประเมินราคา",
    label: "ฟรี ไม่มีค่าใช้จ่าย",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m0 0l-3-3m3 3l3 3M3 12a9 9 0 1 0 18 0A9 9 0 0 0 3 12z" />
      </svg>
    ),
  },
  {
    top: "ดูแลเอกสาร",
    label: "ครบทุกขั้นตอน",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
      </svg>
    ),
  },
  {
    top: "ทั่วประเทศ",
    label: "นัดตรวจรถได้เลย",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
      </svg>
    ),
  },
];

export default function SellTrustBar() {
  return (
    <div className="bg-gray-900">
      <div className="container px-4">
        <div className="flex flex-wrap items-stretch justify-center divide-y divide-white/10 md:divide-x md:divide-y-0">
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className="flex w-1/2 items-center gap-3 px-5 py-4 md:w-auto md:flex-1 md:justify-center md:py-5"
            >
              <span className="shrink-0 text-[#EF4444]">{item.icon}</span>
              <div>
                <p className="text-sm font-bold leading-tight text-white">{item.top}</p>
                <p className="text-xs leading-tight text-gray-400">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
