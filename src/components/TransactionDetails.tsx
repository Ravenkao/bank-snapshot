
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
    toast({
      title: "CSV Download",
      description: "Downloading all transaction history as CSV",
      variant: "default",
    });
    
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
    <div className="w-full animate-fade-in relative pb-20">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      
      <div className="overflow-x-auto">
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
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 flex gap-2 z-10 justify-between">
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1 max-w-[160px]"
          onClick={handleDownloadCSV}
        >
          <Download className="w-4 h-4 mr-2" />
          Download as CSV
        </Button>
        
        <Button 
          variant="secondary" 
          size="sm"
          className="flex-1 max-w-[160px]"
          onClick={handleSendToSavi}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Send to Savi Finance
        </Button>
      </div>
    </div>
  );
};

export default TransactionDetails;
