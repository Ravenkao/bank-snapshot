
export interface Transaction {
  type: string;
  category?: string;
  date: string;
  recurrence?: string;
  amount: string;
  paymentSource?: {
    name: string;
    logoUrl?: string;
  };
  paymentDestination?: {
    name: string;
    logoUrl?: string;
  };
  receipt?: string;
  description?: string;
  securityIndicator?: string;
  privacyIndicator?: string;
  tag?: string;
  reminder?: string;
  metadata: {
    inputSource: string;
    inputTime: string;
    editTimes?: string[];
    creator?: string;
  };
  cashback?: string;
  excludeFromInsights: boolean;
}

// Mock available logos for demonstration purposes
const logoMap: Record<string, string> = {
  "chase": "https://logo.clearbit.com/chase.com",
  "wells fargo": "https://logo.clearbit.com/wellsfargo.com",
  "bank of america": "https://logo.clearbit.com/bankofamerica.com",
  "citibank": "https://logo.clearbit.com/citibank.com",
  "capital one": "https://logo.clearbit.com/capitalone.com",
  "amazon": "https://logo.clearbit.com/amazon.com",
  "walmart": "https://logo.clearbit.com/walmart.com",
  "target": "https://logo.clearbit.com/target.com",
  "apple": "https://logo.clearbit.com/apple.com",
  "netflix": "https://logo.clearbit.com/netflix.com",
  "spotify": "https://logo.clearbit.com/spotify.com",
  "uber": "https://logo.clearbit.com/uber.com",
  "lyft": "https://logo.clearbit.com/lyft.com",
  "doordash": "https://logo.clearbit.com/doordash.com",
  "grubhub": "https://logo.clearbit.com/grubhub.com"
};

// Find potential logos based on name
export const findLogo = (name: string): string | undefined => {
  const lowerName = name.toLowerCase();
  
  // Direct match
  if (logoMap[lowerName]) return logoMap[lowerName];
  
  // Partial match
  for (const [key, url] of Object.entries(logoMap)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return url;
    }
  }
  
  return undefined;
};

/**
 * Parse transaction data from the current active tab
 */
export const parseTransactionFromPage = async (): Promise<Transaction | null> => {
  try {
    // In a real extension, we would inject a content script to parse the DOM
    // For demo purposes, we'll simulate finding a transaction table and extracting data
    
    // This would be replaced with actual DOM parsing logic in a real extension
    const mockTransaction: Transaction = {
      type: "Purchase",
      category: "Shopping",
      date: new Date().toISOString().split('T')[0],
      recurrence: "Monthly",
      amount: "$120.50",
      paymentSource: {
        name: "Chase Credit Card",
        logoUrl: findLogo("chase")
      },
      paymentDestination: {
        name: "Amazon",
        logoUrl: findLogo("amazon")
      },
      description: "Amazon Prime subscription",
      securityIndicator: "Verified",
      privacyIndicator: "Private",
      tag: "Subscription",
      metadata: {
        inputSource: "Automatic",
        inputTime: new Date().toISOString(),
        creator: "Extension"
      },
      cashback: "2%",
      excludeFromInsights: false
    };
    
    return mockTransaction;
  } catch (error) {
    console.error("Error parsing transaction:", error);
    return null;
  }
};

// Function to simulate parsing from different banks
export const parseTransactionFromBank = (bankName: string): Transaction | null => {
  // This would be replaced with actual bank-specific parsing logic
  const transactionTypes = ["Purchase", "Deposit", "Transfer", "Withdrawal", "Payment"];
  const categories = ["Shopping", "Groceries", "Entertainment", "Travel", "Dining", "Utilities", "Income"];
  const descriptions = [
    "Monthly subscription", 
    "Grocery shopping", 
    "Online purchase", 
    "Restaurant meal", 
    "Utility payment"
  ];
  const stores = ["Amazon", "Walmart", "Target", "Netflix", "Spotify", "Apple", "Uber"];
  
  const randomType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomAmount = `$${(Math.random() * 200).toFixed(2)}`;
  const randomStore = stores[Math.floor(Math.random() * stores.length)];
  const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  return {
    type: randomType,
    category: randomCategory,
    date: new Date().toISOString().split('T')[0],
    amount: randomAmount,
    paymentSource: {
      name: `${bankName} Card`,
      logoUrl: findLogo(bankName)
    },
    paymentDestination: {
      name: randomStore,
      logoUrl: findLogo(randomStore)
    },
    description: randomDesc,
    securityIndicator: Math.random() > 0.5 ? "Verified" : undefined,
    privacyIndicator: Math.random() > 0.5 ? "Private" : "Public",
    metadata: {
      inputSource: "Manual",
      inputTime: new Date().toISOString(),
      creator: "User"
    },
    excludeFromInsights: false
  };
};
