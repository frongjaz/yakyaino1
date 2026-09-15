type Props = {
  heading: string;
  sub: string;
  btnText: string;
};

export default function SellCtaBanner({ heading, sub, btnText }: Props) {
  return (
    <section className="bg-[#EF4444] py-12 md:py-16">
      <div className="container px-4 text-center">
        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-red-200">
          ฟรี — ไม่มีค่าใช้จ่าย
        </p>
        <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">{heading}</h2>
        <p className="mb-8 text-red-100">{sub}</p>
        <a
          href="#lead-form"
          className="inline-block rounded-full bg-white px-8 py-3.5 text-sm font-bold text-[#EF4444] shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          {btnText}
        </a>
      </div>
    </section>
  );
}
