
import { Transaction } from '@/utils/parseTransaction';
import { 
  Download,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

interface TransactionDetailsProps {
  transactions: Transaction[];
}

const TransactionDetails = ({ transactions }: TransactionDetailsProps) => {
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    // If already formatted like "Feb 18, 2025", just return it
    if (/[A-Za-z]{3}\s\d{1,2},\s\d{4}/.test(dateString)) {
      return dateString;
    }
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleDownloadCSV = () => {
    // Create CSV content
    const headers = ["Date", "Description", "Money Out", "Money In", "Balance"];
    const csvRows = [headers];
    
    // Add transaction data
    transactions.forEach(transaction => {
      const row = [
        formatDate(transaction.date),
        transaction.description,
        transaction.moneyOut || "",
        transaction.moneyIn || "",
        transaction.balance
      ];
      csvRows.push(row);
    });
    
    // Convert to CSV string
    const csvContent = csvRows
      .map(row => row
        .map(cell => 
          // Handle commas in description by wrapping in quotes
          typeof cell === 'string' && cell.includes(',') 
            ? `"${cell.replace(/"/g, '""')}"` 
            : cell
        )
        .join(',')
      )
      .join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transaction_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    toast({
      title: "CSV Download",
      description: "Downloading all transaction history as CSV",
      variant: "default",
    });
    
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "All transactions have been downloaded as CSV",
        variant: "default",
      });
    }, 1500);
  };
  
  const handleSendToSavi = () => {
    window.open('https://forecasting.financesavi.com/', '_blank');
    
    toast({
      title: "Redirecting",
      description: "Opening Savi Finance in a new tab",
      variant: "default",
    });
  };
  
  return (
    <div className="w-full animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      
      <div className="overflow-x-auto mb-14">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3 border-b border-gray-200 text-gray-600 font-medium text-sm">Date</th>
              <th className="p-3 border-b border-gray-200 text-gray-600 font-medium text-sm">Description</th>
              <th className="p-3 border-b border-gray-200 text-gray-600 font-medium text-sm text-right">Money Out</th>
              <th className="p-3 border-b border-gray-200 text-gray-600 font-medium text-sm text-right">Money In</th>
              <th className="p-3 border-b border-gray-200 text-gray-600 font-medium text-sm text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-200 text-sm">{formatDate(transaction.date)}</td>
                <td className="p-3 border-b border-gray-200 text-sm max-w-[200px] truncate">{transaction.description}</td>
                <td className="p-3 border-b border-gray-200 text-sm text-red-600 text-right">{transaction.moneyOut || '-'}</td>
                <td className="p-3 border-b border-gray-200 text-sm text-green-600 text-right">{transaction.moneyIn || '-'}</td>
                <td className="p-3 border-b border-gray-200 text-sm text-right">{transaction.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex gap-3 mt-4 justify-between">
        <Button 
          className="flex items-center justify-center gap-2 text-sm bg-[#4339CA] hover:bg-[#3730A3] text-white rounded-full px-4 py-2"
          onClick={handleDownloadCSV}
        >
          <Download className="w-3.5 h-3.5" />
          Download as CSV
        </Button>
        
        <Button 
          className="flex items-center justify-center gap-2 text-sm bg-black hover:bg-gray-800 text-white rounded-full px-4 py-2"
          onClick={handleSendToSavi}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Send to Savi Finance
        </Button>
      </div>
    </div>
  );
};

export default TransactionDetails;
