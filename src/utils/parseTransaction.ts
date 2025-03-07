
export interface Transaction {
  date: string;
  description: string;
  moneyOut?: string;
  moneyIn?: string;
  balance: string;
  type?: string;
  category?: string;
  recurrence?: string;
  paymentSource?: {
    name: string;
    logoUrl?: string;
  };
  paymentDestination?: {
    name: string;
    logoUrl?: string;
  };
  receipt?: string;
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
    
    // This simulates extracting data from a bank statement table like in the image
    const mockTransaction: Transaction = {
      date: "Mar 03, 2025",
      description: "INTERAC ETRNSFR SENT LULU 202506015341KAYPVG",
      moneyOut: "$90.00",
      moneyIn: undefined,
      balance: "$7,754.03",
      type: "Transfer",
      category: "Payments",
      paymentSource: {
        name: "Checking Account",
        logoUrl: findLogo("chase")
      },
      paymentDestination: {
        name: "Lulu",
        logoUrl: undefined
      },
      securityIndicator: "Verified",
      privacyIndicator: "Private",
      metadata: {
        inputSource: "Automatic",
        inputTime: new Date().toISOString(),
        creator: "Extension"
      },
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
  // Sample transaction data based on the reference image
  const sampleTransactions = [
    {
      date: "Mar 03, 2025",
      description: "INTERAC ETRNSFR SENT LULU 202506015341KAYPVG",
      moneyOut: "$90.00",
      moneyIn: undefined,
      balance: "$7,754.03"
    },
    {
      date: "Feb 21, 2025",
      description: "BRANCH BILL PAYMENT BRANCH 0389 FLYWIRE",
      moneyOut: "$6,139.00",
      moneyIn: undefined,
      balance: "$7,844.03"
    },
    {
      date: "Feb 20, 2025",
      description: "GOODLIFE CLUBS MSP/DIV",
      moneyOut: "$45.19",
      moneyIn: undefined,
      balance: "$13,983.03"
    },
    {
      date: "Feb 18, 2025",
      description: "TF 3933#3607-829",
      moneyOut: "$808.00",
      moneyIn: undefined,
      balance: "$14,028.22"
    },
    {
      date: "Feb 18, 2025",
      description: "TF 3933#3607-829",
      moneyOut: "$160.00",
      moneyIn: undefined,
      balance: "$14,836.22"
    },
    {
      date: "Feb 18, 2025",
      description: "HANDLING CHG 768332",
      moneyOut: "$16.00",
      moneyIn: undefined,
      balance: "$14,996.22"
    },
    {
      date: "Feb 18, 2025",
      description: "INCOMING WIRE PAYMENT TW, KAO SHENG WEN",
      moneyOut: undefined,
      moneyIn: "$14,985.00",
      balance: "$15,012.22"
    },
    {
      date: "Feb 18, 2025",
      description: "RECURRING PYMNT 17FEB2025APPLE.COM/BILL ON",
      moneyOut: "$1.12",
      moneyIn: undefined,
      balance: "$27.22"
    },
    {
      date: "Feb 18, 2025",
      description: "TF 000519123022775845",
      moneyOut: "$189.11",
      moneyIn: undefined,
      balance: "$28.34"
    },
    {
      date: "Feb 18, 2025",
      description: "TF 3933#3607-829",
      moneyOut: undefined,
      moneyIn: "$100.00",
      balance: "$217.45"
    }
  ];
  
  // Select a random transaction from our sample data
  const randomTransaction = sampleTransactions[Math.floor(Math.random() * sampleTransactions.length)];
  
  // Classify transaction type based on description
  let type = "Purchase";
  if (randomTransaction.description.includes("ETRNSFR") || randomTransaction.description.includes("WIRE") || randomTransaction.description.includes("TF ")) {
    type = "Transfer";
  } else if (randomTransaction.description.includes("PAYMENT") || randomTransaction.description.includes("PYMNT")) {
    type = "Payment";
  } else if (randomTransaction.moneyIn && !randomTransaction.moneyOut) {
    type = "Deposit";
  }
  
  // Determine a category based on description
  let category = "Uncategorized";
  if (randomTransaction.description.includes("BILL")) {
    category = "Bills";
  } else if (randomTransaction.description.includes("CLUBS")) {
    category = "Entertainment";
  } else if (randomTransaction.description.includes("APPLE")) {
    category = "Subscriptions";
  } else if (type === "Transfer") {
    category = "Transfers";
  } else if (type === "Deposit") {
    category = "Income";
  }
  
  return {
    ...randomTransaction,
    type,
    category,
    paymentSource: {
      name: `${bankName} Account`,
      logoUrl: findLogo(bankName)
    },
    paymentDestination: randomTransaction.moneyOut ? {
      name: randomTransaction.description.split(' ')[0],
      logoUrl: findLogo(randomTransaction.description.split(' ')[0])
    } : undefined,
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
