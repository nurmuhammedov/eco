import {ApplicationDetail} from '@/features/application/application-detail';
import {GoBack} from '@/shared/components/common';
import {useDetail} from '@/shared/hooks';
import {useParams} from 'react-router-dom';
import {Button} from "@/shared/components/ui/button.tsx";

const ApplicationPage = () => {
    const {id} = useParams();
    const {data} = useDetail<any>('/appeals', id);

    return (
        <div>
            <div className="flex justify-between items-center">
                <GoBack title={`Ariza raqami: ${data?.number || ''}`}/>
                <div className='flex gap-2'>
                    <Button>Ijro etish</Button>
                    <Button variant='destructive'>Arizani qaytarish</Button>
                </div>
            </div>
            <ApplicationDetail data={data}/>
        </div>
    );
};
export default ApplicationPage;
