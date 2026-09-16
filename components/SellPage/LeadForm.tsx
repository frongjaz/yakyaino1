"use client";
import { useState, useRef } from "react";
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

const inputCls = "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#EF4444] focus:bg-white focus:ring-2 focus:ring-[#EF4444]/20 appearance-none";

export default function LeadForm() {
  const [form, setForm] = useState({ brand: "", model: "", year: "", mileage: "", province: "", phone: "", asking_price: "" });
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

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
        // Send LINE notification via Vercel (fire-and-forget)
        fetch("https://yakyaino1.vercel.app/api/notify-line", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: data.id, ...form }),
        }).catch(() => {});
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
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">ส่งข้อมูลสำเร็จ!</h3>
        <p className="max-w-xs text-sm text-gray-500">
          ทีมงานจะแจ้งราคาประเมิน<br />ภายใน 5 นาที
        </p>
        <button
          onClick={() => { setForm({ brand:"",model:"",year:"",mileage:"",province:"",phone:"",asking_price:"" }); setPhoto(null); setPreview(null); setStatus("idle"); }}
          className="mt-2 rounded-full border border-gray-200 px-6 py-2 text-sm text-gray-600 hover:border-[#EF4444] hover:text-[#EF4444] transition"
        >
          ส่งข้อมูลรถคันอื่น
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      {/* Row 1: brand + year */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="ยี่ห้อรถ" required>
          <select name="brand" value={form.brand} onChange={set("brand")} className={inputCls}>
            <option value="">เลือกยี่ห้อ</option>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>
        <Field label="ปีรถ" required>
          <select name="year" value={form.year} onChange={set("year")} className={inputCls}>
            <option value="">เลือกปี</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </Field>
      </div>

      {/* Row 2: model */}
      <Field label="รุ่นรถ" required>
        <input name="model" value={form.model} onChange={set("model")} placeholder="เช่น Yaris Ativ, Hilux Revo" className={inputCls} />
      </Field>

      {/* Row 3: mileage + province */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="เลขไมล์ (กม.)">
          <input name="mileage" value={form.mileage} onChange={set("mileage")} type="number" min="0" placeholder="เช่น 80000" className={inputCls} />
        </Field>
        <Field label="จังหวัด" required>
          <select name="province" value={form.province} onChange={set("province")} className={inputCls}>
            <option value="">เลือกจังหวัด</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
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
