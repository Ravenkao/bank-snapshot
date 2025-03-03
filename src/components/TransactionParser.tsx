
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  Bank
} from 'lucide-react';
import { Transaction, parseTransactionFromPage, parseTransactionFromBank } from '@/utils/parseTransaction';
import TransactionDetails from './TransactionDetails';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

const TransactionParser = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleParseTransaction = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real extension, this would inject a script to parse the current page
      const result = await parseTransactionFromPage();
      
      if (result) {
        setTransaction(result);
        toast({
          title: "Transaction parsed",
          description: "Successfully extracted transaction details",
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
      console.error("Error parsing transaction:", err);
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
  
  const handleDemoBank = (bankName: string) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate network delay
    setTimeout(() => {
      try {
        const result = parseTransactionFromBank(bankName);
        
        if (result) {
          setTransaction(result);
          toast({
            title: "Demo transaction loaded",
            description: `Loaded sample transaction from ${bankName}`,
            variant: "default",
          });
        } else {
          setError(`Failed to load demo data for ${bankName}`);
        }
      } catch (err) {
        console.error("Error loading demo data:", err);
        setError("Failed to load demo data");
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };
  
  const resetTransaction = () => {
    setTransaction(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 animate-fade-in">
      {transaction ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Transaction Details</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetTransaction}
              className="text-gray-500 hover:text-gray-700"
            >
              Parse Another
            </Button>
          </div>
          
          <TransactionDetails transaction={transaction} />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-foreground mb-2">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Transaction Parser</h1>
            <p className="text-muted-foreground text-balance">
              Extract and analyze your bank transaction information with a single click
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              className="w-full h-12 text-base shadow-sm"
              onClick={handleParseTransaction}
              disabled={isLoading}
            >
              {isLoading ? "Parsing..." : "Parse Transaction"}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or try a demo
                </span>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-between"
                  disabled={isLoading}
                >
                  <div className="flex items-center gap-2">
                    <Bank className="h-4 w-4" />
                    <span>Select Demo Bank</span>
                  </div>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[240px]">
                <DropdownMenuItem onClick={() => handleDemoBank("Chase")}>
                  Chase Bank
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDemoBank("Bank of America")}>
                  Bank of America
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDemoBank("Wells Fargo")}>
                  Wells Fargo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDemoBank("Capital One")}>
                  Capital One
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <p className="text-sm">Navigate to your bank's transaction page, then click "Parse Transaction" to extract details.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionParser;
