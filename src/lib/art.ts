import type { ArtType } from '../types'

/**
 * Illustrated product "photos" drawn as SVG. They stand in for real product photos
 * until sellers upload their own; any product with an `image` URL skips them.
 */
interface Kit { id: string; M: string; base: string; dark: string; light: string; gold: string; metal: string }

let uid = 0
const range = (n: number) => Array.from({ length: n }, (_, i) => i)

const DRAW: Record<ArtType | "box", (K: Kit) => string> = {
  bag:(K: Kit) =>`<path d="M150 172 Q150 108 200 108 Q250 108 250 172" fill="none" stroke="${K.dark}" stroke-width="12" stroke-linecap="round"/>
    <path d="M118 175 H282 Q294 175 291 189 L278 292 Q276 304 263 304 H137 Q124 304 122 292 L109 189 Q106 175 118 175Z" fill="${K.M}"/>
    <path d="M110 186 H290 L282 226 Q200 252 118 226Z" fill="${K.dark}" opacity=".32"/>
    <rect x="187" y="223" width="26" height="20" rx="5" fill="${K.gold}"/>
    <path d="M132 290 Q200 297 268 290" stroke="#fff" stroke-opacity=".35" stroke-width="2.5" fill="none" stroke-dasharray="5 6"/>
    <path d="M128 196 L140 290" stroke="#fff" stroke-opacity=".18" stroke-width="10" stroke-linecap="round"/>`,
  babouche:(K: Kit) =>`<path d="M60 278 Q58 260 86 256 L262 246 Q320 242 344 272 Q348 284 330 286 L86 292 Q60 292 60 278Z" fill="${K.dark}"/>
    <path d="M92 262 Q92 214 152 206 Q230 198 302 240 Q328 254 340 270 L262 258 Q180 264 92 268Z" fill="${K.M}"/>
    <path d="M94 262 Q102 238 130 234 Q148 248 152 264Z" fill="${K.dark}" opacity=".55"/>
    <path d="M176 214 Q224 222 262 244" stroke="${K.gold}" stroke-width="5" fill="none" stroke-dasharray="2 8" stroke-linecap="round"/>
    <circle cx="230" cy="236" r="7" fill="${K.gold}"/><circle cx="212" cy="226" r="4" fill="${K.gold}"/><circle cx="248" cy="246" r="4" fill="${K.gold}"/>`,
  caftan:(K: Kit) =>`<path d="M170 90 Q200 106 230 90 L270 104 Q302 118 320 172 L300 186 L276 152 L294 322 Q200 338 106 322 L124 152 L100 186 L80 172 Q98 118 130 104Z" fill="${K.M}"/>
    <path d="M170 90 Q200 132 230 90" fill="${K.dark}" opacity=".5"/>
    <path d="M200 112 V330" stroke="${K.gold}" stroke-width="7"/>
    ${[130,154,178,202,226,250,274,298].map(y=>`<circle cx="200" cy="${y}" r="5" fill="${K.gold}"/><circle cx="200" cy="${y}" r="2" fill="${K.dark}"/>`).join('')}
    <path d="M106 316 Q200 332 294 316" stroke="${K.gold}" stroke-width="4" fill="none"/>
    <path d="M300 186 L322 176 M80 172 L100 186" stroke="${K.gold}" stroke-width="4"/>`,
  textile:(K: Kit) =>`<rect x="92" y="244" width="226" height="56" rx="14" fill="${K.dark}"/>
    <rect x="84" y="196" width="226" height="56" rx="14" fill="${K.base}"/>
    <rect x="96" y="148" width="226" height="56" rx="14" fill="${K.light}"/>
    ${[0,1,2].map(i=>`<path d="M${110+i*0} ${170+i*48} H${300}" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-dasharray="${i===1?'14 6':'3 7'}" transform="translate(${i===1?-10:0} 0)"/>`).join('')}
    <path d="M110 182 H306 M100 230 H296 M108 278 H304" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>
    ${range(7).map((i)=>`<path d="M322 ${156+i*7} l14 2" stroke="${K.light}" stroke-width="3" stroke-linecap="round"/>`).join('')}`,
  earrings:(K: Kit) =>[146,254].map(x=>`<circle cx="${x}" cy="104" r="9" fill="${K.gold}"/><path d="M${x} 113 v26" stroke="${K.gold}" stroke-width="4"/>
    <path d="M${x} 139 c-38 0 -54 54 -38 94 q38 46 76 0 c16-40 0-94-38-94z" fill="none" stroke="${K.gold}" stroke-width="9"/>
    <circle cx="${x}" cy="206" r="19" fill="${K.M}"/><circle cx="${x-6}" cy="200" r="5" fill="#fff" opacity=".6"/>
    <path d="M${x-30} 252 l9 22 M${x} 264 v24 M${x+30} 252 l-9 22" stroke="${K.gold}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="${x-21}" cy="276" r="6" fill="${K.base}"/><circle cx="${x}" cy="292" r="6" fill="${K.base}"/><circle cx="${x+21}" cy="276" r="6" fill="${K.base}"/>`).join(''),
  sunglasses:(K: Kit) =>`<path d="M62 190 H338" stroke="${K.dark}" stroke-width="12" stroke-linecap="round"/>
    <path d="M70 188 H186 Q190 188 188 202 Q182 266 128 266 Q78 266 70 207 Q68 188 70 188Z" fill="${K.M}"/>
    <path d="M214 188 H330 Q332 188 330 207 Q322 266 272 266 Q218 266 212 202 Q210 188 214 188Z" fill="${K.M}"/>
    <path d="M186 198 Q200 184 214 198" stroke="${K.dark}" stroke-width="8" fill="none"/>
    <path d="M92 204 L132 248 M236 204 L276 248" stroke="#fff" stroke-opacity=".45" stroke-width="10" stroke-linecap="round"/>
    <path d="M62 190 L40 206 M338 190 L360 206" stroke="${K.dark}" stroke-width="8" stroke-linecap="round"/>`,
  watch:(K: Kit) =>`<path d="M170 64 h60 l-6 88 h-48z" fill="${K.M}"/><path d="M176 258 h48 l6 90 h-60z" fill="${K.M}"/>
    <circle cx="200" cy="205" r="68" fill="${K.gold}"/><circle cx="200" cy="205" r="56" fill="#FBF6EA"/>
    ${range(12).map((i)=>{const a=i*Math.PI/6;return `<path d="M${200+Math.sin(a)*46} ${205-Math.cos(a)*46} L${200+Math.sin(a)*(i%3?50:52)} ${205-Math.cos(a)*(i%3?50:52)}" stroke="#4a3b22" stroke-width="${i%3?2:4}" stroke-linecap="round"/>`}).join('')}
    <path d="M200 205 L200 168 M200 205 L226 218" stroke="#2a2014" stroke-width="5" stroke-linecap="round"/><circle cx="200" cy="205" r="5" fill="${K.dark}"/>
    <rect x="266" y="196" width="14" height="18" rx="3" fill="${K.gold}"/>`,
  smartwatch:(K: Kit) =>`<rect x="168" y="62" width="64" height="110" rx="14" fill="${K.M}"/><rect x="168" y="236" width="64" height="110" rx="14" fill="${K.M}"/>
    <rect x="144" y="134" width="112" height="140" rx="34" fill="#2A2D35"/><rect x="154" y="144" width="92" height="120" rx="26" fill="#0C0E13"/>
    <circle cx="200" cy="204" r="34" fill="none" stroke="${K.light}" stroke-width="8" stroke-dasharray="150 220" stroke-linecap="round" transform="rotate(-90 200 204)"/>
    <circle cx="200" cy="204" r="22" fill="none" stroke="${K.base}" stroke-width="7" stroke-dasharray="90 200" stroke-linecap="round" transform="rotate(-90 200 204)"/>
    <rect x="256" y="178" width="9" height="28" rx="4" fill="#4A4E58"/>`,
  phone:(K: Kit) =>`<rect x="138" y="76" width="124" height="252" rx="26" fill="#1C1E25"/><rect x="146" y="84" width="108" height="236" rx="20" fill="${K.M}"/>
    <rect x="182" y="94" width="36" height="10" rx="5" fill="#1C1E25"/>
    <path d="M146 250 Q200 200 254 230 V300 Q254 320 234 320 H166 Q146 320 146 300Z" fill="${K.dark}" opacity=".45"/>
    <path d="M160 110 L190 300" stroke="#fff" stroke-opacity=".18" stroke-width="16"/>
    <circle cx="200" cy="180" r="26" fill="#fff" fill-opacity=".22"/>`,
  phonecase:(K: Kit) =>`<rect x="138" y="76" width="124" height="252" rx="28" fill="${K.M}"/>
    <rect x="152" y="92" width="52" height="58" rx="14" fill="#1C1E25"/><circle cx="168" cy="108" r="9" fill="#3A3F4B"/><circle cx="188" cy="132" r="9" fill="#3A3F4B"/><circle cx="168" cy="132" r="5" fill="#3A3F4B"/>
    ${[0,1,2].map(r=>[0,1].map(c=>`<path transform="translate(${178+c*44} ${190+r*44})" d="M0 -16 l5 11 11 5 -11 5 -5 11 -5 -11 -11 -5 11 -5z" fill="#fff" fill-opacity=".5"/>`).join('')).join('')}`,
  headphones:(K: Kit) =>`<path d="M118 236 Q116 108 200 108 Q284 108 282 236" fill="none" stroke="${K.dark}" stroke-width="18" stroke-linecap="round"/>
    <rect x="92" y="200" width="60" height="104" rx="28" fill="${K.M}"/><rect x="248" y="200" width="60" height="104" rx="28" fill="${K.M}"/>
    <rect x="136" y="214" width="18" height="76" rx="9" fill="${K.dark}"/><rect x="246" y="214" width="18" height="76" rx="9" fill="${K.dark}"/>
    <path d="M106 222 v56 M294 222 v56" stroke="#fff" stroke-opacity=".35" stroke-width="6" stroke-linecap="round"/>`,
  speaker:(K: Kit) =>`<rect x="132" y="92" width="136" height="234" rx="60" fill="${K.M}"/><rect x="148" y="124" width="104" height="172" rx="46" fill="${K.dark}" opacity=".45"/>
    ${range(9).map((r)=>range(5).map((c)=>`<circle cx="${168+c*16}" cy="${142+r*17}" r="3.5" fill="#fff" fill-opacity=".35"/>`).join('')).join('')}
    <rect x="178" y="102" width="44" height="10" rx="5" fill="#fff" fill-opacity=".5"/>`,
  teapot:(K: Kit) =>`<path d="M146 224 Q100 212 84 158 L97 153 Q114 196 152 252Z" fill="${K.metal}"/>
    <path d="M258 206 Q312 208 302 252 Q294 288 262 282" fill="none" stroke="#9AA0AC" stroke-width="13" stroke-linecap="round"/>
    <path d="M140 204 Q128 302 200 306 Q272 302 260 204 Q240 184 200 184 Q160 184 140 204Z" fill="${K.metal}"/>
    <path d="M160 186 Q200 128 240 186Z" fill="${K.metal}"/><circle cx="200" cy="134" r="11" fill="${K.metal}"/><path d="M200 110 l7 14 h-14z" fill="#A9AFBA"/>
    <rect x="166" y="302" width="68" height="14" rx="5" fill="#9AA0AC"/>
    <path d="M148 238 Q200 262 252 238" stroke="${K.base}" stroke-width="4" fill="none"/>
    <path d="M150 256 Q200 280 250 256" stroke="${K.base}" stroke-width="2" fill="none" stroke-dasharray="3 5"/>
    <path d="M160 214 Q156 260 174 290" stroke="#fff" stroke-opacity=".7" stroke-width="7" fill="none" stroke-linecap="round"/>`,
  teaglass:(K: Kit) =>[128,200,272].map((x,i)=>`<g transform="translate(${x} ${i===1?-6:12})"><path d="M-36 146 L36 146 L27 292 Q0 300 -27 292Z" fill="${K.base}" fill-opacity=".5"/>
    <path d="M-36 146 L36 146 L33.5 186 L-33.5 186Z" fill="${K.gold}"/><path d="M-33 160 H33" stroke="${K.dark}" stroke-width="3" stroke-dasharray="4 4"/>
    <path d="M-31 206 L31 206 L29.5 236 L-29.5 236Z" fill="${K.dark}" fill-opacity=".55"/>
    <path d="M-22 156 L-15 284" stroke="#fff" stroke-opacity=".55" stroke-width="5" stroke-linecap="round"/></g>`).join(''),
  tajine:(K: Kit) =>`<path d="M68 282 Q200 322 332 282 L322 300 Q200 336 78 300Z" fill="${K.dark}"/>
    <path d="M86 284 Q160 254 188 122 Q200 98 212 122 Q240 254 314 284Z" fill="${K.M}"/>
    <circle cx="200" cy="112" r="13" fill="${K.dark}"/>
    <path d="M118 270 Q200 248 282 270" stroke="#fff" stroke-opacity=".8" stroke-width="4" fill="none"/>
    <path d="M140 236 Q200 220 260 236" stroke="${K.gold}" stroke-width="4" fill="none" stroke-dasharray="6 6"/>
    <path d="M164 190 Q200 180 236 190" stroke="#fff" stroke-opacity=".7" stroke-width="3" fill="none"/>
    <path d="M174 160 L150 270" stroke="#fff" stroke-opacity=".2" stroke-width="12" stroke-linecap="round"/>`,
  plate:(K: Kit) =>`<circle cx="200" cy="206" r="134" fill="#FBF8F1"/><circle cx="200" cy="206" r="134" fill="none" stroke="${K.dark}" stroke-width="5"/>
    <circle cx="200" cy="206" r="118" fill="none" stroke="${K.base}" stroke-width="3"/>
    ${range(16).map((i)=>{const a=i*Math.PI/8;return `<circle cx="${200+Math.cos(a)*100}" cy="${206+Math.sin(a)*100}" r="7" fill="${i%2?K.light:K.base}"/>`}).join('')}
    <circle cx="200" cy="206" r="76" fill="none" stroke="${K.dark}" stroke-width="10" stroke-dasharray="14 9"/>
    <path transform="translate(200 206)" d="M0 -52 L14 -14 52 0 14 14 0 52 -14 14 -52 0 -14 -14Z" fill="${K.M}"/>
    <path transform="translate(200 206) rotate(45)" d="M0 -40 L10 -10 40 0 10 10 0 40 -10 10 -40 0 -10 -10Z" fill="${K.dark}" opacity=".6"/>
    <circle cx="200" cy="206" r="8" fill="${K.gold}"/>`,
  basket:(K: Kit) =>`<path d="M146 192 Q150 126 200 126 Q250 126 254 192" fill="none" stroke="#9B6F35" stroke-width="10"/>
    <path d="M108 190 H292 L274 310 Q200 328 126 310Z" fill="#C99A5B"/>
    ${[210,232,254,276,298].map(y=>`<path d="M${108+(y-190)*.15} ${y} H${292-(y-190)*.15}" stroke="#A47838" stroke-width="5"/>`).join('')}
    ${[130,160,190,220,250,280].map(x=>`<path d="M${x} 192 L${x+ (200-x)*.08} 316" stroke="#B8894B" stroke-width="2.5"/>`).join('')}
    ${[118,150,182,214,246,278].map((x,i)=>`<circle cx="${x+4}" cy="190" r="12" fill="${[K.base,K.light,K.dark][i%3]}"/>`).join('')}`,
  bottle:(K: Kit) =>`<rect x="158" y="168" width="84" height="146" rx="20" fill="${K.M}"/><rect x="182" y="140" width="36" height="34" fill="${K.dark}"/>
    <rect x="176" y="104" width="48" height="42" rx="9" fill="#2A2420"/><path d="M188 104 Q200 70 212 104Z" fill="#3B332D"/>
    <rect x="166" y="214" width="68" height="62" rx="7" fill="#FFFDF7" opacity=".92"/>
    <path d="M178 232 h44 M184 246 h32 M188 258 h24" stroke="${K.dark}" stroke-width="3" stroke-linecap="round"/>
    <path d="M168 182 L170 300" stroke="#fff" stroke-opacity=".35" stroke-width="8" stroke-linecap="round"/>`,
  jar:(K: Kit) =>`<rect x="126" y="198" width="148" height="110" rx="24" fill="${K.M}"/><rect x="120" y="168" width="160" height="42" rx="12" fill="${K.dark}"/>
    <path d="M134 178 H266" stroke="#fff" stroke-opacity=".25" stroke-width="3"/>
    <rect x="148" y="226" width="104" height="52" rx="8" fill="#FFFDF7" opacity=".92"/>
    <path d="M168 244 h64 M176 260 h48" stroke="${K.dark}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M138 214 L140 292" stroke="#fff" stroke-opacity=".3" stroke-width="8" stroke-linecap="round"/>`,
  candle:(K: Kit) =>`<circle cx="200" cy="160" r="44" fill="#FFD27A" opacity=".35"/>
    <path d="M140 192 H260 V302 Q260 320 242 320 H158 Q140 320 140 302Z" fill="${K.M}"/>
    <ellipse cx="200" cy="198" rx="58" ry="12" fill="#FFF4DD"/><path d="M200 196 V178" stroke="#3a2a1a" stroke-width="3"/>
    <path d="M200 140 Q216 162 207 178 Q200 186 193 178 Q184 162 200 140Z" fill="#FFB938"/><path d="M200 156 Q207 168 203 176 Q200 180 197 176 Q193 168 200 156Z" fill="#FFF1C4"/>
    <rect x="156" y="240" width="88" height="44" rx="4" fill="#FFFDF7" opacity=".9"/><path d="M172 256 h56 M180 268 h40" stroke="${K.dark}" stroke-width="3" stroke-linecap="round"/>`,
  lantern:(K: Kit) =>`<path d="M200 50 V110" stroke="${K.dark}" stroke-width="4"/><circle cx="200" cy="50" r="9" fill="none" stroke="${K.dark}" stroke-width="4"/>
    <path d="M178 108 H222 L242 140 H158Z" fill="${K.gold}"/>
    <path d="M158 140 H242 L258 250 L242 304 H158 L142 250Z" fill="${K.M}"/>
    ${range(7).map((r)=>range(5).map((c)=>{const y=156+r*20, w=r<5?1:.8;return `<circle cx="${200+(c-2)*16*w + (r%2?8:0)*w}" cy="${y}" r="${r%2?3.5:4.5}" fill="#FFE6A6"/>`}).join('')).join('')}
    <path d="M142 250 H258" stroke="${K.gold}" stroke-width="5"/>
    <path d="M162 304 H238 L224 326 H176Z" fill="${K.gold}"/><path d="M200 326 v14" stroke="${K.gold}" stroke-width="6"/>`,
  rug:(K: Kit) =>`<defs><clipPath id="${K.id}c"><rect x="112" y="80" width="176" height="258" rx="5"/></clipPath></defs>
    <g transform="rotate(-6 200 210)">
    ${range(23).map((i)=>`<path d="M${114+i*7.6} 72 v9 M${114+i*7.6} 337 v9" stroke="#E7DCC8" stroke-width="3" stroke-linecap="round"/>`).join('')}
    <rect x="112" y="80" width="176" height="258" rx="5" fill="#F4EDE0"/>
    <g clip-path="url(#${K.id}c)">${range(12).map((i)=>{const x=40+i*44;return `<path d="M${x} 80 L${x+258} 338 M${x} 338 L${x+258} 80" stroke="${i%2?K.dark:K.base}" stroke-width="${i%2?3:5}" transform="translate(-130 0)"/>`}).join('')}</g>
    <rect x="120" y="88" width="160" height="242" rx="3" fill="none" stroke="${K.dark}" stroke-width="3" opacity=".5"/></g>`,
  mirror:(K: Kit) =>`<defs><linearGradient id="${K.id}r" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3F7FB"/><stop offset=".5" stop-color="#C9D6E2"/><stop offset="1" stop-color="#9FB2C4"/></linearGradient></defs>
    <path d="M116 324 V170 Q116 78 200 78 Q284 78 284 170 V324Z" fill="${K.M}"/>
    <path d="M138 306 V172 Q138 100 200 100 Q262 100 262 172 V306Z" fill="url(#${K.id}r)"/>
    <path d="M160 140 L230 290 M186 120 L250 260" stroke="#fff" stroke-opacity=".6" stroke-width="10" stroke-linecap="round"/>
    ${range(10).map((i)=>`<circle cx="${127}" cy="${180+i*14}" r="3" fill="${K.gold}"/><circle cx="273" cy="${180+i*14}" r="3" fill="${K.gold}"/>`).join('')}`,
  cushion:(K: Kit) =>`<path d="M100 118 Q200 102 300 118 Q314 210 300 302 Q200 318 100 302 Q86 210 100 118Z" fill="${K.M}"/>
    <path d="M140 160 L200 130 L260 160 L200 190Z M140 250 L200 220 L260 250 L200 280Z" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="5"/>
    <path d="M120 205 H280" stroke="${K.gold}" stroke-width="6" stroke-dasharray="10 8"/>
    <path d="M170 205 l30 -15 30 15 -30 15z" fill="${K.gold}"/>
    ${[[100,118],[300,118],[100,302],[300,302]].map(([x,y])=>`<path d="M${x} ${y} l${x<200?-14:14} ${y<200?-16:16}" stroke="${K.dark}" stroke-width="6" stroke-linecap="round"/>`).join('')}`,
  pouf:(K: Kit) =>`<path d="M86 216 Q84 304 200 310 Q316 304 314 216Z" fill="${K.M}"/>
    <ellipse cx="200" cy="216" rx="114" ry="44" fill="${K.light}"/>
    <ellipse cx="200" cy="216" rx="72" ry="27" fill="none" stroke="${K.gold}" stroke-width="3.5" stroke-dasharray="7 6"/>
    ${range(8).map((i)=>{const a=i*Math.PI/4;return `<path d="M200 216 L${200+Math.cos(a)*108} ${216+Math.sin(a)*41}" stroke="${K.dark}" stroke-opacity=".28" stroke-width="2"/>`}).join('')}
    <path d="M92 254 Q200 296 308 254" stroke="${K.gold}" stroke-width="4" fill="none" stroke-dasharray="3 7"/>
    <circle cx="200" cy="216" r="8" fill="${K.gold}"/>`,
  box:(K: Kit) =>`<rect x="120" y="140" width="160" height="160" rx="16" fill="${K.M}"/>`,
};

export function artSvg(type: ArtType, h = 210, v = 0): string {
  const id = 'a' + ++uid
  const base=`hsl(${h} 55% 47%)`, dark=`hsl(${h} 50% 28%)`, light=`hsl(${h} 62% 70%)`;
  const b1=`hsl(${(h+18)%360} 40% 94%)`, b2=`hsl(${h} 32% 84%)`;
  const K = {id, M:`url(#${id}m)`, base, dark, light, gold:`url(#${id}g)`, metal:`url(#${id}t)`};
  const defs = `<defs>
<linearGradient id="${id}b" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="${b1}"/><stop offset="1" stop-color="${b2}"/></linearGradient>
<linearGradient id="${id}m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${light}"/><stop offset=".55" stop-color="${base}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
<linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6DE98"/><stop offset=".5" stop-color="#D4A646"/><stop offset="1" stop-color="#8F6A1F"/></linearGradient>
<linearGradient id="${id}t" x1="0" y1="0" x2="1" y2=".4"><stop offset="0" stop-color="#F4F5F8"/><stop offset=".45" stop-color="#BFC4CE"/><stop offset=".7" stop-color="#E6E8EE"/><stop offset="1" stop-color="#868C99"/></linearGradient>
<radialGradient id="${id}s"><stop offset="0" stop-color="#1a1530" stop-opacity=".26"/><stop offset="1" stop-color="#1a1530" stop-opacity="0"/></radialGradient>
<pattern id="${id}p" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M25 5l5.5 14.5L45 25l-14.5 5.5L25 45l-5.5-14.5L5 25l14.5-5.5z" fill="none" stroke="${dark}" stroke-opacity=".1" stroke-width="1.4"/></pattern></defs>`;
  let back = `<rect width="400" height="400" fill="url(#${id}b)"/>`, tf = '';
  if (v===0) back += `<circle cx="200" cy="205" r="152" fill="#fff" fill-opacity=".38"/>`;
  if (v===1){ back += `<rect width="400" height="400" fill="url(#${id}p)"/>`; tf = 'translate(200 205) scale(.88) translate(-200 -205)'; }
  if (v===2){ back += `<path d="M70 400V190a130 130 0 0 1 260 0v210z" fill="#fff" fill-opacity=".42"/>`; tf = 'translate(200 200) scale(1.32) translate(-200 -192)'; }
  if (v===3){ back += `<rect width="400" height="400" fill="url(#${id}p)"/><rect y="300" width="400" height="100" fill="${dark}" fill-opacity=".08"/>`; tf = 'translate(200 214) rotate(-7) scale(.8) translate(-200 -214)'; }
  return `<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${defs}${back}<ellipse cx="200" cy="336" rx="132" ry="16" fill="url(#${id}s)"/><g transform="${tf}">${(DRAW[type] ?? DRAW.box)(K)}</g></svg>`;
}
