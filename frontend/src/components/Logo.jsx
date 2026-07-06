var PRIMARY = '#5F7B65';

function Logo({ className, size }) {
  var dim = size || 40;
  return (
    <svg className={className} width={dim} height={dim} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill={PRIMARY} />
      <circle cx="50" cy="50" r="40" fill="#ffffff" />
      <rect x="44" y="25" width="12" height="28" rx="2.5" fill={PRIMARY} />
      <rect x="32" y="43" width="36" height="12" rx="2.5" fill={PRIMARY} />
      <g fill={PRIMARY}>
        <ellipse cx="30" cy="72" rx="10" ry="9" />
        <ellipse cx="21" cy="65" rx="5" ry="8" transform="rotate(-15 21 65)" />
        <ellipse cx="39" cy="65" rx="5" ry="8" transform="rotate(15 39 65)" />
        <circle cx="26" cy="71" r="2" fill="white" />
        <circle cx="34" cy="71" r="2" fill="white" />
        <ellipse cx="30" cy="76" rx="2" ry="1.5" fill="white" />
      </g>
      <g fill={PRIMARY}>
        <ellipse cx="70" cy="72" rx="9" ry="8" />
        <polygon points="63,66 64,54 69,63" />
        <polygon points="77,66 76,54 71,63" />
        <circle cx="66" cy="71" r="1.8" fill="white" />
        <circle cx="74" cy="71" r="1.8" fill="white" />
        <circle cx="70" cy="75" r="1.5" fill="white" />
        <line x1="65" y1="75" x2="58" y2="73" stroke={PRIMARY} strokeWidth="1" strokeLinecap="round" />
        <line x1="65" y1="77" x2="58" y2="78" stroke={PRIMARY} strokeWidth="1" strokeLinecap="round" />
        <line x1="75" y1="75" x2="82" y2="73" stroke={PRIMARY} strokeWidth="1" strokeLinecap="round" />
        <line x1="75" y1="77" x2="82" y2="78" stroke={PRIMARY} strokeWidth="1" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default Logo;
