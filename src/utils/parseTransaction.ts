
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

// Check if running in Chrome extension environment - safely check for Chrome API
const isChromeExtension = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof chrome !== 'undefined' && 
         typeof chrome.runtime !== 'undefined' && 
         typeof chrome.runtime.id !== 'undefined';
};

/**
 * Parse transaction data from the current active tab using content script
 */
export const parseTransactionFromPage = async (): Promise<Transaction[]> => {
  try {
    // If not in a Chrome extension environment, use mock data
    if (!isChromeExtension()) {
      console.log("Not running in Chrome extension, using mock data");
      await new Promise(resolve => setTimeout(resolve, 1500));
      return getMockTransactions();
    }
    
    console.log("Running in Chrome extension environment, attempting to parse transactions");
    
    // Get the active tab - safe access to Chrome API
    const getActiveTab = async () => {
      try {
        return await chrome.tabs.query({ active: true, currentWindow: true });
      } catch (error) {
        console.error("Error accessing chrome.tabs API:", error);
        return [];
      }
    };
    
    const tabs = await getActiveTab();
    const tab = tabs[0];
    
    if (!tab || !tab.id) {
      console.error("No active tab found");
      return getMockTransactions();
    }
    
    // Check if we're on a supported website
    const url = tab.url || '';
    const isBankSite = /bank|chase|wellsfargo|citibank|capitalone/i.test(url);
    
    if (!isBankSite) {
      console.log("Not a bank website, using mock data");
      // If not on a bank site, use sample data for demonstration
      return getMockTransactions();
    }
    
    // Check if the content script is already injected
    try {
      // First, try communicating with the content script
      return new Promise((resolve) => {
        console.log("Attempting to communicate with existing content script");
        
        chrome.tabs.sendMessage(tab.id!, { action: "parseTransactions" }, (response) => {
          // If there's no error but no response, we need to inject the content script
          if (chrome.runtime.lastError) {
            console.warn("Content script not ready:", chrome.runtime.lastError);
            
            // Inject the content script
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id! },
                files: ["content.js"]
              },
              () => {
                if (chrome.runtime.lastError) {
                  console.error("Failed to inject content script:", chrome.runtime.lastError);
                  resolve(getMockTransactions());
                  return;
                }
                
                // Now try to communicate with the newly injected content script
                setTimeout(() => {
                  chrome.tabs.sendMessage(tab.id!, { action: "parseTransactions" }, (newResponse) => {
                    if (chrome.runtime.lastError || !newResponse) {
                      console.error("Error after injection:", chrome.runtime.lastError);
                      resolve(getMockTransactions());
                      return;
                    }
                    
                    if (newResponse.success && newResponse.transactions.length > 0) {
                      resolve(newResponse.transactions);
                    } else {
                      console.log("No transactions found or error in content script after injection");
                      resolve(getMockTransactions());
                    }
                  });
                }, 500); // Give the content script a moment to initialize
              }
            );
          } else if (response && response.success && response.transactions.length > 0) {
            // Content script is already injected and returned transactions
            resolve(response.transactions);
          } else {
            console.log("Content script returned no transactions");
            resolve(getMockTransactions());
          }
        });
      });
    } catch (error) {
      console.error("Error in chrome messaging:", error);
      return getMockTransactions();
    }
  } catch (error) {
    console.error("Error parsing transactions:", error);
    return getMockTransactions();
  }
};

// Get mock transaction data
const getMockTransactions = (): Transaction[] => {
  // Sample transaction data
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
      inputSource: "Demo",
      inputTime: new Date().toISOString()
    }
  }));
};

// Function to simulate parsing from different banks
export const parseTransactionFromBank = (bankName: string): Transaction[] => {
  // Return mock transactions with the bank name in the metadata
  return getMockTransactions().map(transaction => ({
    ...transaction,
    metadata: {
      inputSource: bankName,
      inputTime: new Date().toISOString()
    }
  }));
};
