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

export interface TFSAAccount {
  accountName: string;
  accountType: string;
  balance: string;
  contributionRoom?: string;
  yearToDateReturn?: string;
  totalReturn?: string;
}

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
  "grubhub": "https://logo.clearbit.com/grubhub.com",
  "wealthsimple": "https://logo.clearbit.com/wealthsimple.com"
};

export const findLogo = (name: string): string | undefined => {
  const lowerName = name.toLowerCase();
  
  if (logoMap[lowerName]) return logoMap[lowerName];
  
  for (const [key, url] of Object.entries(logoMap)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return url;
    }
  }
  
  return undefined;
};

const isChromeExtension = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof chrome !== 'undefined' && 
         typeof chrome.runtime !== 'undefined' && 
         typeof chrome.runtime.id !== 'undefined';
};

export const parseTransactionFromPage = async (): Promise<Transaction[]> => {
  try {
    if (!isChromeExtension()) {
      console.log("Not running in Chrome extension, using mock data");
      await new Promise(resolve => setTimeout(resolve, 1500));
      return isWealthsimplePage() ? getWealthsimpleMockTransactions() : getMockTransactions();
    }
    
    console.log("Running in Chrome extension environment, attempting to parse transactions");
    
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
    
    const url = tab.url || '';
    const isBankSite = /bank|chase|wellsfargo|citibank|capitalone/i.test(url);
    const isWealthsimple = /wealthsimple/i.test(url);
    
    if (!isBankSite && !isWealthsimple) {
      console.log("Not a supported website, using mock data");
      return getMockTransactions();
    }
    
    if (isWealthsimple) {
      console.log("Detected Wealthsimple site, parsing TFSA data");
      return new Promise((resolve) => {
        chrome.tabs.sendMessage(tab.id!, { action: "parseWealthsimpleTFSA" }, (response) => {
          if (chrome.runtime.lastError || !response) {
            console.warn("Content script not ready for Wealthsimple:", chrome.runtime.lastError);
            
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id! },
                files: ["content.js"]
              },
              () => {
                setTimeout(() => {
                  chrome.tabs.sendMessage(tab.id!, { action: "parseWealthsimpleTFSA" }, (newResponse) => {
                    if (chrome.runtime.lastError || !newResponse) {
                      console.error("Error after injection for Wealthsimple:", chrome.runtime.lastError);
                      resolve(getWealthsimpleMockTransactions());
                      return;
                    }
                    
                    if (newResponse.success && newResponse.transactions.length > 0) {
                      resolve(newResponse.transactions);
                    } else {
                      console.log("No TFSA data found or error in content script after injection");
                      resolve(getWealthsimpleMockTransactions());
                    }
                  });
                }, 500);
              }
            );
          } else if (response && response.success && response.transactions.length > 0) {
            resolve(response.transactions);
          } else {
            console.log("Content script returned no Wealthsimple TFSA data");
            resolve(getWealthsimpleMockTransactions());
          }
        });
      });
    }
    
    try {
      return new Promise((resolve) => {
        console.log("Attempting to communicate with existing content script");
        
        chrome.tabs.sendMessage(tab.id!, { action: "parseTransactions" }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn("Content script not ready:", chrome.runtime.lastError);
            
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
                }, 500);
              }
            );
          } else if (response && response.success && response.transactions.length > 0) {
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

const isWealthsimplePage = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.location.href.includes('wealthsimple.com');
};

const getMockTransactions = (): Transaction[] => {
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
  
  return sampleTransactions.map(transaction => ({
    ...transaction,
    metadata: {
      inputSource: "Demo",
      inputTime: new Date().toISOString()
    }
  }));
};

const getWealthsimpleMockTransactions = (): Transaction[] => {
  const sampleTransactions = [
    {
      date: "May 15, 2025",
      description: "TFSA Contribution",
      moneyIn: "$2,000.00",
      moneyOut: undefined,
      balance: "$12,000.00"
    },
    {
      date: "Apr 01, 2025",
      description: "Dividend Payment - VGRO",
      moneyIn: "$78.45",
      moneyOut: undefined,
      balance: "$10,000.00"
    },
    {
      date: "Mar 20, 2025",
      description: "Purchase - VFV (S&P 500 ETF)",
      moneyOut: "$500.00",
      moneyIn: undefined,
      balance: "$9,921.55"
    },
    {
      date: "Mar 01, 2025",
      description: "TFSA Contribution",
      moneyIn: "$1,500.00",
      moneyOut: undefined,
      balance: "$10,421.55"
    },
    {
      date: "Feb 15, 2025",
      description: "Dividend Payment - XIC",
      moneyIn: "$42.17",
      moneyOut: undefined,
      balance: "$8,921.55"
    },
    {
      date: "Jan 30, 2025",
      description: "Purchase - XEQT (All-Equity ETF)",
      moneyOut: "$800.00",
      moneyIn: undefined,
      balance: "$8,879.38"
    },
    {
      date: "Jan 05, 2025",
      description: "TFSA Contribution",
      moneyIn: "$1,000.00",
      moneyOut: undefined,
      balance: "$9,679.38"
    }
  ];
  
  return sampleTransactions.map(transaction => ({
    ...transaction,
    metadata: {
      inputSource: "Wealthsimple TFSA",
      inputTime: new Date().toISOString()
    }
  }));
};

export const getTFSAAccountInfo = async (): Promise<TFSAAccount[]> => {
  if (!isChromeExtension()) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        accountName: "TFSA Personal",
        accountType: "TFSA",
        balance: "$12,000.00",
        contributionRoom: "$13,500.00",
        yearToDateReturn: "8.2%",
        totalReturn: "12.5%"
      }
    ];
  }
  
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    
    if (!tab || !tab.id) {
      return [];
    }
    
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id!, { action: "getTFSAAccountInfo" }, (response) => {
        if (chrome.runtime.lastError || !response || !response.success) {
          resolve([]);
          return;
        }
        
        resolve(response.accounts);
      });
    });
  } catch (error) {
    console.error("Error getting TFSA account info:", error);
    return [];
  }
};

export const parseTransactionFromBank = (bankName: string): Transaction[] => {
  if (bankName.toLowerCase() === 'wealthsimple') {
    return getWealthsimpleMockTransactions().map(transaction => ({
      ...transaction,
      metadata: {
        inputSource: bankName,
        inputTime: new Date().toISOString()
      }
    }));
  }
  
  return getMockTransactions().map(transaction => ({
    ...transaction,
    metadata: {
      inputSource: bankName,
      inputTime: new Date().toISOString()
    }
  }));
};
