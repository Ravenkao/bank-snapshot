
// Bank Transaction Parser Content Script

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "parseTransactions") {
    console.log("Content script received request to parse transactions");
    
    try {
      const transactions = parseTransactionsFromPage();
      sendResponse({ 
        success: true, 
        transactions 
      });
    } catch (error) {
      console.error("Error parsing transactions:", error);
      sendResponse({ 
        success: false, 
        error: error.message 
      });
    }
  }
  
  // Important: Return true to indicate we'll respond asynchronously
  return true;
});

// Main function to parse transactions from the current page
function parseTransactionsFromPage() {
  const url = window.location.href.toLowerCase();
  
  // Detect which bank site we're on and use the appropriate parser
  if (url.includes('chase.com')) {
    return parseChaseTransactions();
  } else if (url.includes('bankofamerica.com')) {
    return parseBankOfAmericaTransactions();
  } else if (url.includes('wellsfargo.com')) {
    return parseWellsFargoTransactions();
  } else if (url.includes('capitalone.com')) {
    return parseCapitalOneTransactions();
  } else if (url.includes('citibank.com')) {
    return parseCitibankTransactions();
  } else {
    // Generic parser as fallback
    return parseGenericTransactions();
  }
}

// Bank-specific parsers
function parseChaseTransactions() {
  console.log("Attempting to parse Chase transactions");
  // Chase-specific transaction parsing logic would go here
  // This is just a placeholder that returns mock data
  return getMockTransactions("Chase");
}

function parseBankOfAmericaTransactions() {
  console.log("Attempting to parse Bank of America transactions");
  // Bank of America-specific transaction parsing logic would go here
  return getMockTransactions("Bank of America");
}

function parseWellsFargoTransactions() {
  console.log("Attempting to parse Wells Fargo transactions");
  // Wells Fargo-specific transaction parsing logic would go here
  return getMockTransactions("Wells Fargo");
}

function parseCapitalOneTransactions() {
  console.log("Attempting to parse Capital One transactions");
  // Capital One-specific transaction parsing logic would go here
  return getMockTransactions("Capital One");
}

function parseCitibankTransactions() {
  console.log("Attempting to parse Citibank transactions");
  // Citibank-specific transaction parsing logic would go here
  return getMockTransactions("Citibank");
}

// Generic parser that attempts to find transaction tables on any page
function parseGenericTransactions() {
  console.log("Attempting generic transaction parsing");
  
  // Look for tables that might contain transaction data
  const tables = document.querySelectorAll('table');
  let transactions = [];
  
  // If no tables found, return mock data
  if (tables.length === 0) {
    console.log("No tables found, using mock data");
    return getMockTransactions("Generic");
  }
  
  // Return mock data for now
  // In a real implementation, this would analyze the page content
  return getMockTransactions("Generic");
}

// Helper function to generate mock transactions for testing
function getMockTransactions(source) {
  return [
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
      description: `${source} TRANSACTION TF 3933#3607-829`,
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
    }
  ].map(transaction => ({
    ...transaction,
    metadata: {
      inputSource: source,
      inputTime: new Date().toISOString()
    }
  }));
}
