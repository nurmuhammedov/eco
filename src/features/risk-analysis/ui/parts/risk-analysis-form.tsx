import { riskAnalysisData } from '@/shared/constants/risk-analysis-data.ts';
import { Button } from '@/shared/components/ui/button.tsx';
import { Check, Minus } from 'lucide-react';
import { Input } from '@/shared/components/ui/input.tsx';

const RiskAnalysisForm = () => {
  return (
    <div>
      {riskAnalysisData.HF.map(item => {
        return <div key={item.title}>
          <div className="bg-[#EDEEEE] shadow-md p-2.5 rounded font-medium">
            {item.title} - <b>{item.point}</b> ball
          </div>
          <div className="flex py-5 px-2.5 gap-4">
            <div className="flex-grow">{item.description}</div>
            <div className="flex-shrink-0 flex gap-2  w-full max-w-[500px]">
              <Button className="flex-shrink-0" variant="outline" size="icon"><Check /></Button>
              <Button className="flex-shrink-0" variant="outline" size="icon"><Minus /></Button>
              <Input placeholder={item.rejectPlaceholder} />
            </div>
          </div>
        </div>;
      })}
    </div>
  );
};

export default RiskAnalysisForm;