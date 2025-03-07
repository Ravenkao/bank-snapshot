
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  AlertCircle, 
  CheckCircle2
} from 'lucide-react';
import { Transaction, parseTransactionFromPage } from '@/utils/parseTransaction';
import TransactionDetails from './TransactionDetails';
import { useToast } from "@/components/ui/use-toast";

const TransactionParser = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExtension, setIsExtension] = useState(false);
  const { toast } = useToast();

  // Check if running as Chrome extension
  useEffect(() => {
    setIsExtension(typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id);
  }, []);

  const handleParseTransaction = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // If running as extension, use chrome APIs to parse the current page
      const results = await parseTransactionFromPage();
      
      if (results && results.length > 0) {
        setTransactions(results);
        toast({
          title: "Transactions parsed",
          description: `Successfully extracted ${results.length} transaction details`,
          variant: "default",
        });
      } else {
        setError("No transaction data found on this page");
        toast({
          title: "Parsing failed",
          description: "No transaction data found on this page",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error parsing transactions:", err);
      setError("Failed to parse transaction data");
      toast({
        title: "Error",
        description: "Failed to parse transaction data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetTransaction = () => {
    setTransactions([]);
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 animate-fade-in">
      {transactions.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Transaction History</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetTransaction}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
          
          <TransactionDetails transactions={transactions} />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center mb-2">
              <img 
                src="/lovable-uploads/267b7482-a65c-4de2-a9dc-052f913e68fd.png" 
                alt="Savi Finance Logo" 
                className="h-24 w-auto"
              />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Transaction Parser</h1>
            <p className="text-muted-foreground text-balance">
              Extract and analyze your bank transaction history with a single click
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              className="w-full h-12 text-base shadow-sm"
              onClick={handleParseTransaction}
              disabled={isLoading}
            >
              {isLoading ? "Parsing..." : "Parse Transactions"}
            </Button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-700 animate-slide-up">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Parsing Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2 text-blue-700 animate-fade-in">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">How It Works</p>
              <p className="text-sm">
                {isExtension 
                  ? "Navigate to your bank's transaction page, then click 'Parse Transactions' to extract the data." 
                  : "This extension works on bank websites like Chase, Bank of America, Wells Fargo, and more."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionParser;
