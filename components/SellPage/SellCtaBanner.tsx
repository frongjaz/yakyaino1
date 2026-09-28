type Props = {
  heading: string;
  sub: string;
  btnText?: string;
};

export default function SellCtaBanner({ heading, sub }: Props) {
  return (
    <section className="bg-[#EF4444] py-12 md:py-16">
      <div className="container px-4 text-center">
        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-red-200">
          ฟรี — ไม่มีค่าใช้จ่าย
        </p>
        <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">{heading}</h2>
        <p className="mb-8 text-red-100">{sub}</p>
        <a
          href="https://line.me/ti/p/@checkkub"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 rounded-full bg-[#06C755] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#05b34c] hover:shadow-xl"
        >
          <svg viewBox="0 0 24 24" fill="white" className="h-5 w-5 shrink-0">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.41-.097-.54-.271l-2.396-3.27v2.914c0 .345-.282.629-.631.629-.345 0-.627-.284-.627-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .4.099.528.271l2.397 3.27V8.108c0-.345.282-.63.628-.63.349 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.631-.63.345 0 .627.285.627.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
          ทักผ่าน LINE เลย
        </a>
      </div>
    </section>
  );
}
