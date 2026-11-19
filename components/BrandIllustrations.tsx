export function BrandLogo({ className = "h-9 w-9" }: { className?: string }) {
    return (
      <svg
        viewBox="0 0 44 44"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M22 5L37 13.5V30.5L22 39L7 30.5V13.5L22 5Z"
          stroke="#1B5E3A"
          strokeWidth="2.4"
          strokeLinejoin="round"
          fill="#E8F3EE"
        />
        <path
          d="M7 13.5L22 22L37 13.5M22 22V39"
          stroke="#1B5E3A"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M27 10C31 7 36 8 37 12C33 14 29 13 27 10Z"
          fill="#2E7D52"
          stroke="#1B5E3A"
          strokeWidth="1.6"
        />
      </svg>
    );
  }
  
  export function BrusselsSkyline({ className = "" }: { className?: string }) {
    return (
      <svg
        viewBox="0 0 460 150"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        {/* Ground line */}
        <line x1="10" y1="142" x2="450" y2="142" stroke="#2F6F4E" strokeWidth="2" />
  
        {/* Left trees & bushes */}
        <circle cx="38" cy="128" r="14" fill="#D5E8DF" stroke="#2F6F4E" strokeWidth="1.8" />
        <circle cx="58" cy="131" r="11" fill="#D5E8DF" stroke="#2F6F4E" strokeWidth="1.8" />
  
        {/* Left Guildhouse 1 */}
        <path
          d="M72 142V86L92 66L112 86V142H72Z"
          fill="#F4F9F6"
          stroke="#2F6F4E"
          strokeWidth="1.8"
        />
        <rect x="81" y="94" width="7" height="11" stroke="#2F6F4E" strokeWidth="1.4" />
        <rect x="96" y="94" width="7" height="11" stroke="#2F6F4E" strokeWidth="1.4" />
        <rect x="81" y="114" width="7" height="11" stroke="#2F6F4E" strokeWidth="1.4" />
        <rect x="96" y="114" width="7" height="11" stroke="#2F6F4E" strokeWidth="1.4" />
  
        {/* Left Guildhouse 2 (Stepped Gable) */}
        <path
          d="M112 142V78H120V68H128V58H142V68H150V78H158V142H112Z"
          fill="#E5F1EB"
          stroke="#2F6F4E"
          strokeWidth="1.8"
        />
        <rect x="122" y="88" width="8" height="13" stroke="#2F6F4E" strokeWidth="1.4" />
        <rect x="140" y="88" width="8" height="13" stroke="#2F6F4E" strokeWidth="1.4" />
        <rect x="122" y="110" width="8" height="13" stroke="#2F6F4E" strokeWidth="1.4" />
        <rect x="140" y="110" width="8" height="13" stroke="#2F6F4E" strokeWidth="1.4" />
  
        {/* Center Grand Place Town Hall (Hôtel de Ville) */}
        <rect
          x="158"
          y="76"
          width="134"
          height="66"
          fill="#F4F9F6"
          stroke="#2F6F4E"
          strokeWidth="1.8"
        />
        {/* Spire Tower */}
        <path
          d="M207 76V36L225 8L243 36V76H207Z"
          fill="#D5E8DF"
          stroke="#2F6F4E"
          strokeWidth="1.8"
        />
        <line x1="225" y1="2" x2="225" y2="10" stroke="#2F6F4E" strokeWidth="1.8" />
        <rect x="217" y="44" width="6" height="14" stroke="#2F6F4E" strokeWidth="1.4" />
        <rect x="227" y="44" width="6" height="14" stroke="#2F6F4E" strokeWidth="1.4" />
  
        {/* Town Hall Arches & Windows */}
        {[168, 184, 200, 246, 262, 276].map((x) => (
          <g key={x}>
            <rect x={x} y="88" width="7" height="12" stroke="#2F6F4E" strokeWidth="1.4" />
            <path
              d={`M${x} 142V122C${x} 118 ${x + 7} 118 ${x + 7} 122V142`}
              stroke="#2F6F4E"
              strokeWidth="1.4"
            />
          </g>
        ))}
        {/* Central Portal */}
        <path
          d="M217 142V116C217 110 233 110 233 116V142H217Z"
          fill="#CBE0D6"
          stroke="#2F6F4E"
          strokeWidth="1.6"
        />
  
        {/* Right Guildhouse 1 */}
        <path
          d="M292 142V74L316 54L340 74V142H292Z"
          fill="#E5F1EB"
          stroke="#2F6F4E"
          strokeWidth="1.8"
        />
        <rect x="303" y="86" width="8" height="13" stroke="#2F6F4E" strokeWidth="1.4" />
        <rect x="321" y="86" width="8" height="13" stroke="#2F6F4E" strokeWidth="1.4" />
        <rect x="303" y="109" width="8" height="13" stroke="#2F6F4E" strokeWidth="1.4" />
        <rect x="321" y="109" width="8" height="13" stroke="#2F6F4E" strokeWidth="1.4" />
  
        {/* Right Guildhouse 2 */}
        <path
          d="M340 142V88L360 70L380 88V142H340Z"
          fill="#F4F9F6"
          stroke="#2F6F4E"
          strokeWidth="1.8"
        />
        <rect x="350" y="98" width="7" height="11" stroke="#2F6F4E" strokeWidth="1.4" />
        <rect x="364" y="98" width="7" height="11" stroke="#2F6F4E" strokeWidth="1.4" />
  
        {/* Right trees */}
        <circle cx="402" cy="127" r="15" fill="#D5E8DF" stroke="#2F6F4E" strokeWidth="1.8" />
        <circle cx="424" cy="131" r="11" fill="#D5E8DF" stroke="#2F6F4E" strokeWidth="1.8" />
      </svg>
    );
  }
  
  export function BundleBoxIllustration({ className = "" }: { className?: string }) {
    return (
      <svg
        viewBox="0 0 210 135"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        {/* Items sticking out of the starter box */}
        {/* Frying pan handle & pan */}
        <path d="M48 64L30 28" stroke="#2E3A34" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="56" cy="60" rx="18" ry="12" fill="#374151" stroke="#1F2937" strokeWidth="2" />
        {/* Cooking utensils */}
        <rect x="74" y="24" width="6" height="44" rx="3" fill="#1B5E3A" />
        <circle cx="77" cy="22" r="7" fill="#1B5E3A" />
        <rect x="86" y="28" width="5" height="40" rx="2.5" fill="#D97706" />
        {/* Folded towels & pillow */}
        <rect x="98" y="36" width="44" height="14" rx="5" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
        <rect x="96" y="48" width="48" height="12" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
        <rect x="94" y="58" width="52" height="12" rx="4" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
        {/* Cleaning spray bottle */}
        <rect x="150" y="42" width="16" height="28" rx="4" fill="#2E7D52" />
        <path d="M154 42V35H166L169 38" stroke="#1B5E3A" strokeWidth="2.5" strokeLinecap="round" />
  
        {/* Main Cardboard / Reusable Starter Box */}
        <rect
          x="26"
          y="66"
          width="154"
          height="58"
          rx="6"
          fill="#D6B48A"
          stroke="#8C673E"
          strokeWidth="2"
        />
        {/* Box Top Rim */}
        <rect
          x="22"
          y="62"
          width="162"
          height="9"
          rx="3"
          fill="#E5C7A1"
          stroke="#8C673E"
          strokeWidth="1.8"
        />
        {/* Brand Badge on Box */}
        <rect x="74" y="82" width="58" height="26" rx="4" fill="#F4F9F6" opacity="0.9" />
        <text
          x="103"
          y="94"
          textAnchor="middle"
          fill="#1B5E3A"
          fontSize="8.5"
          fontWeight="700"
        >
          Pack &amp;
        </text>
        <text
          x="103"
          y="103"
          textAnchor="middle"
          fill="#1B5E3A"
          fontSize="8.5"
          fontWeight="700"
        >
          Collect
        </text>
  
        {/* Motion accent lines on right */}
        <line x1="191" y1="54" x2="201" y2="48" stroke="#1B5E3A" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="193" y1="68" x2="204" y2="68" stroke="#1B5E3A" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="191" y1="82" x2="201" y2="88" stroke="#1B5E3A" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }