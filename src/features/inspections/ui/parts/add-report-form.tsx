import { useAddInspectionReport } from '@/features/inspections/hooks/use-add-inspection-report.ts';

const AddReportForm = () => {
  const { mutate } = useAddInspectionReport();
  return (
    <div>
      AddReportForm
      <button onClick={() => mutate({ assignedTasks: 'test test test test test test test ' })}>btn</button>
    </div>
  );
};

export default AddReportForm;
