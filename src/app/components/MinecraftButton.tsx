// Minecraft-style blocky button component
export function MinecraftButton({ 
  children, 
  type = "button",
  className = "",
  onClick
}: { 
  children: React.ReactNode; 
  type?: "button" | "submit"; 
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        relative px-6 py-3 
        bg-gradient-to-b from-[#72b149] to-[#55942c]
        border-4 border-black
        shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]
        active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]
        active:translate-x-[2px]
        active:translate-y-[2px]
        transition-all
        font-bold
        text-white
        text-lg
        hover:brightness-110
        ${className}
      `}
      style={{
        imageRendering: 'pixelated',
        fontFamily: 'monospace'
      }}
    >
      <span className="drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
        {children}
      </span>
    </button>
  );
}
