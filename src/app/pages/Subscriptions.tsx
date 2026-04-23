export function Subscriptions() {
  const tiers = [
    { name: 'BASIC', color: 'bg-gray-600' },
    { name: 'ADVANCED', color: 'bg-[#83aeff]' },
    { name: 'MAX', color: 'bg-[#FCD34D]' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">
      <div className="flex gap-8">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`${tier.color} w-60 h-96 border-4 border-black shadow-[6px_6px_0px_black] flex flex-col items-center justify-center font-mono text-white`}
          >
            <h2 className="text-xl">{tier.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}