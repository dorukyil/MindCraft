// Minecraft-style blocky input component
export function MinecraftInput({
  type = "text",
  placeholder,
  value,
  onChange,
  id,
  required = false
}: {
  type?: "text" | "password" | "email";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  required?: boolean;
}) {
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="
        w-full px-4 py-3
        bg-[#3C3C3C]
        border-4 border-black
        text-white
        placeholder:text-gray-400
        shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.5)]
        focus:outline-none
        focus:shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.5),0_0_0_3px_rgba(250,204,21,0.5)]
        transition-shadow
        font-mono
      "
      style={{
        imageRendering: 'pixelated'
      }}
    />
  );
}
