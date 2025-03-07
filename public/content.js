
// This script runs in the context of bank websites

/**
 * Parses transaction data from bank pages
 * @returns {Array} Array of transaction objects
 */
function parsePageTransactions() {
  console.log("Savi Finance: Scanning page for transaction data...");
  
  // Find tables on the page
  const tables = document.querySelectorAll('table');
  const transactions = [];
  
  tables.forEach(table => {
    // Check if this table has the headers we're looking for
    const headers = Array.from(table.querySelectorAll('th, thead td')).map(th => th.textContent.trim().toLowerCase());
    
    // Check if the table has the columns we need (date, description, amounts, balance)
    const hasDate = headers.some(h => h.includes('date'));
    const hasDescription = headers.some(h => h.includes('description') || h.includes('details') || h.includes('transaction'));
    const hasAmount = headers.some(h => 
      h.includes('amount') || h.includes('debit') || h.includes('credit') || 
      h.includes('money in') || h.includes('money out') || h.includes('withdrawal') || h.includes('deposit')
    );
    const hasBalance = headers.some(h => h.includes('balance'));
    
    if (hasDate && hasDescription && hasAmount) {
      // This looks like a transaction table
      const rows = table.querySelectorAll('tbody tr');
      
      rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        if (cells.length < 3) return; // Skip rows with too few cells
        
        // Find the indices for each column based on headers
        const dateIdx = headers.findIndex(h => h.includes('date'));
        const descIdx = headers.findIndex(h => h.includes('description') || h.includes('details') || h.includes('transaction'));
        
        // Money out/in might be in the same column or separate
        const outIdx = headers.findIndex(h => h.includes('money out') || h.includes('debit') || h.includes('withdrawal'));
        const inIdx = headers.findIndex(h => h.includes('money in') || h.includes('credit') || h.includes('deposit'));
        
        // Some banks use a single amount column with positive/negative values
        const amountIdx = headers.findIndex(h => h.includes('amount'));
        
        const balanceIdx = headers.findIndex(h => h.includes('balance'));
        
        // Extract data
        const date = cells[dateIdx >= 0 ? dateIdx : 0]?.textContent.trim();
        const description = cells[descIdx >= 0 ? descIdx : 1]?.textContent.trim();
        
        let moneyOut, moneyIn;
        
        if (outIdx >= 0 && inIdx >= 0) {
          // Separate columns for money out/in
          moneyOut = cells[outIdx]?.textContent.trim();
          moneyIn = cells[inIdx]?.textContent.trim();
        } else if (amountIdx >= 0) {
          // Single amount column
          const amount = cells[amountIdx]?.textContent.trim();
          const amountValue = parseFloat(amount.replace(/[^0-9.-]+/g, ''));
          
          if (amountValue < 0) {
            moneyOut = amount;
          } else {
            moneyIn = amount;
          }
        }
        
        const balance = cells[balanceIdx >= 0 ? balanceIdx : cells.length - 1]?.textContent.trim();
        
        // Only add if we have valid data
        if (date && description) {
          transactions.push({
            date,
            description,
            moneyOut: moneyOut || undefined,
            moneyIn: moneyIn || undefined,
            balance: balance || "",
            metadata: {
              inputSource: "Automatic",
              inputTime: new Date().toISOString()
            }
          });
        }
      });
    }
  });
  
  console.log(`Savi Finance: Found ${transactions.length} transactions`);
  return transactions;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "parseTransactions") {
    const transactions = parsePageTransactions();
    sendResponse({ success: true, transactions });
  }
  return true; // Required to use sendResponse asynchronously
});

console.log("Savi Finance Transaction Parser initialized");
