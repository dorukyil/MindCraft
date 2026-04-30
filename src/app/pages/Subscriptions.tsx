import { useNavigate } from 'react-router';
import { ArrowLeft, Check, Lock, Zap, Star, Shield, BookOpen, Users, BarChart2, Upload, Crown } from 'lucide-react';
import { MinecraftButton } from '../components/MinecraftButton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Sidebar } from '../components/Sidebar';

const tiers = [
  {
    name: 'BASIC',
    subtitle: 'For the adventurer just starting out',
    price: 'FREE',
    priceSub: 'forever',
    color: 'from-[#3C3C3C] to-[#2a2a2a]',
    borderColor: 'border-white/20',
    badge: null,
    badgeBg: '',
    accentColor: 'text-white/80',
    btnBg: 'bg-gradient-to-b from-[#555] to-[#3a3a3a]',
    btnText: 'text-white',
    btnLabel: 'FREE PLAN',
    icon: Shield,
    iconColor: 'text-white/60',
    priceColor: 'text-white',
    features: [
      { label: '5 lessons per month', available: true },
      { label: 'Basic quizzes', available: true },
      { label: 'Progress tracking', available: true },
      { label: 'XP & achievements', available: false },
      { label: 'AI-powered hints', available: false },
      { label: 'Classroom access', available: false },
      { label: 'Assignment uploads', available: false },
      { label: 'Priority support', available: false },
    ],
  },
  {
    name: 'ADVANCED',
    subtitle: 'For the serious knowledge crafter',
    price: '$9',
    priceSub: 'per month',
    color: 'from-[#1a3a6e] to-[#0f2550]',
    borderColor: 'border-[#83aeff]',
    badge: 'POPULAR',
    badgeBg: 'bg-[#83aeff] text-black',
    accentColor: 'text-[#83aeff]',
    btnBg: 'bg-gradient-to-b from-[#83aeff] to-[#5a8ae0]',
    btnText: 'text-black',
    btnLabel: 'UPGRADE NOW',
    icon: Zap,
    iconColor: 'text-[#83aeff]',
    priceColor: 'text-[#83aeff]',
    features: [
      { label: 'Unlimited lessons', available: true },
      { label: 'Advanced quizzes', available: true },
      { label: 'Progress tracking', available: true },
      { label: 'XP & achievements', available: true },
      { label: 'AI-powered hints', available: true },
      { label: 'Classroom access', available: true },
      { label: 'Assignment uploads', available: false },
      { label: 'Priority support', available: false },
    ],
  },
  {
    name: 'MAX',
    subtitle: 'For the ultimate knowledge master',
    price: '$19',
    priceSub: 'per month',
    color: 'from-[#5a3a00] to-[#3a2500]',
    borderColor: 'border-[#FCD34D]',
    badge: 'BEST VALUE',
    badgeBg: 'bg-[#FCD34D] text-black',
    accentColor: 'text-[#FCD34D]',
    btnBg: 'bg-gradient-to-b from-[#FCD34D] to-[#e6b800]',
    btnText: 'text-black',
    btnLabel: 'GO MAX',
    icon: Crown,
    iconColor: 'text-[#FCD34D]',
    priceColor: 'text-[#FCD34D]',
    features: [
      { label: 'Unlimited lessons', available: true },
      { label: 'Advanced quizzes', available: true },
      { label: 'Progress tracking', available: true },
      { label: 'XP & achievements', available: true },
      { label: 'AI-powered hints', available: true },
      { label: 'Classroom access', available: true },
      { label: 'Assignment uploads', available: true },
      { label: 'Priority support', available: true },
    ],
  },
];

export function Subscriptions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-[#83aeff] to-[#8fb9ff]">
      {/* Minecraft sky background */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://minecraft.wiki/images/thumb/Plains_sky.png/1200px-Plains_sky.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            imageRendering: 'pixelated',
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen p-8">
        {/* Sidebar */}
        <Sidebar onLogout={() => navigate('/')} />

        {/* Header */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <ImageWithFallback
              src="/mindCraft_logo_border.png"
              alt="MindCraft Logo"
              className="w-12 h-12"
            />
            <h1
              className="text-3xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: 'monospace', imageRendering: 'pixelated', letterSpacing: '2px' }}
            >
              MINDCRAFT
            </h1>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <MinecraftButton
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 font-mono text-sm"
            >
              <ArrowLeft size={14} />
              DASHBOARD
            </MinecraftButton>
          </div>

          {/* Page header panel */}
          <div
            className="bg-gradient-to-br from-[#976d4c] to-[#7b583d] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6 mb-8"
            style={{ imageRendering: 'pixelated' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2
                  className="text-2xl text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
                  style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
                >
                  CHOOSE YOUR PLAN
                </h2>
                <p className="text-[#FCD34D] font-mono text-xs mt-1 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
                  Upgrade to unlock more lessons, tools, and classroom features
                </p>
              </div>
              <div className="flex gap-4">
              
              </div>
            </div>

            {/* Decorative divider */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
              <div className="w-2 h-2 bg-[#72b149] rotate-45" />
              <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#72b149] to-transparent" />
            </div>
          </div>

          {/* Tier cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <div
                  key={tier.name}
                  className={`relative bg-gradient-to-br ${tier.color} border-8 ${tier.borderColor} border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] flex flex-col`}
                  style={{ imageRendering: 'pixelated' }}
                >
                  {/* Badge */}
                  {tier.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span
                        className={`${tier.badgeBg} font-mono text-xs font-bold px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
                      >
                        ★ {tier.badge} ★
                      </span>
                    </div>
                  )}

                  {/* Card header */}
                  <div className="p-6 border-b-4 border-black/40">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-black/30 border-4 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]">
                        <Icon size={20} className={tier.iconColor} />
                      </div>
                      <div>
                        <h3
                          className={`font-mono font-bold text-lg drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)] ${tier.accentColor}`}
                          style={{ letterSpacing: '2px' }}
                        >
                          {tier.name}
                        </h3>
                        <p className="text-white/50 font-mono text-[10px]">{tier.subtitle}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mt-4">
                      <span
                        className={`font-mono text-4xl font-bold drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)] ${tier.priceColor}`}
                        style={{ letterSpacing: '1px' }}
                      >
                        {tier.price}
                      </span>
                      <span className="text-white/40 font-mono text-xs ml-2">{tier.priceSub}</span>
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="p-6 flex-1 flex flex-col gap-3">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)] ${
                            feature.available ? 'bg-[#72b149]' : 'bg-[#2a2a2a]'
                          }`}
                        >
                          {feature.available ? (
                            <Check size={10} className="text-white" />
                          ) : (
                            <Lock size={9} className="text-white/30" />
                          )}
                        </div>
                        <span
                          className={`font-mono text-xs ${
                            feature.available ? 'text-white' : 'text-white/30'
                          }`}
                        >
                          {feature.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA button */}
                  <div className="p-6 pt-0">
                    <button
                      className={`w-full ${tier.btnBg} ${tier.btnText} border-4 border-black font-mono font-bold text-sm py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all hover:brightness-110`}
                      style={{ imageRendering: 'pixelated', letterSpacing: '2px' }}
                    >
                      {tier.btnLabel}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div
            className="bg-gradient-to-br from-[#3C3C3C] to-[#2a2a2a] border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-6"
            style={{ imageRendering: 'pixelated' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-start gap-3 flex-1">
                <BookOpen size={16} className="text-[#83aeff] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-mono text-xs font-bold mb-1">ALL PLANS INCLUDE</p>
                  <p className="text-white/50 font-mono text-xs leading-relaxed">
                    Access to the MindCraft platform, community forums, and regular content updates. Cancel or change your plan at any time.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 flex-1">
                <Users size={16} className="text-[#72b149] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-mono text-xs font-bold mb-1">SCHOOLS & TEAMS</p>
                  <p className="text-white/50 font-mono text-xs leading-relaxed">
                    Need bulk licences for your school? Contact us for special educator pricing and district-wide plans.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 flex-1">
                <BarChart2 size={16} className="text-[#FCD34D] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-mono text-xs font-bold mb-1">TRACK YOUR GROWTH</p>
                  <p className="text-white/50 font-mono text-xs leading-relaxed">
                    Every plan gives you a full progress dashboard so you can see how far you've come, block by block.
                  </p>
                </div>
              </div>
            </div>

            {/* Pixel decorations */}
            <div className="mt-6 flex justify-center gap-2">
              <div className="w-3 h-3 bg-[#82c159] border-2 border-black" />
              <div className="w-3 h-3 bg-[#72b149] border-2 border-black" />
              <div className="w-3 h-3 bg-[#55942c] border-2 border-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
