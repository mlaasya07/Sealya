export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    lettersPerMonth: number | 'unlimited';
    scheduledLetters: number | 'unlimited';
    themes: number | 'unlimited';
    customSeals: number | 'unlimited';
  };
  popular?: boolean;
}

export interface PremiumTheme {
  id: string;
  name: string;
  description: string;
  preview: string;
  price: number;
  category: 'elegant' | 'vintage' | 'modern' | 'artistic';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  isPremium: boolean;
}

export interface CustomSeal {
  id: string;
  name: string;
  emoji: string;
  color: string;
  style: 'classic' | 'modern' | 'vintage';
  isPremium: boolean;
  price?: number;
}

export interface UserSubscription {
  tier: string;
  status: 'active' | 'cancelled' | 'expired';
  expiresAt: Date;
  features: string[];
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Basic (Free)',
    price: 0,
    interval: 'month',
    features: [
      '20 letters per month',
      '2 scheduled letters',
      'Standard letter themes',
      'Basic fonts only',
      'PDF export'
    ],
    limits: {
      lettersPerMonth: 20,
      scheduledLetters: 2,
      themes: 3,
      customSeals: 0
    }
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 2.49,
    interval: 'month',
    features: [
      '200 letters per month',
      '20 scheduled letters',
      '10+ premium themes & fonts',
      'Early access to new features',
      'Remove branding',
      'Priority support'
    ],
    limits: {
      lettersPerMonth: 200,
      scheduledLetters: 20,
      themes: 15,
      customSeals: 5
    },
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 5.99,
    interval: 'month',
    features: [
      'Unlimited letters & scheduling',
      'All premium themes, fonts & seals',
      'Attach images, videos, or audio',
      'Password-protected letters',
      'Priority support & customization',
      'Advanced analytics',
      'Bulk export',
      'Early access to features'
    ],
    limits: {
      lettersPerMonth: 'unlimited',
      scheduledLetters: 'unlimited',
      themes: 'unlimited',
      customSeals: 'unlimited'
    }
  }
];

export const PREMIUM_THEMES: PremiumTheme[] = [
  {
    id: 'vintage-romance',
    name: 'Vintage Romance',
    description: 'Classic romantic theme with antique paper textures',
    preview: '🌹',
    price: 199,
    category: 'vintage',
    colors: {
      primary: '#BE185D',
      secondary: '#F472B6',
      accent: '#FCE7F3'
    },
    isPremium: true
  },
  {
    id: 'corporate-minimal',
    name: 'Corporate Minimal',
    description: 'Clean, professional theme for business letters',
    preview: '💼',
    price: 199,
    category: 'modern',
    colors: {
      primary: '#1F2937',
      secondary: '#6B7280',
      accent: '#F9FAFB'
    },
    isPremium: true
  },
  {
    id: 'diwali-festive',
    name: 'Diwali Festive',
    description: 'Vibrant theme celebrating the festival of lights',
    preview: '🪔',
    price: 299,
    category: 'artistic',
    colors: {
      primary: '#F59E0B',
      secondary: '#DC2626',
      accent: '#FEF3C7'
    },
    isPremium: true
  },
  {
    id: 'new-year-gold',
    name: 'New Year Gold',
    description: 'Elegant golden theme for new beginnings',
    preview: '✨',
    price: 299,
    category: 'elegant',
    colors: {
      primary: '#D97706',
      secondary: '#F59E0B',
      accent: '#FFFBEB'
    },
    isPremium: true
  },
  {
    id: 'holiday-winter',
    name: 'Holiday Winter',
    description: 'Cozy winter theme with snowflake patterns',
    preview: '❄️',
    price: 249,
    category: 'artistic',
    colors: {
      primary: '#1E40AF',
      secondary: '#60A5FA',
      accent: '#EFF6FF'
    },
    isPremium: true
  },
  {
    id: 'minimalist-zen',
    name: 'Minimalist Zen',
    description: 'Clean, peaceful theme for mindful writing',
    preview: '🧘',
    price: 199,
    category: 'modern',
    colors: {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#ECFDF5'
    },
    isPremium: true
  }
];

export const CUSTOM_SEALS: CustomSeal[] = [
  {
    id: 'golden-lotus',
    name: 'Golden Lotus',
    emoji: '🪷',
    color: '#F59E0B',
    style: 'classic',
    isPremium: true,
    price: 99
  },
  {
    id: 'silver-moon',
    name: 'Silver Moon',
    emoji: '🌙',
    color: '#6B7280',
    style: 'modern',
    isPremium: true,
    price: 99
  },
  {
    id: 'ruby-heart',
    name: 'Ruby Heart',
    emoji: '💎',
    color: '#DC2626',
    style: 'vintage',
    isPremium: true,
    price: 199
  },
  {
    id: 'emerald-leaf',
    name: 'Emerald Leaf',
    emoji: '🍃',
    color: '#059669',
    style: 'classic',
    isPremium: true,
    price: 99
  },
  {
    id: 'sapphire-star',
    name: 'Sapphire Star',
    emoji: '⭐',
    color: '#1E40AF',
    style: 'modern',
    isPremium: true,
    price: 149
  },
  {
    id: 'rose-gold-crown',
    name: 'Rose Gold Crown',
    emoji: '👑',
    color: '#EC4899',
    style: 'vintage',
    isPremium: true,
    price: 299
  },
  {
    id: 'peacock-feather',
    name: 'Peacock Feather',
    emoji: '🪶',
    color: '#059669',
    style: 'classic',
    isPremium: true,
    price: 199
  },
  {
    id: 'crystal-butterfly',
    name: 'Crystal Butterfly',
    emoji: '🦋',
    color: '#8B5CF6',
    style: 'modern',
    isPremium: true,
    price: 249
  }
];