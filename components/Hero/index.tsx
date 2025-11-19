import { getImagePath } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <>
      <section
        id="home"
        className="relative z-10 overflow-hidden bg-black pb-24 pt-[160px] md:pb-[180px] md:pt-[180px] lg:pt-[200px]"
      >
        <div className="absolute inset-0">
          <Image
            src={getImagePath("/images/video/car5.jpg")}
            alt="โชว์รูมรถมือสอง"
            fill
            priority
            className="h-full w-full object-cover"
          />
          <div className="via-black/88 absolute inset-0 bg-gradient-to-b from-black/90 to-black/80"></div>
        </div>

        <div className="container relative z-10 px-4">
          <div className="to-black/85 mx-auto max-w-5xl rounded-[32px] bg-gradient-to-b from-black/90 px-6 py-12 text-center text-white shadow-[0_32px_70px_rgba(0,0,0,0.6)] ring-1 ring-white/10 backdrop-blur-lg md:px-12 lg:py-14">
            <p className="wow fadeInUp text-shadow text-xs font-semibold uppercase tracking-[0.5em] text-primary/70 sm:text-sm md:text-base">
              ขายรถง่าย จบดีลไว
            </p>
            <div
              className="wow fadeInUp mt-4 flex flex-wrap items-center justify-center gap-6 text-[13px] font-medium text-white/70 sm:text-sm"
              data-wow-delay=".08s"
            >
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary"></span>
                เจ้าของรถกว่า 5,000 รายไว้วางใจ
              </span>
              <span className="hidden h-6 w-px bg-white/20 sm:block" />
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary"></span>
                ดีลเลอร์และองค์กรชั้นนำทั่วประเทศ
              </span>
            </div>
            <h1
              className="wow fadeInUp mt-4 text-2xl font-bold leading-tight text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.7)] md:text-4xl md:leading-tight lg:text-[48px] lg:leading-[58px]"
              data-wow-delay=".1s"
            >
              รับซื้อรถมือสองราคาสูง ทุกแบรนด์ ทุกสภาพ เอกสารครบ โอนจบใน 3
              ชั่วโมง
            </h1>
            <p
              className="wow fadeInUp mx-auto mt-5 max-w-3xl text-sm font-medium text-white/80 drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] sm:text-base sm:leading-relaxed md:text-lg"
              data-wow-delay=".15s"
            >
              V-Autocar รับซื้อรถตั้งแต่ 1 คันจนถึงหลายร้อยคัน
              ประเมินจากสภาพจริงโดยทีมตรวจสอบมืออาชีพ
              ชำระเงินและโอนกรรมสิทธิ์แบบโปร่งใส
              คุณจึงปล่อยรถได้อย่างมั่นใจและรวดเร็ว
            </p>

            <div
              className="wow fadeInUp mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
              data-wow-delay=".2s"
            >
              <a
                href="tel:062-564-6452"
                className="inline-flex w-full max-w-[260px] items-center justify-center rounded-full bg-[#0B63F3] px-8 py-4 text-base font-semibold text-white shadow-[0_18px_28px_rgba(11,99,243,0.35)] transition hover:bg-[#084bcc]"
              >
                <span className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.71875 0.75H5.46875C5.823 0.75 6.13214 0.977062 6.23175 1.31794L7.14831 4.53169C7.25738 4.91062 7.1015 5.31338 6.77194 5.52325L4.923 6.71025C6.06262 8.99619 8.00381 10.9374 10.2897 12.077L11.4767 10.2281C11.6866 9.8985 12.0894 9.74262 12.4683 9.85169L15.6821 10.7683C16.023 10.8679 16.25 11.177 16.25 11.5312V14.2812C16.25 14.6771 15.9271 15 15.5312 15C8.11469 15 2 8.88531 2 1.46875C2 1.07287 2.32288 0.75 2.71875 0.75Z"
                      fill="white"
                    />
                  </svg>
                </span>
                Phone Number
              </a>
              <a
                href="https://line.me/R/ti/p/@evv5077z"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full max-w-[260px] items-center justify-center rounded-full bg-[#00B900] px-8 py-4 text-base font-semibold text-white shadow-[0_18px_28px_rgba(0,185,0,0.35)] transition hover:bg-[#009700]"
              >
                <span className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.9997 2.75C6.44456 2.75 2.75 6.02666 2.75 10.0333C2.75 12.7161 4.27292 15.0723 6.56854 16.4144L5.95833 19.25L8.8924 17.4799C9.62016 17.6387 10.3112 17.7333 10.9997 17.7333C15.5549 17.7333 19.25 14.4566 19.25 10.45C19.25 6.44333 15.5549 2.75 10.9997 2.75Z"
                      fill="white"
                    />
                    <path
                      d="M11.3591 13.02H9.99141L7.64308 9.055V13.02H6.27541V7.48007H7.64308L10.0049 11.4584V7.48007H11.3591V13.02ZM12.5081 8.72807V7.48007H16.2567V8.72807H14.5771V13.02H13.2151V8.72807H12.5081Z"
                      fill="#00B900"
                    />
                  </svg>
                </span>
                Line
              </a>
            </div>

            <div
              className="wow fadeInUp mt-10 grid grid-cols-1 gap-4 text-left text-sm text-white/80 sm:grid-cols-3"
              data-wow-delay=".25s"
            >
              {[
                {
                  title: "ข้อเสนอภายใน 24 ชม.",
                  desc: "ส่งข้อมูลรถและรับตัวเลขราคาตรงจากทีมประเมินมืออาชีพทันที",
                },
                {
                  title: "ทีมภาคสนามทั่วประเทศ",
                  desc: "รองรับการตรวจรับรถหลายคันพร้อมกันในทุกภูมิภาค",
                },
                {
                  title: "เอกสารครบจบในครั้งเดียว",
                  desc: "เตรียมเอกสารให้พร้อม โอนกรรมสิทธิ์และรับเงินในวันนัดหมาย",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10"
                >
                  <span className="mt-1 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    {index === 0 ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M9 4.5V9L12 10.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : index === 1 ? (
                      <svg
                        width="20"
                        height="18"
                        viewBox="0 0 20 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 1.5L2 7.5V16.5H8V11.5H12V16.5H18V7.5L10 1.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 9.75L6.75 13.5L15 5.25"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-white/70 sm:text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="wow fadeInUp mt-10 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-white/60 sm:text-sm"
              data-wow-delay=".32s"
            >
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M4 7L6 9L10 5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                การันตีราคาตามตลาดจริง
              </span>
              <span className="bg-white/15 h-6 w-px" />
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.91667 2.33333H11.0833C11.5375 2.33333 11.9167 2.7125 11.9167 3.16667V11.8333L9.79167 10.5L7.66667 11.8333L5.54167 10.5L3.41667 11.8333V3.16667C3.41667 2.7125 3.79583 2.33333 4.25 2.33333H2.91667Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                ทีมดูแลคุณตั้งแต่ต้นจนจบ
              </span>
            </div>
          </div>
          {/* Banner Car */}
          {/* <div
            className="wow fadeInUp pointer-events-none relative mx-auto mt-14 h-[220px] max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-sm"
            data-wow-delay=".25s"
          >
            <Image
              src={getImagePath("/images/video/video.jpg")}
              alt="รถยนต์มือสองพร้อมส่งมอบ"
              fill
              className="h-full w-full object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          </div> */}
        </div>
      </section>
    </>
  );
};

export default Hero;
