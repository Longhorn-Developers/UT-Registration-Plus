import { Input, Menu, MenuButton, MenuItems } from '@headlessui/react';
import { ChalkboardTeacher, GraduationCap, HashStraight, ListNumbers, Plus, PlusCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React from 'react';

import { Button } from './Button';
import DialogProvider from './DialogProvider/DialogProvider';
import Divider from './Divider';
import type { DropdownOption } from './Dropdown';
import Dropdown from './Dropdown';
import { ExtensionRootWrapper, styleResetClass } from './ExtensionRoot/ExtensionRoot';
import Text from './Text/Text';

const FIELDS_OF_STUDY = [
    { id: 'A I', label: 'A I - Artificial Intelligence' },
    { id: 'AAS', label: 'AAS - Asian American Studies' },
    { id: 'ACC', label: 'ACC - Accounting' },
    { id: 'ADV', label: 'ADV - Advertising' },
    { id: 'AED', label: 'AED - Art Education' },
    { id: 'AET', label: 'AET - Arts/Entertainment Technology' },
    { id: 'AFR', label: 'AFR - African/African Diaspora Studies' },
    { id: 'AFS', label: 'AFS - Air Force Science' },
    { id: 'AHC', label: 'AHC - Ancient History/Classical Civ' },
    { id: 'AMS', label: 'AMS - American Studies' },
    { id: 'ANS', label: 'ANS - Asian Studies' },
    { id: 'ANT', label: 'ANT - Anthropology' },
    { id: 'ARA', label: 'ARA - Arabic' },
    { id: 'ARC', label: 'ARC - Architecture' },
    { id: 'ARE', label: 'ARE - Architectural Engineering' },
    { id: 'ARH', label: 'ARH - Art History' },
    { id: 'ARI', label: 'ARI - Architectural Interior Design' },
    { id: 'ART', label: 'ART - Art, Studio' },
    { id: 'ASE', label: 'ASE - Aerospace Engineering' },
    { id: 'ASL', label: 'ASL - American Sign Language' },
    { id: 'AST', label: 'AST - Astronomy' },
    { id: 'B A', label: 'B A - Business Administration' },
    { id: 'BAX', label: 'BAX - Business Analytics' },
    { id: 'BCH', label: 'BCH - Biochemistry' },
    { id: 'BDP', label: 'BDP - Bridging Disciplines' },
    { id: 'BGS', label: 'BGS - Business/Government/Society' },
    { id: 'BIO', label: 'BIO - Biology' },
    { id: 'BME', label: 'BME - Biomedical Engineering' },
    { id: 'BSN', label: 'BSN - Bassoon' },
    { id: 'C C', label: 'C C - Classical Civilization' },
    { id: 'C E', label: 'C E - Civil Engineering' },
    { id: 'C L', label: 'C L - Comparative Literature' },
    { id: 'C S', label: 'C S - Computer Science' },
    { id: 'CDI', label: 'CDI - Critical Disability Studies' },
    { id: 'CGS', label: 'CGS - Cognitive Science' },
    { id: 'CH', label: 'CH - Chemistry' },
    { id: 'CHE', label: 'CHE - Chemical Engineering' },
    { id: 'CHI', label: 'CHI - Chinese' },
    { id: 'CIV', label: 'CIV - Civics' },
    { id: 'CLA', label: 'CLA - Clarinet' },
    { id: 'CLD', label: 'CLD - Communication and Leadership' },
    { id: 'CMS', label: 'CMS - Communication Studies' },
    { id: 'COE', label: 'COE - Computational Engineering' },
    { id: 'COM', label: 'COM - Communication' },
    { id: 'CON', label: 'CON - Conducting' },
    { id: 'CRP', label: 'CRP - Community/Regional Planning' },
    { id: 'CRW', label: 'CRW - Creative Writing' },
    { id: 'CSE', label: 'CSE - Computational Science/Engineering' },
    { id: 'CTI', label: 'CTI - Core Texts and Ideas' },
    { id: 'CZ', label: 'CZ - Czech' },
    { id: 'D B', label: 'D B - Double Bass' },
    { id: 'D S', label: 'D S - Decision Science' },
    { id: 'DAN', label: 'DAN - Danish' },
    { id: 'DCH', label: 'DCH - Dutch' },
    { id: 'DES', label: 'DES - Design' },
    { id: 'DEV', label: 'DEV - Developmental Studies' },
    { id: 'DRS', label: 'DRS - Drum Set' },
    { id: 'DSC', label: 'DSC - Data Science' },
    { id: 'E', label: 'E - English' },
    { id: 'E M', label: 'E M - Engineering Mechanics' },
    { id: 'E S', label: 'E S - Engineering Studies' },
    { id: 'ECE', label: 'ECE - Electrical/Computer Engineering' },
    { id: 'ECO', label: 'ECO - Economics' },
    { id: 'EDC', label: 'EDC - Curriculum and Instruction' },
    { id: 'EDP', label: 'EDP - Educational Psychology' },
    { id: 'EDU', label: 'EDU - Education' },
    { id: 'EER', label: 'EER - Energy and Earth Resources' },
    { id: 'ELP', label: 'ELP - Educational Leadership/Policy' },
    { id: 'ENM', label: 'ENM - Engineering Management' },
    { id: 'ENS', label: 'ENS - Ensemble' },
    { id: 'ESL', label: 'ESL - English as a Second Language' },
    { id: 'EUP', label: 'EUP - Euphonium' },
    { id: 'EUS', label: 'EUS - European Studies' },
    { id: 'EVE', label: 'EVE - Environmental Engineering' },
    { id: 'EVS', label: 'EVS - Environmental Science' },
    { id: 'F A', label: 'F A - Fine Arts' },
    { id: 'F C', label: 'F C - French Civilization' },
    { id: 'F H', label: 'F H - French Horn' },
    { id: 'FIN', label: 'FIN - Finance' },
    { id: 'FLU', label: 'FLU - Flute' },
    { id: 'FR', label: 'FR - French' },
    { id: 'G E', label: 'G E - General Engineering' },
    { id: 'GEO', label: 'GEO - Geological Sciences' },
    { id: 'GER', label: 'GER - German' },
    { id: 'GK', label: 'GK - Greek' },
    { id: 'GOV', label: 'GOV - Government' },
    { id: 'GRG', label: 'GRG - Geography' },
    { id: 'GRS', label: 'GRS - Graduate School' },
    { id: 'GSD', label: 'GSD - German/Scandinavian/Dutch' },
    { id: 'GUI', label: 'GUI - Guitar' },
    { id: 'H E', label: 'H E - Human Ecology' },
    { id: 'H S', label: 'H S - Health and Society' },
    { id: 'HAR', label: 'HAR - Harp' },
    { id: 'HDF', label: 'HDF - Human Development/Family Sciences' },
    { id: 'HDO', label: 'HDO - Human Dimensions of Orgs' },
    { id: 'HEB', label: 'HEB - Hebrew' },
    { id: 'HED', label: 'HED - Health Education' },
    { id: 'HHM', label: 'HHM - Humanities, Health, and Medici' },
    { id: 'HIN', label: 'HIN - Hindi' },
    { id: 'HIS', label: 'HIS - History' },
    { id: 'HMN', label: 'HMN - Humanities' },
    { id: 'I', label: 'I - Informatics' },
    { id: 'I B', label: 'I B - International Business' },
    { id: 'ILA', label: 'ILA - Iberian/Latin American Langs' },
    { id: 'INB', label: 'INB - Integrative Biology' },
    { id: 'INF', label: 'INF - Information Studies' },
    { id: 'IRG', label: 'IRG - Intl Relations/Global Studies' },
    { id: 'ISP', label: 'ISP - Information Security &amp; Privacy' },
    { id: 'ITC', label: 'ITC - Italian Civilization' },
    { id: 'ITD', label: 'ITD - Integrated Design' },
    { id: 'ITL', label: 'ITL - Italian' },
    { id: 'J', label: 'J - Journalism' },
    { id: 'J S', label: 'J S - Jewish Studies' },
    { id: 'JPN', label: 'JPN - Japanese' },
    { id: 'KIN', label: 'KIN - Kinesiology' },
    { id: 'KOR', label: 'KOR - Korean' },
    { id: 'L A', label: 'L A - Liberal Arts' },
    { id: 'LAH', label: 'LAH - Liberal Arts Honors' },
    { id: 'LAL', label: 'LAL - Indigenous Languages of Latin America' },
    { id: 'LAR', label: 'LAR - Landscape Architecture' },
    { id: 'LAS', label: 'LAS - Latin American Studies' },
    { id: 'LAT', label: 'LAT - Latin' },
    { id: 'LAW', label: 'LAW - Law' },
    { id: 'LEB', label: 'LEB - Legal Environment of Business' },
    { id: 'LIN', label: 'LIN - Linguistics' },
    { id: 'LTC', label: 'LTC - Language Teaching/Coordination' },
    { id: 'M', label: 'M - Mathematics' },
    { id: 'M E', label: 'M E - Mechanical Engineering' },
    { id: 'M S', label: 'M S - Military Science' },
    { id: 'MAL', label: 'MAL - Malayalam' },
    { id: 'MAN', label: 'MAN - Management' },
    { id: 'MAS', label: 'MAS - Mexican American Studies' },
    { id: 'MBS', label: 'MBS - Molecular Biosciences' },
    { id: 'MEL', label: 'MEL - Middle Eastern Langs/Cultures' },
    { id: 'MES', label: 'MES - Middle Eastern Studies' },
    { id: 'MFG', label: 'MFG - Manufacturing Systems Eng' },
    { id: 'MIS', label: 'MIS - Management Information Systems' },
    { id: 'MKT', label: 'MKT - Marketing' },
    { id: 'MLS', label: 'MLS - Medical Laboratory Science' },
    { id: 'MNS', label: 'MNS - Marine Science' },
    { id: 'MOL', label: 'MOL - Molecular Biology' },
    { id: 'MSE', label: 'MSE - Materials Science/Engineer' },
    { id: 'MUS', label: 'MUS - Music' },
    { id: 'N', label: 'N - Nursing' },
    { id: 'N S', label: 'N S - Naval Science' },
    { id: 'NEU', label: 'NEU - Neuroscience' },
    { id: 'NOR', label: 'NOR - Norwegian' },
    { id: 'NSC', label: 'NSC - Natural Sciences' },
    { id: 'NTR', label: 'NTR - Nutrition' },
    { id: 'O M', label: 'O M - Operations Management' },
    { id: 'OBO', label: 'OBO - Oboe' },
    { id: 'OPR', label: 'OPR - Opera' },
    { id: 'ORG', label: 'ORG - Organ' },
    { id: 'ORI', label: 'ORI - Operations Rsrch/Industrial Engr' },
    { id: 'P A', label: 'P A - Public Affairs' },
    { id: 'P L', label: 'P L - Public Leadership' },
    { id: 'P R', label: 'P R - Public Relations' },
    { id: 'P S', label: 'P S - Physical Science' },
    { id: 'PBH', label: 'PBH - Public Health' },
    { id: 'PED', label: 'PED - Physical Education' },
    { id: 'PER', label: 'PER - Percussion' },
    { id: 'PGE', label: 'PGE - Petroleum and Geosystems Engineering' },
    { id: 'PGS', label: 'PGS - Pharmacy Graduate Studies' },
    { id: 'PHL', label: 'PHL - Philosophy' },
    { id: 'PHM', label: 'PHM - Pharmacy PharmD' },
    { id: 'PHY', label: 'PHY - Physics' },
    { id: 'PIA', label: 'PIA - Piano' },
    { id: 'POL', label: 'POL - Polish' },
    { id: 'POR', label: 'POR - Portuguese' },
    { id: 'PPE', label: 'PPE - Philosophy, Politics, and Econ' },
    { id: 'PRC', label: 'PRC - Portuguese Civilization' },
    { id: 'PRS', label: 'PRS - Persian' },
    { id: 'PSY', label: 'PSY - Psychology' },
    { id: 'R E', label: 'R E - Real Estate' },
    { id: 'R M', label: 'R M - Risk Management' },
    { id: 'R S', label: 'R S - Religious Studies' },
    { id: 'RBT', label: 'RBT - Robotics' },
    { id: 'REE', label: 'REE - Russian/East European/Eurasian' },
    { id: 'RHE', label: 'RHE - Rhetoric and Writing' },
    { id: 'RIM', label: 'RIM - Race/Indigeneity/Migration' },
    { id: 'RTF', label: 'RTF - Radio-Television-Film' },
    { id: 'RUS', label: 'RUS - Russian' },
    { id: 'S C', label: 'S C - Serbian/Croatian' },
    { id: 'S S', label: 'S S - Social Science' },
    { id: 'S W', label: 'S W - Social Work' },
    { id: 'SAN', label: 'SAN - Sanskrit' },
    { id: 'SAX', label: 'SAX - Saxophone' },
    { id: 'SDS', label: 'SDS - Statistics and Data Sciences' },
    { id: 'SED', label: 'SED - Special Education' },
    { id: 'SLH', label: 'SLH - Speech/Language/Hearing Sciences' },
    { id: 'SOC', label: 'SOC - Sociology' },
    { id: 'SPC', label: 'SPC - Spanish Civilization' },
    { id: 'SPN', label: 'SPN - Spanish' },
    { id: 'STA', label: 'STA - Statistics' },
    { id: 'STC', label: 'STC - Science/Technology Commerce' },
    { id: 'STM', label: 'STM - Sci/Tech/Engr/Math Studies' },
    { id: 'SUS', label: 'SUS - Sustainability Studies' },
    { id: 'SWE', label: 'SWE - Swedish' },
    { id: 'T C', label: 'T C - Tutorial Course' },
    { id: 'T D', label: 'T D - Theatre and Dance' },
    { id: 'TAM', label: 'TAM - Tamil' },
    { id: 'TBA', label: 'TBA - Tuba' },
    { id: 'TRO', label: 'TRO - Trombone' },
    { id: 'TRU', label: 'TRU - Trumpet' },
    { id: 'TUR', label: 'TUR - Turkish' },
    { id: 'TXA', label: 'TXA - Textiles and Apparel' },
    { id: 'U D', label: 'U D - Urban Design' },
    { id: 'UGS', label: 'UGS - Undergraduate Studies' },
    { id: 'UKR', label: 'UKR - Ukrainian' },
    { id: 'URB', label: 'URB - Urban Studies' },
    { id: 'URD', label: 'URD - Urdu' },
    { id: 'UTL', label: 'UTL - UTeach-Liberal Arts' },
    { id: 'UTS', label: 'UTS - UTeach-Natural Sciences' },
    { id: 'V C', label: 'V C - Violoncello' },
    { id: 'VIA', label: 'VIA - Viola' },
    { id: 'VIO', label: 'VIO - Violin' },
    { id: 'VOI', label: 'VOI - Voice' },
    { id: 'WGS', label: "WGS - Women's and Gender Studies" },
    { id: 'WRT', label: 'WRT - Writing' },
    { id: 'YID', label: 'YID - Yiddish' },
    { id: 'YOR', label: 'YOR - Yoruba' },
] as const satisfies DropdownOption[];

const COURSE_NUMBERS = [
    { id: '1', label: 'CS101' },
    { id: '2', label: 'MATH202' },
] as const satisfies DropdownOption[];

const SECTIONS = [
    { id: '1', label: 'Section A' },
    { id: '2', label: 'Section B' },
] as const satisfies DropdownOption[];

/**
 * QuickAddModal component
 *
 * This component renders a button with a PlusCircle icon and the label "Quick Add".
 */
export default function QuickAddModal(): JSX.Element {
    const [field, setField] = React.useState<DropdownOption | undefined>(undefined);
    const [courseNumber, setCourseNumber] = React.useState<DropdownOption | undefined>(undefined);
    const [section, setSection] = React.useState<DropdownOption | undefined>(undefined);
    const [unique, setUnique] = React.useState<string>('');

    return (
        <DialogProvider>
            <Menu>
                <MenuButton className='bg-transparent'>
                    <Button color='ut-black' size='small' variant='minimal' icon={PlusCircle}>
                        Quick Add
                    </Button>
                </MenuButton>
                <MenuItems
                    as={ExtensionRootWrapper}
                    className={clsx([
                        styleResetClass,
                        'mt-spacing-3',
                        'min-w-max origin-top-right rounded bg-white text-black shadow-lg transition border border-ut-offwhite/50 focus:outline-none',
                        'data-[closed]:(opacity-0 scale-95)',
                        'data-[enter]:(ease-out-expo duration-150)',
                        'data-[leave]:(ease-out duration-50)',
                        'flex flex-col gap-spacing-7 px-spacing-7 py-spacing-6 w-[400px]',
                    ])}
                    transition
                    anchor='bottom start'
                >
                    <div className='flex flex-col gap-spacing-6'>
                        <div className='flex flex-col gap-spacing-5'>
                            <Dropdown
                                className='w-full'
                                placeholderText='Select Field of Study...'
                                options={FIELDS_OF_STUDY}
                                selectedOption={field}
                                onOptionChange={f => {
                                    setField(f === field ? undefined : f);
                                    setCourseNumber(undefined);
                                    setSection(undefined);
                                }}
                                icon={GraduationCap}
                            />
                            <Dropdown
                                className='w-full'
                                placeholderText='Select Course Number...'
                                options={COURSE_NUMBERS}
                                selectedOption={courseNumber}
                                onOptionChange={c => {
                                    setCourseNumber(c === courseNumber ? undefined : c);
                                    setSection(undefined);
                                }}
                                icon={ListNumbers}
                                disabled={!field}
                            />
                            <Dropdown
                                className='w-full'
                                placeholderText='Select Section...'
                                options={SECTIONS}
                                selectedOption={section}
                                onOptionChange={s => setSection(s === section ? undefined : s)}
                                icon={ChalkboardTeacher}
                                disabled={!courseNumber}
                            />
                        </div>
                        <div className='w-full flex flex-row items-center justify-center gap-spacing-4'>
                            <Divider orientation='horizontal' size='100%' />
                            <Text className='w-fit text-nowrap uppercase' variant='small'>
                                OR ADD BY UNIQUE NUMBER
                            </Text>
                            <Divider orientation='horizontal' size='100%' />
                        </div>
                        <div className='h-9 w-full flex flex-row items-center justify-start gap-spacing-5'>
                            <HashStraight className='h-7 w-7' />
                            <Input
                                value={unique}
                                onChange={e => {
                                    if (e.target.value === '' || /^\d+$/.test(e.target.value)) {
                                        setUnique(e.target.value);
                                    }
                                }}
                                maxLength={5}
                                placeholder='Enter Unique Number...'
                                className='h-full w-full border border-ut-offwhite/50 border-rounded px-spacing-4 py-spacing-1 focus:border-ut-black/50 disabled:bg-ut-offwhite/20 focus:outline-none focus:ring-0'
                            />
                        </div>
                    </div>
                    <div className='w-full flex flex-row justify-end gap-spacing-5'>
                        <Button color='ut-black' size='regular' variant='minimal'>
                            Cancel
                        </Button>
                        <Button color='ut-green' size='regular' variant='filled' icon={Plus}>
                            Add Course
                        </Button>
                    </div>
                </MenuItems>
            </Menu>
        </DialogProvider>
    );
}
