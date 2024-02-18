import React from 'react';
import logoImage from '../../assets/logo.png'; // Adjust the path as necessary
import ExtensionRoot from './common/ExtensionRoot/ExtensionRoot';
import Text from './common/Text/Text';

export default function PopupMain() {
    // const [activeSchedule, schedules] = useSchedules();

    // TODO: Add a button to to switch the active schedule

    return (
        <ExtensionRoot>
            <div className='h-[500px] w-[360px] rounded-lg bg-white shadow-md'>
                <div className='mb-2 flex items-center justify-between bg-white px-4 py-3'>
                    <div className='flex items-center gap-2'>
                        <div className='h-13 w-13'>
                            <img src={logoImage} alt='Logo' />
                        </div>
                        <div>
                            <Text as='div' className='color-ut-burntorange text-lg font-500 leading-[100%]!'>
                                UT Registration
                            </Text>
                            <Text as='div' className='text-lg color-ut-orange font-500 leading-[100%]!'>
                                Plus
                            </Text>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <button style={{ backgroundColor: '#bf5700', borderRadius: '8px', padding: '8px' }} />
                        <button
                            style={{
                                backgroundColor: 'white',
                                marginLeft: '10px',
                                borderRadius: '8px',
                                padding: '8px',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                    </div>
                </div>
            </div>
        </ExtensionRoot>
    );
}
