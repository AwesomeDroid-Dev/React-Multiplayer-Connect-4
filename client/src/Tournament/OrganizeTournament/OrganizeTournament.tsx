import { Button } from 'antd';
import OrganizeLayer from './OrganizeLayer';

function OrganizeTournament({organization, setOrganization, handleOrganized}: any) {

    return (
        <div className='relative z-10 bg-gray-700 bg-opacity-60 backdrop-blur p-8 rounded-lg shadow-lg flex flex-col items-center'>
            <h1 className='text-3xl font-bold text-center text-white pb-5'>Organize Tournament</h1>
            <div className='flex flex-col-reverse gap-2 items-center'>
                {organization.map((layer: any, index: number) => (
                    <OrganizeLayer key={index} index={index} layer={layer} setOrganization={setOrganization} organization={organization} />
                ))}
            </div>
            <Button className='mt-8' type="primary" onClick={handleOrganized}>Start</Button>
        </div>
    );
}

export default OrganizeTournament;