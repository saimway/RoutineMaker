import { Stream, Subject } from '../types';

interface SubjectData {
    core: Subject[];
    optional: Subject[];
}

export const SUBJECT_DATA: Record<Stream, SubjectData> = {
    [Stream.SCIENCE]: {
        core: [
            { id: 'bangla', name: 'Bangla (Sahitya & Bakaron)' },
            { id: 'english', name: 'English (Main & Grammar)' },
            { id: 'physics', name: 'Physics' },
            { id: 'chemistry', name: 'Chemistry' },
            { id: 'biology', name: 'Biology' },
            { id: 'higher_math', name: 'Higher Math' },
            { id: 'general_math', name: 'General Math' },
            { id: 'ict', name: 'ICT' },
            { id: 'bgs', name: 'Bangladesh & Global Studies' },
        ],
        optional: [
            { id: 'islam', name: 'Islam' },
            { id: 'hinduism', name: 'Hinduism' },
            { id: 'christianity', name: 'Christianity' },
        ],
    },
    [Stream.ARTS]: {
        core: [
            { id: 'bangla', name: 'Bangla (Sahitya & Bakaron)' },
            { id: 'english', name: 'English (Main & Grammar)' },
            { id: 'economics', name: 'Economics' },
            { id: 'civics', name: 'Civics and Good Governance' },
            { id: 'history', name: 'History' },
            { id: 'sociology', name: 'Sociology' },
            { id: 'logic', name: 'Logic' },
            { id: 'ict', name: 'ICT' },
            { id: 'bgs', name: 'Bangladesh & Global Studies' },
        ],
        optional: [
            { id: 'islam', name: 'Islam' },
            { id: 'hinduism', name: 'Hinduism' },
            { id: 'christianity', name: 'Christianity' },
        ],
    },
    [Stream.COMMERCE]: {
        core: [
            { id: 'bangla', name: 'Bangla (Sahitya & Bakaron)' },
            { id: 'english', name: 'English (Main & Grammar)' },
            { id: 'accounting', name: 'Accounting' },
            { id: 'business_org', name: 'Business Organization & Management' },
            { id: 'finance', name: 'Finance, Banking & Insurance' },
            { id: 'marketing', name: 'Marketing' },
            { id: 'ict', name: 'ICT' },
            { id: 'bgs', name: 'Bangladesh & Global Studies' },
        ],
        optional: [
            { id: 'islam', name: 'Islam' },
            { id: 'hinduism', name: 'Hinduism' },
            { id: 'christianity', name: 'Christianity' },
        ],
    },
};