import { useId } from 'react';
import type { Product } from './data';

// Original vector artwork. Every shape is local; no remote images or fonts.
export function ProductArt({ product, variant = 0, view = 0, className }: { product: Product; variant?: number; view?: number; className?: string }) {
  const uid = useId().replace(/:/g, '');
  const color = product.variants[variant]?.color || product.color;
  const index = product.id.split('').reduce((n, c) => n + c.charCodeAt(0), 0);
  return <svg className={className} viewBox="0 0 480 420" role="img" aria-label={`${product.name}, ${product.variants[variant]?.name || 'Авторський'}, ${view ? 'деталі' : 'загальний вигляд'}`}>
    <defs>
      <linearGradient id={`${uid}bg`} x2="0.9" y2="1"><stop stopColor="#fff" stopOpacity=".25" /><stop offset="1" stopColor="#000" stopOpacity=".06" /></linearGradient>
      <linearGradient id={`${uid}body`} x2="1" y2=".8"><stop stopColor={color} /><stop offset=".46" stopColor={color} /><stop offset="1" stopColor="#222" stopOpacity=".6" /></linearGradient>
      <filter id={`${uid}shadow`} x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="10" /></filter>
      <linearGradient id={`${uid}screen`} x2="1" y2="1"><stop stopColor="#626c57"/><stop offset="1" stopColor="#252e27"/></linearGradient>
    </defs>
    <rect width="480" height="420" fill={product.background}/><rect width="480" height="420" fill={`url(#${uid}bg)`}/>
    <path d="M0 330L480 280V420H0Z" fill="#fff" opacity=".12"/>
    <g transform={view ? 'translate(-48 -40) scale(1.22)' : undefined}>
      <ellipse cx="253" cy="346" rx="125" ry="15" fill="#302b24" opacity=".17" filter={`url(#${uid}shadow)`}/>
      {product.category === 'lamps' && <g transform={`rotate(${index % 3 - 1} 240 280)`}>
        <path d="M254 329C296 336 335 349 390 339" stroke="#55544a" strokeWidth="3" fill="none"/>
        <ellipse cx="231" cy="333" rx="67" ry="15" fill={color}/><ellipse cx="231" cy="327" rx="67" ry="15" fill={`url(#${uid}body)`}/>
        <path d="M233 325V198Q233 143 280 140" fill="none" stroke="#000" strokeOpacity=".1" strokeWidth="15"/>
        <path d="M228 324V197Q228 142 276 139" fill="none" stroke={color} strokeWidth="13"/>
        <path d={index % 2 ? 'M168 179Q175 75 261 92Q314 102 320 179Z' : 'M170 180L202 110Q245 90 284 110L316 180Z'} fill={`url(#${uid}body)`}/>
        <ellipse cx="244" cy="180" rx="75" ry="15" fill="#edd9ab"/><ellipse cx="244" cy="180" rx="58" ry="9" fill="#fff1c9"/>
        <path d="M196 155Q200 121 218 111" fill="none" stroke="#fff" strokeOpacity=".2" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="231" cy="327" r="4" fill="#fff" opacity=".5"/>
      </g>}
      {product.category === 'stands' && <g>
        <path d="M150 292L165 341L194 332L184 280M293 262L306 314L334 305L323 254" fill={color}/>
        <path d="M109 279L277 221L371 260L202 321Z" fill={`url(#${uid}body)`}/><path d="M109 279V291L202 333L371 273V260L202 321Z" fill={color}/>
        <path d="M140 130L297 103Q304 102 306 110L335 246L172 281Z" fill="#474b45"/>
        <path d="M148 138L297 113L322 238L179 268Z" fill={`url(#${uid}screen)`}/>
        <circle cx="245" cy="185" r="44" fill="#d9e3b7" opacity=".6"/><path d="M183 249Q236 169 311 207L320 238L179 268Z" fill="#94a37c"/>
        <path d="M172 281L335 246L367 260L205 303L139 285Z" fill="#c4c7c0"/><path d="M182 281L327 252L344 260L204 295Z" fill="#666d64"/><path d="M222 286L268 277L280 282L235 293Z" fill="#bfc2ba"/>
      </g>}
      {product.category === 'mats' && <g>
        <path d="M67 253Q62 242 78 236L290 165Q301 162 313 170L414 275Q423 288 405 294L185 367Q171 372 160 361Z" fill="#333" opacity=".15"/>
        <path d="M67 248Q62 237 78 231L290 160Q301 157 313 165L414 270Q423 283 405 289L185 362Q171 367 160 356Z" fill={`url(#${uid}body)`}/>
        <path d="M81 246L298 174L402 275L175 352Z" fill="none" stroke="#fff" strokeOpacity=".23" strokeDasharray="2 3"/>
        <g transform="translate(122 224) rotate(-18) skewX(18)"><rect width="153" height="66" rx="6" fill="#e9e7df"/>{Array.from({ length: 40 }, (_, i) => <rect key={i} x={8 + i % 10 * 14} y={7 + Math.floor(i / 10) * 13} width="10" height="9" rx="2" fill="#d0d0c6"/>)}<rect x="42" y="56" width="70" height="5" rx="2" fill="#c3c5b9"/></g>
        <ellipse cx="328" cy="263" rx="23" ry="34" transform="rotate(-33 328 263)" fill="#e7e5dc"/><path d="M324 241L331 250" stroke="#b6b8ad" strokeWidth="3" strokeLinecap="round"/>
      </g>}
      {product.category === 'chargers' && <g>
        <path d="M292 284C334 284 354 298 394 272" stroke="#66675e" strokeWidth="4" fill="none"/>
        <ellipse cx="239" cy="291" rx="105" ry="49" fill={color}/><path d="M134 275V293Q239 365 344 293V275Z" fill={`url(#${uid}body)`}/>
        <ellipse cx="239" cy="275" rx="105" ry="49" fill={color}/><ellipse cx="239" cy="275" rx="82" ry="36" fill="none" stroke="#fff" strokeOpacity=".3"/>
        <g transform="rotate(-22 236 223)"><rect x="194" y="126" width="89" height="173" rx="15" fill="#343a34"/><rect x="199" y="131" width="79" height="161" rx="11" fill={`url(#${uid}screen)`}/><rect x="225" y="136" width="26" height="6" rx="3" fill="#252c24"/><circle cx="238" cy="214" r="26" fill="none" stroke="#c6db96" strokeWidth="3"/><path d="M240 197L230 215H241L235 231L248 211H238Z" fill="#d9eaac"/><path d="M223 271H251" stroke="#dce6d2" strokeWidth="3" strokeLinecap="round"/></g>
        <circle cx="239" cy="317" r="2.5" fill="#d9efb0"/>
      </g>}
    </g>
  </svg>;
}

export function HeroArt() {
  return <svg viewBox="0 0 760 650" role="img" aria-label="Авторська ілюстрація робочого простору: теракотова лампа, ноутбук, зелений килимок та аксесуари">
    <defs>
      <linearGradient id="wall" x2="1" y2="1"><stop stopColor="#dfdacb"/><stop offset="1" stopColor="#eeeadc"/></linearGradient>
      <linearGradient id="desk" x2=".2" y2="1"><stop stopColor="#c7a580"/><stop offset="1" stopColor="#b78e65"/></linearGradient>
      <linearGradient id="lamp" x2="1" y2=".4"><stop stopColor="#e57e4d"/><stop offset="1" stopColor="#a84526"/></linearGradient>
      <linearGradient id="display" x2=".8" y2="1"><stop stopColor="#b7c4a3"/><stop offset="1" stopColor="#46573d"/></linearGradient>
      <filter id="blur"><feGaussianBlur stdDeviation="12"/></filter>
    </defs>
    <rect width="760" height="650" fill="url(#wall)"/>
    <path d="M435 0H487L180 457H127ZM605 0H727L420 457H298Z" fill="#fff" opacity=".3"/>
    <path d="M0 422L760 340V650H0Z" fill="url(#desk)"/>
    <path d="M0 604L760 515V650H0Z" fill="#a9835f" opacity=".35"/>
    <ellipse cx="412" cy="500" rx="290" ry="43" fill="#463c29" opacity=".2" filter="url(#blur)"/>
    <path d="M172 462L516 402L678 537L319 612Z" fill="#718068"/><path d="M180 462L516 410L667 534L320 603Z" fill="none" stroke="#fff" strokeOpacity=".18"/>
    <path d="M126 454Q103 424 138 415L208 404Q256 413 247 435L225 455Z" fill="#ac4c2a"/>
    <ellipse cx="185" cy="425" rx="61" ry="18" fill="url(#lamp)"/>
    <path d="M187 420V244Q187 170 248 166" fill="none" stroke="#af4b2b" strokeWidth="15"/>
    <path d="M120 209Q133 90 242 104Q305 113 327 210Z" fill="url(#lamp)"/>
    <ellipse cx="224" cy="211" rx="103" ry="20" fill="#f0cf99"/><ellipse cx="224" cy="210" rx="83" ry="11" fill="#ffe6b5"/>
    <path d="M150 179Q163 130 195 123" stroke="#f1a278" strokeWidth="5" fill="none" opacity=".6" strokeLinecap="round"/>
    <path d="M337 468L352 499L382 494L372 455M538 435L547 472L568 467L561 426" fill="#8f6847"/>
    <path d="M302 455L511 411L594 453L379 506Z" fill="#bf956d"/><path d="M302 455V467L379 518L594 465V453L379 506Z" fill="#956f50"/>
    <path d="M311 239L520 215Q530 214 531 227L560 416L347 460Z" fill="#3d443b"/>
    <path d="M322 250L520 227L547 407L357 445Z" fill="url(#display)"/>
    <circle cx="452" cy="303" r="49" fill="#e4e8c7" opacity=".8"/><path d="M345 374Q411 269 543 366L547 407L357 445Z" fill="#778a65"/><path d="M351 405Q460 327 548 397L547 407L357 445Z" fill="#506444"/>
    <path d="M347 460L560 416L598 442L383 492L298 466Z" fill="#c5c8be"/><path d="M356 459L553 423L573 437L383 481Z" fill="#666e60"/><path d="M407 474L454 465L468 471L422 482Z" fill="#adb4a5"/>
    <g transform="translate(600 350)"><ellipse cx="28" cy="57" rx="38" ry="13" fill="#d9d3bc"/><path d="M-10 7L-3 54Q28 75 60 54L67 7Z" fill="#e7e0cb"/><ellipse cx="28" cy="7" rx="39" ry="13" fill="#f5efdb"/><ellipse cx="28" cy="7" rx="29" ry="8" fill="#6a4b30"/><path d="M65 13Q97 10 89 36Q84 49 64 43" fill="none" stroke="#e7e0cb" strokeWidth="9"/></g>
    <g transform="rotate(-12 548 533)"><rect x="513" y="482" width="65" height="108" rx="10" fill="#3f493d"/><rect x="517" y="487" width="57" height="97" rx="7" fill="#a9b593"/><circle cx="545" cy="531" r="15" fill="none" stroke="#e6edce" strokeWidth="2"/><path d="M548 521L540 533H548L543 543" stroke="#e6edce" strokeWidth="2" fill="none"/></g>
    <path d="M0 521L113 503L173 553L50 577Z" fill="#ece6d8"/><path d="M15 525L108 512M24 533L117 520M32 542L125 529" stroke="#c2bba8" strokeWidth="2"/>
    <path d="M53 555L129 532" stroke="#3a4436" strokeWidth="5" strokeLinecap="round"/>
  </svg>;
}
