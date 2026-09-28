"use client";
import { useState, useRef, useEffect } from "react";
import { getApiUrl } from "@/lib/api";
import { trackLeadFormSubmit } from "@/lib/gtag";

const BRANDS = [
  "Toyota","Honda","Mazda","Isuzu","Ford","Mitsubishi","Nissan","Suzuki",
  "BMW","Mercedes-Benz","Audi","Volkswagen","MG","BYD","GWM / Haval",
  "Kia","Hyundai","Subaru","Volvo","Lexus","อื่นๆ",
];

const PROVINCES = [
  "กรุงเทพมหานคร","กระบี่","กาญจนบุรี","กาฬสินธุ์","กำแพงเพชร","ขอนแก่น",
  "จันทบุรี","ฉะเชิงเทรา","ชลบุรี","ชัยนาท","ชัยภูมิ","ชุมพร",
  "เชียงราย","เชียงใหม่","ตรัง","ตราด","ตาก","นครนายก","นครปฐม",
  "นครพนม","นครราชสีมา","นครศรีธรรมราช","นครสวรรค์","นนทบุรี",
  "นราธิวาส","น่าน","บึงกาฬ","บุรีรัมย์","ปทุมธานี","ประจวบคีรีขันธ์",
  "ปราจีนบุรี","ปัตตานี","พระนครศรีอยุธยา","พะเยา","พังงา","พัทลุง",
  "พิจิตร","พิษณุโลก","เพชรบุรี","เพชรบูรณ์","แพร่","ภูเก็ต",
  "มหาสารคาม","มุกดาหาร","แม่ฮ่องสอน","ยโสธร","ยะลา","ร้อยเอ็ด",
  "ระนอง","ระยอง","ราชบุรี","ลพบุรี","ลำปาง","ลำพูน","เลย",
  "ศรีสะเกษ","สกลนคร","สงขลา","สตูล","สมุทรปราการ","สมุทรสงคราม",
  "สมุทรสาคร","สระแก้ว","สระบุรี","สิงห์บุรี","สุโขทัย","สุพรรณบุรี",
  "สุราษฎร์ธานี","สุรินทร์","หนองคาย","หนองบัวลำภู","อ่างทอง",
  "อำนาจเจริญ","อุดรธานี","อุตรดิตถ์","อุทัยธานี","อุบลราชธานี",
];

const NOW = new Date().getFullYear();
const YEARS = Array.from({ length: NOW - 1999 }, (_, i) => String(NOW - i));

type Status = "idle" | "submitting" | "success" | "error";

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-700">
      {label}{required && <span className="ml-0.5 text-[#EF4444]">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-[#EF4444] focus:bg-white focus:ring-2 focus:ring-[#EF4444]/20";

function CustomSelect({ value, onChange, options, placeholder, searchable = false }: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false); setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && searchable) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open, searchable]);

  const filtered = searchable && search
    ? options.filter(o => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  const pick = (v: string) => { onChange(v); setOpen(false); setSearch(""); };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-base text-left transition
          ${value ? "text-gray-900" : "text-gray-400"}
          ${open ? "border-[#EF4444] bg-white ring-2 ring-[#EF4444]/20" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}
      >
        <span className="truncate">{value || placeholder}</span>
        <svg className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ค้นหา..."
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]/20"
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto overscroll-contain">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-400 text-center">ไม่พบข้อมูล</p>
            ) : filtered.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => pick(opt)}
                className={`w-full px-4 py-3 text-left text-sm transition-colors
                  ${opt === value
                    ? "bg-red-50 text-[#EF4444] font-semibold"
                    : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeadForm() {
  const [form, setForm] = useState({ brand: "", model: "", year: "", mileage: "", province: "", phone: "", asking_price: "" });
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));
  const setField = (key: string) => (v: string) =>
    setForm(prev => ({ ...prev, [key]: v }));

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhoto(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { brand, model, year, province, phone } = form;
    if (!brand || !model || !year || !province || !phone) {
      setErrorMsg("กรุณากรอกข้อมูลที่มีเครื่องหมาย * ให้ครบ");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setErrorMsg("");
    const fd = new FormData();
    (Object.entries(form) as [string, string][]).forEach(([k, v]) => fd.append(k, v));
    if (photo) fd.append("photo", photo);
    try {
      const res = await fetch(getApiUrl("api/lead.php"), { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        trackLeadFormSubmit();
      } else {
        setErrorMsg(data.message || "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
        setStatus("error");
      }
    } catch {
      setErrorMsg("ไม่สามารถส่งข้อมูลได้ กรุณาลองอีกครั้ง");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        {/* Success icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">ส่งข้อมูลสำเร็จ!</h3>
          <p className="mt-1 text-sm text-gray-500">ทีมงานได้รับข้อมูลของคุณแล้ว</p>
        </div>

        {/* LINE hook card */}
        <div className="w-full rounded-2xl bg-gradient-to-br from-[#06C755] to-[#05a847] p-5 shadow-lg shadow-green-200">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-green-100">รับราคาเร็วกว่า 3 เท่า</p>
          <p className="mb-1 text-lg font-bold text-white">เพิ่มเพื่อน LINE เพื่อรับราคาทันที</p>
          <p className="mb-4 text-sm text-green-100">ทีมเราจะทักกลับใน LINE ของคุณทันที<br />ไม่ต้องรอ SMS หรือโทรกลับ</p>
          <a
            href="https://line.me/ti/p/@checkkub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3.5 text-base font-bold text-[#06C755] shadow-md transition hover:scale-[1.02] hover:shadow-lg active:scale-100"
          >
            <svg viewBox="0 0 24 24" fill="#06C755" className="h-6 w-6 shrink-0">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.41-.097-.54-.271l-2.396-3.27v2.914c0 .345-.282.629-.631.629-.345 0-.627-.284-.627-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .4.099.528.271l2.397 3.27V8.108c0-.345.282-.63.628-.63.349 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.631-.63.345 0 .627.285.627.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            เพิ่มเพื่อน @checkkub ใน LINE
          </a>
        </div>

        <button
          onClick={() => { setForm({ brand:"",model:"",year:"",mileage:"",province:"",phone:"",asking_price:"" }); setPhoto(null); setPreview(null); setStatus("idle"); }}
          className="text-sm text-gray-400 underline underline-offset-2 hover:text-gray-600 transition"
        >
          ส่งข้อมูลรถคันอื่น
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {/* Row 1: brand + year */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="ยี่ห้อรถ" required>
          <CustomSelect value={form.brand} onChange={setField("brand")} options={BRANDS} placeholder="เลือกยี่ห้อ" />
        </Field>
        <Field label="ปีรถ" required>
          <CustomSelect value={form.year} onChange={setField("year")} options={YEARS} placeholder="เลือกปี" />
        </Field>
      </div>

      {/* Row 2: model */}
      <Field label="รุ่นรถ" required>
        <input name="model" value={form.model} onChange={set("model")} placeholder="เช่น Yaris Ativ, Hilux Revo" className={inputCls} />
      </Field>

      {/* Row 3: mileage + province */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="เลขไมล์ (กม.)">
          <input name="mileage" value={form.mileage} onChange={set("mileage")} type="number" min="0" placeholder="เช่น 80000" className={inputCls} />
        </Field>
        <Field label="จังหวัด" required>
          <CustomSelect value={form.province} onChange={setField("province")} options={PROVINCES} placeholder="เลือกจังหวัด" searchable />
        </Field>
      </div>

      {/* Row 4: phone */}
      <Field label="เบอร์โทรศัพท์" required>
        <input name="phone" value={form.phone} onChange={set("phone")} type="tel" placeholder="08x-xxx-xxxx" className={inputCls} />
      </Field>

      {/* Row 5: asking price */}
      <Field label="ราคาที่ต้องการขาย (บาท)">
        <input name="asking_price" value={form.asking_price} onChange={set("asking_price")} type="number" min="0" placeholder="เช่น 350000" className={inputCls} />
      </Field>

      {/* Photo upload */}
      <div>
        <p className="mb-1.5 text-sm font-medium text-gray-700">รูปรถ <span className="text-gray-400 font-normal">(ไม่บังคับ — ช่วยให้ประเมินได้แม่นยำขึ้น)</span></p>
        <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} className="hidden" />
        {preview ? (
          <div className="relative w-full overflow-hidden rounded-xl border border-gray-200">
            <img src={preview} alt="preview" className="h-36 w-full object-cover" />
            <button type="button" onClick={() => { setPhoto(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-4 text-sm text-gray-400 transition hover:border-[#EF4444] hover:text-[#EF4444]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
            แนบรูปรถ
          </button>
        )}
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#EF4444] py-4 text-base font-bold text-white shadow-lg shadow-red-500/25 transition hover:bg-[#DC2626] hover:shadow-red-500/40 disabled:opacity-60"
      >
        {status === "submitting" ? (
          <>
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            กำลังส่งข้อมูล...
          </>
        ) : "ขอประเมินราคาฟรี"}
      </button>

      <p className="text-center text-xs text-gray-400">
        รับราคาประเมินภายใน 5 นาที · ไม่มีค่าใช้จ่าย
      </p>
    </form>
  );
}
