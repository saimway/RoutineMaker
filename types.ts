
export enum Stream {
    SCIENCE = 'Science',
    ARTS = 'Arts',
    COMMERCE = 'Commerce',
}

export interface Subject {
    id: string;
    name: string;
}

export interface Chapter {
    id: string;
    name: string;
}

export interface SubjectWithChapters extends Subject {
    chapters: Chapter[];
}

export interface RoutineSlot {
    time: string;
    topic: string;
    activity: string;
}

export interface DailyPlan {
    day: string;
    slots: RoutineSlot[];
}
