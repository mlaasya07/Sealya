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
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '5 letters per month',
      '2 scheduled letters',
      'Basic themes',
      'PDF export',
      'Standard seals'
    ],
    limits: {
      lettersPerMonth: 5,
      scheduledLetters: 2,
      themes: 3,
      customSeals: 0
    }
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 4.99,
    interval: 'month',
    features: [
      '50 letters per month',
      '10 scheduled letters',
      'Premium themes',
      'Custom seals',
      'Priority support',
      'Advanced export options'
    ],
    limits: {
      lettersPerMonth: 50,
      scheduledLetters: 10,
      themes: 15,
      customSeals: 5
    },
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    interval: 'month',
    features: [
      'Unlimited letters',
      'Unlimited scheduling',
      'All premium themes',
      'Unlimited custom seals',
      'Advanced analytics',
      'Bulk export',
      'Priority support',
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
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Elegant purple and gold theme with vintage touches',
    preview: '👑',
    price: 2.99,
    category: 'elegant',
    colors: {
      primary: '#6B46C1',
      secondary: '#F59E0B',
      accent: '#EDE9FE'
    },
    isPremium: true
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Deep blue theme perfect for evening reflections',
    preview: '🌙',
    price: 2.99,
    category: 'modern',
    colors: {
      primary: '#1E3A8A',
      secondary: '#60A5FA',
      accent: '#DBEAFE'
    },
    isPremium: true
  },
  {
    id: 'vintage-rose',
    name: 'Vintage Rose',
    description: 'Classic rose theme with antique paper textures',
    preview: '🌹',
    price: 3.99,
    category: 'vintage',
    colors: {
      primary: '#BE185D',
      secondary: '#F472B6',
      accent: '#FCE7F3'
    },
    isPremium: true
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Natural green theme inspired by woodland serenity',
    preview: '🌲',
    price: 2.99,
    category: 'artistic',
    colors: {
      primary: '#065F46',
      secondary: '#10B981',
      accent: '#D1FAE5'
    },
    isPremium: true
  }
];

export const CUSTOM_SEALS: CustomSeal[] = [
  {
    id: 'golden-star',
    name: 'Golden Star',
    emoji: '⭐',
    color: '#F59E0B',
    style: 'classic',
    isPremium: true,
    price: 0.99
  },
  {
    id: 'silver-moon',
    name: 'Silver Moon',
    emoji: '🌙',
    color: '#6B7280',
    style: 'modern',
    isPremium: true,
    price: 0.99
  },
  {
    id: 'ruby-heart',
    name: 'Ruby Heart',
    emoji: '💎',
    color: '#DC2626',
    style: 'vintage',
    isPremium: true,
    price: 1.99
  },
  {
    id: 'emerald-leaf',
    name: 'Emerald Leaf',
    emoji: '🍃',
    color: '#059669',
    style: 'classic',
    isPremium: true,
    price: 0.99
  }
];