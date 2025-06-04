import DetailRow from "@/shared/components/common/detail-row.tsx";

const AppealMainInfo = () => {
    return (
        <div className="py-1 flex flex-col">
            <DetailRow title="Turi:" value={'-'}/>
            <DetailRow title="Obyekt ro‘yxat raqami:" value={'-'}/>
            <DetailRow title="Egalik qiluvchi tashkilot:" value={'-'}/>
            <DetailRow title="Viloyat:" value={'-'}/>
            <DetailRow title="Tuman:" value={'-'}/>
            <DetailRow title="Ishlab chiqish sanasi" value={'-'}/>
            <DetailRow title="Model, marka:" value={'-'}/>
            <DetailRow title="Zavod raqami:" value={'-'}/>
            <DetailRow title="Geolokatsiya:" value={'-'}/>
            <DetailRow title="Strela uchish masofasi:" value={'-'}/>
            <DetailRow title="Yuk ko‘tarish qobiliyati:" value={'-'}/>
        </div>
    );
};

export default AppealMainInfo;