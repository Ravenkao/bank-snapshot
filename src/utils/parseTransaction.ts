
export interface Transaction {
  date: string;
  description: string;
  moneyOut?: string;
  moneyIn?: string;
  balance: string;
  metadata: {
    inputSource: string;
    inputTime: string;
  };
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
 * In a real browser extension, this would inject a script to find and extract 
 * transaction tables from the page DOM
 */
export const parseTransactionFromPage = async (): Promise<Transaction[]> => {
  try {
    // This is a simulation of what would happen in a real extension
    // The extension would look for tables containing headers like Date, Description, etc.
    
    // In a real implementation, we would:
    // 1. Look for all tables in the DOM
    // 2. For each table, check if headers contain keywords like 'Date', 'Description', 'Money out', etc.
    // 3. If a matching table is found, extract row data into Transaction objects
    
    // For demonstration purposes, we'll return mock data
    
    // Simulate a short delay to make it feel like we're parsing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return [
      {
        date: "Mar 03, 2025",
        description: "INTERAC ETRNSFR SENT LULU 202506015341KAYPVG",
        moneyOut: "$90.00",
        moneyIn: undefined,
        balance: "$7,754.03",
        metadata: {
          inputSource: "Automatic",
          inputTime: new Date().toISOString()
        }
      },
      {
        date: "Feb 21, 2025",
        description: "BRANCH BILL PAYMENT BRANCH 0389 FLYWIRE",
        moneyOut: "$6,139.00",
        moneyIn: undefined,
        balance: "$7,844.03",
        metadata: {
          inputSource: "Automatic",
          inputTime: new Date().toISOString()
        }
      },
      {
        date: "Feb 20, 2025",
        description: "GOODLIFE CLUBS MSP/DIV",
        moneyOut: "$45.19",
        moneyIn: undefined,
        balance: "$13,983.03",
        metadata: {
          inputSource: "Automatic",
          inputTime: new Date().toISOString()
        }
      }
    ];
  } catch (error) {
    console.error("Error parsing transactions:", error);
    return [];
  }
};

// Function to simulate parsing from different banks
export const parseTransactionFromBank = (bankName: string): Transaction[] => {
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
  
  // Return all transactions with added metadata
  return sampleTransactions.map(transaction => ({
    ...transaction,
    metadata: {
      inputSource: "Manual",
      inputTime: new Date().toISOString()
    }
  }));
};
