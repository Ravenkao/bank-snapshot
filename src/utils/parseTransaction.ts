
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
 * Parse transaction data from the current active tab using content script
 */
export const parseTransactionFromPage = async (): Promise<Transaction[]> => {
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.id) {
      console.error("No active tab found");
      return [];
    }
    
    // Check if we're on a supported website
    const url = tab.url || '';
    const isBankSite = /bank|chase|wellsfargo|citibank|capitalone/i.test(url);
    
    if (!isBankSite) {
      console.log("Not a bank website, using mock data");
      // If not on a bank site, use sample data for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return [
        {
          date: "Mar 03, 2025",
          description: "INTERAC ETRNSFR SENT LULU 202506015341KAYPVG",
          moneyOut: "$90.00",
          moneyIn: undefined,
          balance: "$7,754.03",
          metadata: {
            inputSource: "Demo",
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
            inputSource: "Demo",
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
            inputSource: "Demo",
            inputTime: new Date().toISOString()
          }
        }
      ];
    }
    
    // Execute content script to parse transactions
    console.log("Sending message to content script");
    
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id!, { action: "parseTransactions" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error communicating with content script:", chrome.runtime.lastError);
          resolve([]);
          return;
        }
        
        if (response && response.success && response.transactions.length > 0) {
          resolve(response.transactions);
        } else {
          console.log("No transactions found or error in content script");
          resolve([]);
        }
      });
    });
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
