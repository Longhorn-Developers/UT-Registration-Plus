import React from 'react';
import { FaCalendarAlt, FaCog, FaRedo } from 'react-icons/fa'; // Added FaRedo for the refresh icon
import { StatusIcon } from '@shared/util/icons';
import ExtensionRoot from './common/ExtensionRoot/ExtensionRoot';
import PopupCourseBlock from './common/PopupCourseBlock/PopupCourseBlock';
import Text from './common/Text/Text';
import Divider from './common/Divider/Divider';
import logoImage from '../../assets/logo.png'; // Adjust the path as necessary
import List from './common/List/List'; // Ensure this path is correctly pointing to your List component



export default function PopupMain() {
   const courses = [
       {
           uniqueId: '47280',
           department: 'BIO',
           number: '311C',
           instructors: [{ lastName: 'Fritz' }],
           status: 'OPEN',
       },
       {
           uniqueId: '51180',
           department: 'C S',
           number: '374L',
           instructors: [{ lastName: 'Baer' }],
           status: 'CLOSED',
       },
       {
           uniqueId: '60020',
           department: 'S W',
           number: '310',
           instructors: [{ lastName: 'Whalley' }],
           status: 'WAITLISTED',
       },
       {
           uniqueId: '13190',
           department: 'PED',
           number: '106C',
           instructors: [{ lastName: 'Rich' }],
           status: 'CANCELLED',
       },
       {
           uniqueId: '44435',
           department: 'WGS',
           number: '301',
           instructors: [{ lastName: 'RODRIGUEZ' }],
           status: 'TEMP',
       },
   ];


   // Manually applying colors for the demonstration
   const colors = {
       OPEN: { primaryColor: '#34D399', secondaryColor: '#059669' },
       CLOSED: { primaryColor: '#818cf8', secondaryColor: '#4f46e5' },
       WAITLISTED: { primaryColor: '#F59E00', secondaryColor: '#B45309' },
       CANCELLED: { primaryColor: '#EF4444', secondaryColor: '#b91c1c' },
       TEMP: { primaryColor: '#fde047', secondaryColor: '#eab308' },
   };

   const draggableElements = courses.map((course) => (
    <PopupCourseBlock
        key={course.uniqueId}
        course={course}
        colors={colors[course.status]}
    />
));


return (
    <ExtensionRoot>
        <div className="p-4 bg-white max-w-sm mx-auto rounded-lg shadow-md">
            <div className="mb-2 flex items-center justify-between bg-white">
                <div className="flex items-center">
                    <img src={logoImage} alt="Logo" style={{ width: '40px', height: '40px', marginRight: '8px' }} />
                    <div>
                        <Text as="div" variant="h1-course" style={{ color: '#bf5700', fontSize: '1.3rem' }}>UT Registration</Text>
                        <Text as="div" variant="h1-course" style={{ color: '#f8971f', fontSize: '1.3rem' }}>Plus</Text>
                    </div>
                </div>
                <div className="flex items-center">
                    <button style={{ backgroundColor: '#bf5700', borderRadius: '8px', padding: '8px' }}>
                        <FaCalendarAlt color="white" />
                    </button>
                    <button style={{ backgroundColor: 'white', marginLeft: '10px', borderRadius: '8px', padding: '8px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                        <FaCog color="#C05621" />
                    </button>
                </div>
            </div>
            <Divider color="#E2E8F0" type="solid" style={{ margin: '1rem 0' }} />
            <div className="mb-4 p-2 bg-white text-left rounded-lg shadow-inner" style={{ backgroundColor: 'white', border: '1px solid #FBD38D', borderRadius: '0.5rem' }}>
                <Text as="div" variant="h2-course" style={{ color: '#DD6B20', fontSize: '1.2rem' }}>MAIN SCHEDULE:</Text>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', color: '#333f48' }}>
                    <Text as="div" variant="h1" style={{ fontSize: '1.2rem', fontWeight: 'bold', marginRight: '0.5rem' }}>22 HOURS</Text>
                    <Text as="div" variant="h2-course" style={{ fontSize: '1.2rem' }}>8 Courses</Text>
                </div>
            </div>
            {/* Integrate the List component here */}
            <List
                draggableElements={draggableElements}
                itemHeight={100} // Adjust based on your content size
                listHeight={500} // Adjust based on total height you want for the list
                listWidth={350} // Adjust based on your layout/design
                gap={12} // Spacing between items
            />
            <div className="mt-4 p-4 border-t border-gray-200 flex justify-between text-xs">
                <div className="flex items-center">
                    <div style={{ backgroundColor: '#6B7280', padding: '1px', borderRadius: '4px', marginRight: '3px', marginLeft: '8px' }}>
                        <StatusIcon status="WAITLISTED" className="text-white h-5 w-5" />
                    </div>
                    <Text as="span" variant="mini">WAITLISTED</Text>
                </div>
                <div className="flex items-center">
                    <div style={{ backgroundColor: '#6B7280', padding: '1px', borderRadius: '4px', marginRight: '3px', marginLeft: '8px' }}>
                        <StatusIcon status="CLOSED" className="text-white h-5 w-5" />
                    </div>
                    <Text as="span" variant="mini">CLOSED</Text>
                </div>
                <div className="flex items-center">
                    <div style={{ backgroundColor: '#6B7280', padding: '1px', borderRadius: '4px', marginRight: '3px', marginLeft: '8px' }}>
                        <StatusIcon status="CANCELLED" className="text-white h-5 w-5" />
                    </div>
                    <Text as="span" variant="mini">CANCELLED</Text>
                </div>
            </div>
            <div className="mt-2 text-center text-xs">
                <div className="inline-flex items-center justify-center">
                    <Text as="div" variant="mini">DATA UPDATED ON: 12:00 AM 02/01/2024</Text>
                    <FaRedo className="text-gray-600 h-4 w-4 ml-2" />
                </div>
            </div>
        </div>
    </ExtensionRoot>
);
}
