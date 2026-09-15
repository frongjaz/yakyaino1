"use client";

import { useState } from "react";

const keywords = [
  { group: "Brand / Generic", intent: "สูง", cpc: "25–45", keywords: ["เต็นท์รับซื้อรถ", "รับซื้อรถสด", "ขายรถด่วน", "ขายรถมือสอง"] },
  { group: "Location-Based", intent: "สูงมาก", cpc: "20–38", keywords: ["เต็นท์รับซื้อรถกรุงเทพ", "รับซื้อรถสมุทรปราการ", "รับซื้อรถนนทบุรี", "ขายรถแถวบางนา"] },
  { group: "Urgent Intent", intent: "สูงมาก", cpc: "30–55", keywords: ["ขายรถวันนี้", "ขายรถได้เงินสด", "รับซื้อรถทุกสภาพ", "รับซื้อรถติดไฟแนนซ์"] },
  { group: "Long-Tail", intent: "กลาง–สูง", cpc: "15–28", keywords: ["จะขายรถมือสองต้องทำอย่างไร", "ราคารับซื้อรถมือสอง", "ประเมินราคารถฟรี", "รับซื้อรถยนต์ญี่ปุ่น"] },
];

const campaigns = [
  {
    name: "Campaign 1: Brand + Generic",
    budget: "8,000",
    goal: "Awareness + Lead",
    match: "Exact / Phrase",
    color: "from-blue-500 to-blue-700",
    icon: "🎯",
  },
  {
    name: "Campaign 2: Location Targeting",
    budget: "10,000",
    goal: "Local Lead",
    match: "Phrase / Broad Match Modifier",
    color: "from-purple-500 to-purple-700",
    icon: "📍",
  },
  {
    name: "Campaign 3: Urgent / Intent",
    budget: "12,000",
    goal: "Conversion",
    match: "Exact Match",
    color: "from-orange-500 to-orange-700",
    icon: "⚡",
  },
  {
    name: "Campaign 4: Remarketing (GDN)",
    budget: "5,000",
    goal: "Re-engage",
    match: "Audience Segment",
    color: "from-green-500 to-green-700",
    icon: "🔄",
  },
];

const adCopies = [
  {
    headline: ["รับซื้อรถทุกยี่ห้อ ราคาดีที่สุด", "ประเมินฟรี! รู้ราคาทันที", "โทรเลย รับเงินสดวันเดียวกัน"],
    desc: ["เต็นท์รับซื้อรถมืออาชีพ บริการทั่วกรุงเทพฯ ประเมินราคาฟรีทุกคัน ไม่มีค่าใช้จ่าย", "ขายรถง่าย ได้เงินเร็ว ไม่ยุ่งยาก บริการรับรถถึงบ้าน โทรนัดได้เลยตอนนี้"],
    tag: "Ad Set A — สำหรับ Generic Keywords",
  },
  {
    headline: ["ขายรถวันนี้ ได้เงินสดวันนี้เลย", "ราคาสูงกว่าเต็นท์ทั่วไป", "รับทุกสภาพ ติดไฟแนนซ์ก็รับ"],
    desc: ["ไม่ต้องรอนาน ประเมินราคาภายใน 30 นาที บริการปิดเล่มทะเบียนให้ทันที", "รับซื้อรถทุกยี่ห้อ ทุกสภาพ แม้ติดไฟแนนซ์ยังค้างอยู่ ติดต่อเราได้ 24 ชม."],
    tag: "Ad Set B — สำหรับ Urgent Intent",
  },
];

const timeline = [
  { week: "สัปดาห์ 1–2", action: "Setup แคมเปญ, ตั้ง Conversion Tracking, เปิด Smart Bidding (Maximize Clicks)", status: "setup" },
  { week: "สัปดาห์ 3–4", action: "ปรับ Bid ตาม Performance, เพิ่ม Negative Keywords, A/B Test Ad Copy", status: "optimize" },
  { week: "เดือน 2", action: "เปิด Remarketing GDN, ขยาย Location, ทดสอบ PMAX Campaign", status: "scale" },
  { week: "เดือน 3+", action: "Review monthly, ลด CPA, เพิ่ม Budget ใน Ad Group ที่ ROI ดี", status: "growth" },
];

const kpis = [
  { metric: "CTR (Click-Through Rate)", target: "> 5%", note: "เฉลี่ย Industry รถ ~3–4%" },
  { metric: "CPC (Cost Per Click)", target: "20–45 บาท", note: "ขึ้นอยู่กับ Keyword Competition" },
  { metric: "Conversion Rate", target: "> 8%", note: "เป้าหมาย Lead Form / Call" },
  { metric: "Cost Per Lead (CPL)", target: "< 350 บาท", note: "ปรับตามงบประมาณ" },
  { metric: "Impression Share", target: "> 60%", note: "สำหรับ Brand Keywords" },
];

export default function AdsProposalPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
            Proposal — Google Ads Strategy 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            แผนยิง Google Ads<br />
            <span className="text-yellow-400">เต็นท์รับซื้อรถมือสอง</span>
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            กลยุทธ์แบบครบวงจรสำหรับธุรกิจรับซื้อรถ ตั้งแต่ Keyword Research จนถึง Conversion Optimization
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {[
              { label: "งบประมาณแนะนำ", value: "35,000 ฿/เดือน" },
              { label: "เป้าหมาย Lead", value: "100+ Leads/เดือน" },
              { label: "CPL เป้าหมาย", value: "< 350 ฿" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-center min-w-[150px]">
                <div className="text-2xl font-bold text-yellow-300">{s.value}</div>
                <div className="text-blue-200 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">

        {/* Insight */}
        <section>
          <SectionHeader icon="🔍" title="Insight: พฤติกรรมการค้นหาของลูกค้า" />
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {[
              { icon: "📱", title: "Mobile First", desc: "กว่า 78% ค้นหาจากมือถือ — ต้องมีปุ่มโทรหาได้ทันที (Call Extension)" },
              { icon: "🌙", title: "Peak Hour: เย็น–ค่ำ", desc: "Traffic สูงสุดช่วง 17:00–21:00 น. ควรเพิ่ม Bid Adjustment ในช่วงนี้" },
              { icon: "📍", title: "Local Intent สูง", desc: "ลูกค้ามักค้นหาพร้อมชื่อจังหวัด/อำเภอ ต้องใช้ Location Extension" },
            ].map((c) => (
              <div key={c.title} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="text-3xl mb-3">{c.icon}</div>
                <div className="font-semibold text-gray-800">{c.title}</div>
                <p className="text-gray-500 text-sm mt-1">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Keyword Table */}
        <section>
          <SectionHeader icon="🗝️" title="Keyword Strategy — 4 กลุ่มหลัก" />
          <div className="mt-4 space-y-4">
            {keywords.map((g) => (
              <div key={g.group} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="font-semibold text-gray-800">{g.group}</span>
                  <Badge color="blue">Intent: {g.intent}</Badge>
                  <Badge color="green">CPC: {g.cpc} ฿</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.keywords.map((kw) => (
                    <span key={kw} className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
            <strong>Negative Keywords แนะนำ:</strong> ซื้อรถ, เช่ารถ, ราคารถใหม่, อะไหล่รถ, ซ่อมรถ — เพื่อกรอง Traffic ที่ไม่ตรงเป้า
          </div>
        </section>

        {/* Campaigns */}
        <section>
          <SectionHeader icon="📋" title="โครงสร้างแคมเปญ (Campaign Structure)" />
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {campaigns.map((c) => (
              <div key={c.name} className={`rounded-2xl p-5 text-white bg-gradient-to-br ${c.color} shadow-md`}>
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="font-bold text-lg">{c.name}</div>
                <div className="text-white/80 text-sm mt-2 space-y-1">
                  <div>งบ: <span className="text-white font-semibold">{c.budget} ฿/เดือน</span></div>
                  <div>เป้าหมาย: {c.goal}</div>
                  <div>Match Type: {c.match}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ad Copy */}
        <section>
          <SectionHeader icon="✍️" title="ตัวอย่าง Ad Copy (Responsive Search Ads)" />
          <div className="space-y-6 mt-4">
            {adCopies.map((ad, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wide">{ad.tag}</div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="text-xs text-gray-400 mb-1">Ad · www.yourdomain.co.th</div>
                  <div className="space-y-0.5">
                    {ad.headline.map((h, j) => (
                      <div key={j} className="text-blue-700 font-medium text-sm">
                        {h}{j < ad.headline.length - 1 && <span className="text-gray-300 mx-1">|</span>}
                      </div>
                    ))}
                  </div>
                  {ad.desc.map((d, j) => (
                    <p key={j} className="text-gray-600 text-xs mt-2">{d}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Extensions */}
        <section>
          <SectionHeader icon="🔗" title="Ad Extensions ที่ต้องใช้" />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            {[
              { name: "Call Extension", desc: "ปุ่มโทรตรงจาก Ad — Critical สำหรับ Mobile" },
              { name: "Location Extension", desc: "แสดงที่ตั้งเต็นท์ + Google Maps" },
              { name: "Sitelink Extension", desc: "ลิงก์ไป: ประเมินราคา, วิธีขายรถ, ติดต่อ" },
              { name: "Callout Extension", desc: '"รับเงินสดทันที" | "ฟรีค่าโอน" | "บริการถึงบ้าน"' },
              { name: "Lead Form Extension", desc: "กรอกฟอร์มส่งข้อมูลรถได้จาก Ad เลย" },
              { name: "Price Extension", desc: "แสดงราคารับซื้อรถแต่ละประเภทเบื้องต้น" },
            ].map((e) => (
              <div key={e.name} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="font-semibold text-gray-800 text-sm">{e.name}</div>
                <p className="text-gray-500 text-xs mt-1">{e.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <SectionHeader icon="🗓️" title="Timeline การดำเนินงาน" />
          <div className="mt-4 space-y-3">
            {timeline.map((t, i) => (
              <div key={i} className="flex gap-4 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="w-28 shrink-0">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    t.status === "setup" ? "bg-blue-100 text-blue-700" :
                    t.status === "optimize" ? "bg-yellow-100 text-yellow-700" :
                    t.status === "scale" ? "bg-purple-100 text-purple-700" :
                    "bg-green-100 text-green-700"
                  }`}>{t.week}</span>
                </div>
                <p className="text-gray-700 text-sm">{t.action}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Budget Breakdown */}
        <section>
          <SectionHeader icon="💰" title="สรุปงบประมาณ (เดือนละ)" />
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mt-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 text-gray-600 font-semibold">รายการ</th>
                  <th className="text-right px-5 py-3 text-gray-600 font-semibold">งบ (฿/เดือน)</th>
                  <th className="text-right px-5 py-3 text-gray-600 font-semibold">% ของงบ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { item: "Campaign 1: Brand + Generic", budget: "8,000", pct: "23%" },
                  { item: "Campaign 2: Location Targeting", budget: "10,000", pct: "29%" },
                  { item: "Campaign 3: Urgent / Intent", budget: "12,000", pct: "34%" },
                  { item: "Campaign 4: Remarketing GDN", budget: "5,000", pct: "14%" },
                ].map((r) => (
                  <tr key={r.item} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-gray-700">{r.item}</td>
                    <td className="px-5 py-3 text-right font-medium text-gray-800">{r.budget} ฿</td>
                    <td className="px-5 py-3 text-right text-gray-500">{r.pct}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-bold">
                  <td className="px-5 py-3 text-blue-800">รวมทั้งหมด</td>
                  <td className="px-5 py-3 text-right text-blue-800">35,000 ฿</td>
                  <td className="px-5 py-3 text-right text-blue-600">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-gray-400 text-xs mt-2 px-1">* ไม่รวมค่า Management Fee | ปรับงบได้ตามความเหมาะสม</p>
        </section>

        {/* KPIs */}
        <section>
          <SectionHeader icon="📊" title="KPI เป้าหมาย (เดือนที่ 1–3)" />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            {kpis.map((k) => (
              <div key={k.metric} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <div className="text-xs text-gray-400 uppercase tracking-wide">{k.metric}</div>
                <div className="text-xl font-bold text-blue-700 mt-1">{k.target}</div>
                <p className="text-gray-400 text-xs mt-1">{k.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Landing Page Tips */}
        <section>
          <SectionHeader icon="🖥️" title="Landing Page ที่ดี — ต้องมีสิ่งเหล่านี้" />
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            {[
              { icon: "📞", title: "เบอร์โทรชัดเจน", desc: "ด้านบนสุดของหน้า คลิกโทรได้บนมือถือ" },
              { icon: "📝", title: "ฟอร์มกรอกข้อมูลรถ", desc: "ยี่ห้อ, รุ่น, ปี, เลขไมล์ — ไม่เกิน 5 ช่อง" },
              { icon: "⭐", title: "Social Proof", desc: "รีวิวจากลูกค้า, จำนวนรถที่รับซื้อแล้ว" },
              { icon: "⏱️", title: "ความเร็วหน้าเว็บ", desc: "< 3 วินาที บนมือถือ — ใช้ PageSpeed ตรวจสอบ" },
              { icon: "🔒", title: "Trust Signals", desc: "โลโก้บริษัท, ใบอนุญาต, ที่อยู่จริง" },
              { icon: "🎯", title: "CTA ชัดเจน", desc: '"ประเมินราคารถฟรี" ปุ่มสีโดดเด่น' },
            ].map((l) => (
              <div key={l.title} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex gap-3">
                <div className="text-2xl">{l.icon}</div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">{l.title}</div>
                  <p className="text-gray-500 text-xs mt-0.5">{l.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Footer */}
        <section className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 text-white text-center">
          <div className="text-3xl mb-3">🚀</div>
          <h2 className="text-2xl font-bold mb-2">พร้อมเริ่มแคมเปญแรกของคุณ?</h2>
          <p className="text-blue-200 mb-6 max-w-lg mx-auto">
            เราพร้อม Setup แคมเปญและติดตาม Performance ให้คุณทุกขั้นตอน ตั้งแต่ Keyword Research จนถึง Optimization
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="tel:+66000000000"
              className="bg-yellow-400 text-blue-900 font-bold px-6 py-3 rounded-full hover:bg-yellow-300 transition-colors"
            >
              โทรนัดปรึกษาฟรี
            </a>
            <a
              href="mailto:info@example.com"
              className="bg-white/10 border border-white/30 text-white px-6 py-3 rounded-full hover:bg-white/20 transition-colors"
            >
              ส่ง Email หาเรา
            </a>
          </div>
          <p className="text-blue-300 text-xs mt-6">
            Proposal จัดทำโดย CheckKub Team · {new Date().getFullYear()}
          </p>
        </section>

      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xl">{icon}</span>
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: "blue" | "green" | "orange" }) {
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[color]}`}>
      {children}
    </span>
  );
}
