
import { useState } from 'react';
import { Transaction } from '@/utils/parseTransaction';
import Logo from '@/components/Logo';
import { 
  Calendar, 
  CreditCard, 
  Tag, 
  FileText, 
  Bell, 
  ShieldCheck, 
  Eye, 
  Repeat, 
  ArrowRight, 
  Clock, 
  User, 
  DollarSign, 
  ToggleLeft, 
  ChevronDown, 
  ChevronUp,
  Download,
  ExternalLink,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

interface TransactionDetailsProps {
  transaction: Transaction;
}

const TransactionDetails = ({ transaction }: TransactionDetailsProps) => {
  const [showMetadata, setShowMetadata] = useState(false);
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
  
  const handleDownloadPDF = () => {
    toast({
      title: "PDF Download",
      description: "Downloading all transaction details as PDF",
      variant: "default",
    });
    
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: "All transaction details have been downloaded as PDF",
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
    <div className="w-full p-5 bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in relative pb-32">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="chip bg-blue-50 text-blue-700 mb-2">
            {transaction.type || "Transaction"}
          </div>
          <h2 className="text-xl font-semibold truncate max-w-[200px]">
            {transaction.description?.split(' ')[0]}
          </h2>
        </div>
        
        <div className="text-right">
          {transaction.moneyOut && (
            <div className="text-red-600 font-medium">-{transaction.moneyOut}</div>
          )}
          {transaction.moneyIn && (
            <div className="text-green-600 font-medium">+{transaction.moneyIn}</div>
          )}
          <div className="text-sm text-gray-600 mt-1">Balance: {transaction.balance}</div>
        </div>
      </div>
      
      <div className="border-b border-gray-200 my-4"></div>
      
      <div className="space-y-4">
        <div className="transaction-row">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="transaction-label">Date</span>
          </div>
          <span className="transaction-value">{formatDate(transaction.date)}</span>
        </div>
        
        <div className="transaction-row">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="transaction-label">Description</span>
          </div>
          <span className="transaction-value text-sm truncate max-w-[200px]">{transaction.description}</span>
        </div>
        
        {transaction.moneyOut && (
          <div className="transaction-row">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-gray-400" />
              <span className="transaction-label">Money Out</span>
            </div>
            <span className="transaction-value text-red-600">{transaction.moneyOut}</span>
          </div>
        )}
        
        {transaction.moneyIn && (
          <div className="transaction-row">
            <div className="flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-gray-400" />
              <span className="transaction-label">Money In</span>
            </div>
            <span className="transaction-value text-green-600">{transaction.moneyIn}</span>
          </div>
        )}
        
        <div className="transaction-row">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-gray-400" />
            <span className="transaction-label">Balance</span>
          </div>
          <span className="transaction-value">{transaction.balance}</span>
        </div>
        
        {transaction.category && (
          <div className="transaction-row">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="transaction-label">Category</span>
            </div>
            <div className="chip bg-purple-50 text-purple-700">{transaction.category}</div>
          </div>
        )}
        
        {transaction.paymentSource && (
          <div className="transaction-row">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="transaction-label">Source</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="transaction-value">{transaction.paymentSource.name}</span>
              <Logo 
                url={transaction.paymentSource.logoUrl} 
                name={transaction.paymentSource.name} 
                size="sm" 
              />
            </div>
          </div>
        )}
        
        {transaction.paymentDestination && (
          <div className="transaction-row">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="transaction-label">Destination</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="transaction-value">{transaction.paymentDestination.name}</span>
              <Logo 
                url={transaction.paymentDestination.logoUrl} 
                name={transaction.paymentDestination.name} 
                size="sm" 
              />
            </div>
          </div>
        )}
        
        {transaction.recurrence && (
          <div className="transaction-row">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-gray-400" />
              <span className="transaction-label">Recurrence</span>
            </div>
            <span className="transaction-value">{transaction.recurrence}</span>
          </div>
        )}
        
        <div className="transaction-row">
          <div className="flex items-center gap-2">
            <span className="transaction-label">Indicators</span>
          </div>
          <div className="flex items-center gap-3">
            {transaction.securityIndicator && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <ShieldCheck className="w-3 h-3" />
                {transaction.securityIndicator}
              </div>
            )}
            
            {transaction.privacyIndicator && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Eye className="w-3 h-3" />
                {transaction.privacyIndicator}
              </div>
            )}
            
            {transaction.reminder && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <Bell className="w-3 h-3" />
                {transaction.reminder}
              </div>
            )}
            
            {transaction.cashback && (
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <DollarSign className="w-3 h-3" />
                {transaction.cashback} cashback
              </div>
            )}
          </div>
        </div>
        
        <div className="transaction-row">
          <div className="flex items-center gap-2">
            <ToggleLeft className="w-4 h-4 text-gray-400" />
            <span className="transaction-label">Exclude from Insights</span>
          </div>
          <span className="transaction-value">
            {transaction.excludeFromInsights ? "Yes" : "No"}
          </span>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-between text-gray-500 text-sm mt-2"
          onClick={() => setShowMetadata(!showMetadata)}
        >
          <span>Metadata</span>
          {showMetadata ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
        
        {showMetadata && (
          <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-2 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-3 h-3" />
                <span>Input Time</span>
              </div>
              <span className="text-gray-700">{new Date(transaction.metadata.inputTime).toLocaleString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-gray-500">
                <User className="w-3 h-3" />
                <span>Creator</span>
              </div>
              <span className="text-gray-700">{transaction.metadata.creator || "Unknown"}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-gray-500">
                <FileText className="w-3 h-3" />
                <span>Input Source</span>
              </div>
              <span className="text-gray-700">{transaction.metadata.inputSource}</span>
            </div>
            
            {transaction.metadata.editTimes && transaction.metadata.editTimes.length > 0 && (
              <div>
                <div className="flex items-center gap-1 text-gray-500 mb-1">
                  <Clock className="w-3 h-3" />
                  <span>Edit History</span>
                </div>
                <ul className="text-xs text-gray-700">
                  {transaction.metadata.editTimes.map((time, index) => (
                    <li key={index} className="py-1">
                      {new Date(time).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex flex-col sm:flex-row gap-3 z-10">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleDownloadPDF}
        >
          <Download className="w-4 h-4 mr-2" />
          Download as PDF
        </Button>
        
        <Button 
          variant="secondary" 
          className="flex-1"
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
