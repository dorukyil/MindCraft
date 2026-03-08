// West African Adinkra-inspired decorative pattern component
export function AdinkraPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sankofa-inspired symbol (representing learning and wisdom) */}
      <g fill="currentColor" opacity="0.15">
        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M50 30 L50 45 M50 55 L50 70" stroke="currentColor" strokeWidth="3" />
        <path d="M30 50 L45 50 M55 50 L70 50" stroke="currentColor" strokeWidth="3" />
        <circle cx="35" cy="35" r="5" />
        <circle cx="65" cy="35" r="5" />
        <circle cx="35" cy="65" r="5" />
        <circle cx="65" cy="65" r="5" />
      </g>
    </svg>
  );
}

// Kente-inspired pattern for decorative borders
export function KentePattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 40"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <pattern id="kente-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="10" height="10" fill="#D97706" />
        <rect x="10" y="0" width="10" height="10" fill="#92400E" />
        <rect x="20" y="0" width="10" height="10" fill="#FCD34D" />
        <rect x="30" y="0" width="10" height="10" fill="#B45309" />
        
        <rect x="0" y="10" width="10" height="10" fill="#92400E" />
        <rect x="10" y="10" width="10" height="10" fill="#FCD34D" />
        <rect x="20" y="10" width="10" height="10" fill="#B45309" />
        <rect x="30" y="10" width="10" height="10" fill="#D97706" />
        
        <rect x="0" y="20" width="10" height="10" fill="#FCD34D" />
        <rect x="10" y="20" width="10" height="10" fill="#B45309" />
        <rect x="20" y="20" width="10" height="10" fill="#D97706" />
        <rect x="30" y="20" width="10" height="10" fill="#92400E" />
        
        <rect x="0" y="30" width="10" height="10" fill="#B45309" />
        <rect x="10" y="30" width="10" height="10" fill="#D97706" />
        <rect x="20" y="30" width="10" height="10" fill="#92400E" />
        <rect x="30" y="30" width="10" height="10" fill="#FCD34D" />
      </pattern>
      <rect width="200" height="40" fill="url(#kente-pattern)" />
    </svg>
  );
}
