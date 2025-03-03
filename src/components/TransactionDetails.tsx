
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
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionDetailsProps {
  transaction: Transaction;
}

const TransactionDetails = ({ transaction }: TransactionDetailsProps) => {
  const [showMetadata, setShowMetadata] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="w-full p-5 bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="chip bg-blue-50 text-blue-700 mb-2">
            {transaction.type}
          </div>
          <h2 className="text-xl font-semibold">{transaction.amount}</h2>
        </div>
        
        {transaction.category && (
          <div className="chip bg-gray-100 text-gray-700">
            {transaction.category}
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {/* Date & Recurrence */}
        <div className="transaction-row">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="transaction-label">Date</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="transaction-value">{formatDate(transaction.date)}</span>
            {transaction.recurrence && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Repeat className="w-3 h-3" />
                {transaction.recurrence}
              </div>
            )}
          </div>
        </div>
        
        {/* Payment Source */}
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
        
        {/* Payment Destination */}
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
        
        {/* Description */}
        {transaction.description && (
          <div className="transaction-row">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="transaction-label">Description</span>
            </div>
            <span className="transaction-value">{transaction.description}</span>
          </div>
        )}
        
        {/* Tags */}
        {transaction.tag && (
          <div className="transaction-row">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="transaction-label">Tag</span>
            </div>
            <div className="chip bg-purple-50 text-purple-700">{transaction.tag}</div>
          </div>
        )}
        
        {/* Indicators Row */}
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
        
        {/* Exclude from Insights */}
        <div className="transaction-row">
          <div className="flex items-center gap-2">
            <ToggleLeft className="w-4 h-4 text-gray-400" />
            <span className="transaction-label">Exclude from Insights</span>
          </div>
          <span className="transaction-value">
            {transaction.excludeFromInsights ? "Yes" : "No"}
          </span>
        </div>
        
        {/* Metadata Toggle */}
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-between text-gray-500 text-sm"
          onClick={() => setShowMetadata(!showMetadata)}
        >
          <span>Metadata</span>
          {showMetadata ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
        
        {/* Metadata Section */}
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
    </div>
  );
};

export default TransactionDetails;
