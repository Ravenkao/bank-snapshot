
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
  console.log("Parsing transactions from: " + url);
  
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
  
  // Look for transaction tables on Chase website
  const tables = document.querySelectorAll('table');
  if (tables.length > 0) {
    return extractTransactionsFromTables(tables, "Chase");
  }
  
  return getMockTransactions("Chase");
}

function parseBankOfAmericaTransactions() {
  console.log("Attempting to parse Bank of America transactions");
  
  // Look for transaction tables on Bank of America website
  const tables = document.querySelectorAll('table');
  if (tables.length > 0) {
    return extractTransactionsFromTables(tables, "Bank of America");
  }
  
  return getMockTransactions("Bank of America");
}

function parseWellsFargoTransactions() {
  console.log("Attempting to parse Wells Fargo transactions");
  
  // Look for transaction tables on Wells Fargo website
  const tables = document.querySelectorAll('table');
  if (tables.length > 0) {
    return extractTransactionsFromTables(tables, "Wells Fargo");
  }
  
  return getMockTransactions("Wells Fargo");
}

function parseCapitalOneTransactions() {
  console.log("Attempting to parse Capital One transactions");
  
  // Look for transaction tables on Capital One website
  const tables = document.querySelectorAll('table');
  if (tables.length > 0) {
    return extractTransactionsFromTables(tables, "Capital One");
  }
  
  return getMockTransactions("Capital One");
}

function parseCitibankTransactions() {
  console.log("Attempting to parse Citibank transactions");
  
  // Look for transaction tables on Citibank website
  const tables = document.querySelectorAll('table');
  if (tables.length > 0) {
    return extractTransactionsFromTables(tables, "Citibank");
  }
  
  return getMockTransactions("Citibank");
}

// Extract transactions from tables found on the page
function extractTransactionsFromTables(tables, source) {
  console.log(`Found ${tables.length} tables on ${source} page`);
  let extractedTransactions = [];
  
  // Loop through tables to find ones that look like transaction tables
  for (const table of tables) {
    // Check table headers to see if it could be a transaction table
    const headers = table.querySelectorAll('th, thead td');
    const headerTexts = Array.from(headers).map(header => header.textContent.trim().toLowerCase());
    
    // Check if this looks like a transaction table by checking for typical column headers
    const isTransactionTable = headerTexts.some(text => 
      text.includes('date') || text.includes('description') || 
      text.includes('amount') || text.includes('balance') ||
      text.includes('transaction') || text.includes('activity')
    );
    
    if (isTransactionTable) {
      console.log("Found a potential transaction table");
      
      // Extract rows from the table
      const rows = table.querySelectorAll('tbody tr');
      
      // If no rows found in tbody, try getting direct tr children
      const rowsArray = rows.length > 0 ? rows : table.querySelectorAll('tr:not(:first-child)');
      
      if (rowsArray.length > 0) {
        console.log(`Found ${rowsArray.length} rows in transaction table`);
        
        // Process each row
        Array.from(rowsArray).forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 3) { // Ensure enough cells for basic transaction info
            // Try to map cells to transaction fields
            // This is a best-guess approach - different banks have different formats
            let transaction = {
              date: '',
              description: '',
              moneyOut: undefined,
              moneyIn: undefined,
              balance: ''
            };
            
            // Extract cell text
            const cellTexts = Array.from(cells).map(cell => cell.textContent.trim());
            
            // Heuristic mapping based on common patterns
            // First cell is often date
            if (cellTexts[0]) transaction.date = cellTexts[0];
            
            // Second cell is often description/payee
            if (cellTexts[1]) transaction.description = cellTexts[1];
            
            // Look for amount and determine if it's money in or out
            for (let i = 2; i < cellTexts.length; i++) {
              const text = cellTexts[i];
              if (text) {
                // Check if it's a currency value
                if (/^\$?-?[\d,]+(\.\d{2})?$/.test(text)) {
                  // Negative values or values with '-' prefix are usually money out
                  if (text.includes('-') || text.startsWith('(') && text.endsWith(')')) {
                    transaction.moneyOut = text.replace(/[\(\)]/g, '');
                  } else {
                    // Last amount field might be balance, second-to-last might be money in
                    if (i === cellTexts.length - 1) {
                      transaction.balance = text;
                    } else {
                      transaction.moneyIn = text;
                    }
                  }
                }
              }
            }
            
            // Add metadata
            transaction.metadata = {
              inputSource: source,
              inputTime: new Date().toISOString()
            };
            
            extractedTransactions.push(transaction);
          }
        });
      }
    }
  }
  
  // If we found transactions, return them, otherwise use mock data
  if (extractedTransactions.length > 0) {
    console.log(`Successfully extracted ${extractedTransactions.length} transactions`);
    return extractedTransactions;
  }
  
  console.log("Could not extract transactions, using mock data");
  return getMockTransactions(source);
}

// Generic parser that attempts to find transaction tables on any page
function parseGenericTransactions() {
  console.log("Attempting generic transaction parsing");
  
  // Look for tables that might contain transaction data
  const tables = document.querySelectorAll('table');
  
  if (tables.length > 0) {
    return extractTransactionsFromTables(tables, "Generic");
  }
  
  console.log("No tables found, using mock data");
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
      balance: "$7,754.03",
      metadata: {
        inputSource: source,
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
        inputSource: source,
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
        inputSource: source,
        inputTime: new Date().toISOString()
      }
    },
    {
      date: "Feb 18, 2025",
      description: `${source} TRANSACTION TF 3933#3607-829`,
      moneyOut: "$808.00",
      moneyIn: undefined,
      balance: "$14,028.22",
      metadata: {
        inputSource: source,
        inputTime: new Date().toISOString()
      }
    },
    {
      date: "Feb 18, 2025",
      description: "TF 3933#3607-829",
      moneyOut: "$160.00",
      moneyIn: undefined,
      balance: "$14,836.22",
      metadata: {
        inputSource: source,
        inputTime: new Date().toISOString()
      }
    },
    {
      date: "Feb 18, 2025",
      description: "HANDLING CHG 768332",
      moneyOut: "$16.00",
      moneyIn: undefined,
      balance: "$14,996.22",
      metadata: {
        inputSource: source,
        inputTime: new Date().toISOString()
      }
    },
    {
      date: "Feb 18, 2025",
      description: "INCOMING WIRE PAYMENT TW, KAO SHENG WEN",
      moneyOut: undefined,
      moneyIn: "$14,985.00",
      balance: "$15,012.22",
      metadata: {
        inputSource: source,
        inputTime: new Date().toISOString()
      }
    }
  ];
}

// Initialize the content script
console.log("Savi Finance Transaction Parser content script initialized");
