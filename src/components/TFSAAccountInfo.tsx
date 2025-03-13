
import { TFSAAccount } from '@/utils/parseTransaction';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TFSAAccountInfoProps {
  accounts: TFSAAccount[];
}

const TFSAAccountInfo = ({ accounts }: TFSAAccountInfoProps) => {
  if (!accounts || accounts.length === 0) {
    return null;
  }

  return (
    <div className="w-full animate-fade-in mb-6">
      <h2 className="text-xl font-semibold mb-4">TFSA Account Summary</h2>
      
      {accounts.map((account, index) => (
        <Card key={index} className="p-4 mb-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
          <div className="mb-3 border-b pb-2">
            <h3 className="text-lg font-medium">{account.accountName}</h3>
            <p className="text-sm text-muted-foreground">{account.accountType}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-xl font-semibold text-green-600">{account.balance}</p>
            </div>
            
            {account.contributionRoom && (
              <div>
                <p className="text-sm text-muted-foreground">Contribution Room</p>
                <p className="text-lg font-medium">{account.contributionRoom}</p>
              </div>
            )}
            
            {account.yearToDateReturn && (
              <div>
                <p className="text-sm text-muted-foreground">YTD Return</p>
                <p className="text-lg font-medium">{account.yearToDateReturn}</p>
              </div>
            )}
            
            {account.totalReturn && (
              <div>
                <p className="text-sm text-muted-foreground">Total Return</p>
                <p className="text-lg font-medium">{account.totalReturn}</p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TFSAAccountInfo;
