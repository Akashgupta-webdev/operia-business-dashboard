import { useId, type ReactNode } from "react";
export function NetworkBackground({ children }: { children?: ReactNode }) {
 const id = useId();
 return <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" style={{ background: "#f8f9ff" }}>
 <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 12% 18%, #ddd8f060, transparent 32%), radial-gradient(ellipse at 18% 28%, #d0efed30, transparent 28%), radial-gradient(ellipse at 91% 63%, #ddd8fa60, transparent 30%), radial-gradient(ellipse at 88% 86%, #cdf0f040, transparent 30%)" }} />
 <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, #b7a4ef33 0.8px, transparent 0.8px)", backgroundSize: "26px 26px", maskImage: "radial-gradient(ellipse, transparent 15%, black 85%)" }} />
 <svg viewBox="0 0 1527 857" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" fill="none" focusable="false">
 <defs><radialGradient id={id}><stop stopColor="#f8f9ff"/><stop offset="1" stopColor="#f8f9ff" stopOpacity="0"/></radialGradient></defs>
 <g strokeWidth="1.2">
 <g stroke="#bba5f4" opacity="0.23">
 <path d="M104 0C190 208 263 167 390 222S530 341 624 400M192 152C286 164 346 161 416 176M1072 816C1184 701 1250 754 1385 684S1482 674 1558 638"/>
 <path d="M-30 144C130 127 242 216 393 181S551 198 640 219M840 656C941 606 1014 699 1136 656S1231 617 1344 642S1475 666 1550 660" strokeDasharray="3 4"/>
 </g><g stroke="#86d9dd" opacity="0.25">
 <path d="M48 336C169 301 282 391 416 307S564 298 672 224M864 800C960 673 1099 744 1232 666S1383 584 1504 496M1136 656C1207 632 1278 627 1344 608"/>
 </g><g stroke="#c4b3f1" opacity="0.12"><circle cx="80" cy="80" r="160"/><circle cx="1440" cy="784" r="255"/><path d="M1200-40C1260 92 1394 156 1540 171M-40 668C114 695 229 760 322 867" strokeDasharray="3 5"/></g></g>
 <ellipse cx="764" cy="420" rx="430" ry="330" fill={"url(#" + id + ")"}/>
 <g fill="#bba5f4" opacity="0.4"><circle cx="1344" cy="120" r="2.5"/><circle cx="1240" cy="632" r="2"/></g><g fill="#86d9dd" opacity="0.4"><circle cx="302" cy="164" r="1.8"/><circle cx="176" cy="728" r="2.5"/><circle cx="1424" cy="152" r="1.8"/></g>
 {children}</svg></div>;
}
export function NetworkMarker({ x, y, label, color, children, below = false }: { x: number; y: number; label: string; color: string; children: ReactNode; below?: boolean }) {
 return <g transform={"translate(" + x + " " + y + ")"} color={color} opacity="0.5">
 <circle r="20" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeOpacity="0.5"/><circle r="14" fill="white" stroke="currentColor" strokeOpacity="0.7"/>
 <svg x="-6" y="-6" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
 <text x={below ? 0 : 23} y={below ? 28 : 3} textAnchor={below ? "middle" : "start"} fill="currentColor" fontFamily="system-ui, sans-serif" fontSize="8" fontWeight="600" letterSpacing="0.35">{label}</text></g>;
}
