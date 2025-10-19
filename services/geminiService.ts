import { GoogleGenAI, Type } from "@google/genai";
import { Chapter, DailyPlan, Subject } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function extractContentFromFile(base64Images: string[], selectedBooks?: Subject[]): Promise<Chapter[]> {
    const imageParts = base64Images.map(img => ({
        inlineData: {
            mimeType: 'image/jpeg',
            data: img,
        },
    }));

    let textPrompt = 'Analyze these images of a syllabus or table of contents. Extract the list of all chapters or main topics. Ignore sub-topics. Return the result as a JSON array.';

    if (selectedBooks && selectedBooks.length > 0) {
        const bookNames = selectedBooks.map(b => b.name).join(', ');
        textPrompt = `Analyze these images of a syllabus. From the syllabus, extract the list of all chapters or main topics ONLY for the following subjects: ${bookNames}. Ignore any subjects or chapters not on this list. Return the result as a JSON array.`;
    }


    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                ...imageParts,
                {
                    text: textPrompt,
                },
            ],
        },
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: {
                            type: Type.STRING,
                            description: 'A unique identifier for the chapter, e.g., "subjectName_chapter_1".'
                        },
                        name: {
                            type: Type.STRING,
                            description: 'The full name of the chapter or topic.'
                        },
                    },
                    required: ['id', 'name'],
                },
            },
        },
    });

    const jsonText = response.text.trim();
    try {
        const parsed = JSON.parse(jsonText);
        return parsed as Chapter[];
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", jsonText);
        throw new Error("Received malformed data from AI. Please try again.");
    }
}

export async function createFullStudyPlan(remainingChapters: Chapter[], durationInDays: number): Promise<DailyPlan[]> {
    const chapterNames = remainingChapters.map(ch => ch.name).join(', ');
    const totalChapters = remainingChapters.length;

    const prompt = `
        You are an expert academic planner. Create a detailed, day-by-day study plan for the entire duration specified.

        **Study Context:**
        - **Total Duration:** The student has exactly ${durationInDays} days to prepare.
        - **Total Topics:** There are ${totalChapters} topics to cover.
        - **Topic List:** ${chapterNames}

        **Prioritization Rules:**
        - **High-Priority Subjects:** The student has identified the following subjects as high-priority: Physics, Chemistry, Biology, Higher Math, and General Math.
        - **Scheduling Priority:** When creating the plan, give precedence to chapters from these high-priority subjects. Schedule them earlier in the timeline to ensure they are covered thoroughly. While all subjects must be completed, the science and math topics should be front-loaded.
        - **Completion Guarantee:** Despite this prioritization, you MUST ensure that every single chapter from the **Topic List** is included in the plan and completed within the ${durationInDays}-day period. No topic should be left out.

        **Time Allocation Based on Difficulty (New Critical Rule):**
        1.  **Assess Difficulty:** For each chapter in the **Topic List**, internally assess its difficulty. Use your expert knowledge of the SSC curriculum to categorize topics as 'Easy', 'Medium', or 'Hard'. For example, a foundational chapter like 'Set & Function' is easier than 'Trigonometry'. 'Motion' is generally easier than 'Modern Physics'.
        2.  **Allocate Time:** When creating the daily time slots, assign study durations based on this difficulty:
            - **Hard Topics:** Allocate longer slots (e.g., "9:00 AM - 11:30 AM", approx. 2.5 hours).
            - **Medium Topics:** Allocate standard slots (e.g., "12:00 PM - 1:30 PM", approx. 1.5 hours).
            - **Easy Topics:** Allocate shorter slots (e.g., "2:30 PM - 3:30 PM", approx. 1 hour).
        3.  **Adherence:** This is not a suggestion; it is a requirement. The duration of each study slot for a chapter must reflect its assessed difficulty.

        **Revision Strategy:**
        - **Cover New Topics First:** Prioritize covering all new chapters from the **Topic List** before scheduling extensive revision periods.
        - **Strategic Revision:** Incorporate revision slots logically. For example, a "Weekly Review" at the end of every 7 days to go over the topics covered that week is excellent.
        - **Final Review:** Schedule a more intensive review period during the last 10-15% of the total duration (e.g., the last 3-4 days of a 30-day plan).
        - **No Premature Revision:** Do not schedule revision for topics that have not been covered yet in the plan. All revision must be for previously studied material.

        **Instructions:**
        1.  **Full Plan:** Generate a complete study plan for all ${durationInDays} days. The output must be an array of ${durationInDays} objects.
        2.  **Adaptive Pacing:** This is critical. Analyze the number of topics versus the duration.
            - If the duration is short (e.g., 80 chapters in 30 days), create an intensive schedule with multiple chapters per day, respecting the difficulty-based time allocation.
            - If the duration is long (e.g., 20 chapters in 60 days), create a relaxed schedule, dedicating more time to single topics, and include more revision and practice days.
        3.  **Topic Distribution and Interleaving:** This is a critical requirement. Do not create a plan that focuses on one subject for many days before moving to the next. Instead, **mix the subjects up**. A good daily schedule should ideally include chapters from different subjects (e.g., Physics, Math, and Bangla on the same day). This technique, known as interleaving, improves learning and retention. While high-priority subjects should be covered early, they must be interleaved with other subjects throughout the plan. Ensure all topics from the list are logically distributed and covered within the ${durationInDays}-day period.
        4.  **Daily Structure:** For each day, provide a 'day' identifier (e.g., "Day 1", "Day 2", ... "Day ${durationInDays}") and a list of 'slots'.
        5.  **Slot Content:** Each time slot must include 'time' (a specific duration reflecting the topic's difficulty), 'topic' (a specific chapter name from the Topic List, 'Revision', 'Practice Test', or 'Break'), and a suggested 'activity' (e.g., 'Deep reading and note-taking', 'Solve past paper questions'). Use the exact chapter names provided in the **Topic List**.
        6.  **Breaks & Revision:** Incorporate short breaks, a lunch break, and dedicated revision sessions as defined in the **Revision Strategy** to ensure retention and prevent burnout.
        7.  **Output Format:** The final output must be a valid JSON array of objects, where each object represents a single day of the plan.
        8.  **Final Verification:** Before outputting the JSON, perform a final check to confirm that every single topic provided in the **Topic List** is present in the generated plan's 'topic' slots. This is the most important rule; failure to include all chapters will render the plan useless.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        day: {
                            type: Type.STRING,
                            description: 'The day identifier, e.g., "Day 1".'
                        },
                        slots: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    time: { type: Type.STRING, description: 'The time slot, e.g., "9:00 AM - 10:30 AM".' },
                                    topic: { type: Type.STRING, description: 'The topic to study. Can be "Break" or "Revision".' },
                                    activity: { type: Type.STRING, description: 'The suggested study activity.' },
                                },
                                required: ['time', 'topic', 'activity'],
                            },
                        },
                    },
                    required: ['day', 'slots'],
                },
            },
        },
    });

    const jsonText = response.text.trim();
    try {
        const parsed = JSON.parse(jsonText);
        // Basic validation
        if (Array.isArray(parsed) && parsed.every(day => 'day' in day && 'slots' in day)) {
            return parsed as DailyPlan[];
        }
        throw new Error("Parsed JSON does not match the expected DailyPlan structure.");
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", jsonText, e);
        throw new Error("Received malformed data from AI. The generated plan might be invalid. Please try again.");
    }
}