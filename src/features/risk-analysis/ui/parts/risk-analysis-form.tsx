import { riskAnalysisData } from '@/shared/constants/risk-analysis-data.ts';
import { Button } from '@/shared/components/ui/button.tsx';
import { Check, Minus } from 'lucide-react';
import { Textarea } from '@/shared/components/ui/textarea.tsx';

const RiskAnalysisForm = () => {
  return (
    <div>
      {riskAnalysisData.ELEVATOR.map((item, idx) => {
        return (
          <div key={item.title}>
            <div className="bg-[#EDEEEE] shadow-md p-2.5 rounded font-medium">
              {idx + 1}. {item.title} - <b>{item.point}</b> ball
            </div>
            <div className="flex items-center py-5 px-2.5 gap-4">
              <div className="flex-grow">{item.title}</div>
              <div className="flex-shrink-0 flex gap-3  w-full max-w-[500px] items-center">
                <Button className="flex-shrink-0" variant="outline" size="icon">
                  <Check />
                </Button>
                <Button className="flex-shrink-0" variant="outline" size="icon">
                  <Minus />
                </Button>
                <Textarea className="resize-none" placeholder={item.rejectPlaceholder} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RiskAnalysisForm;
