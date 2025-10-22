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
        You are an expert academic planner specializing in the Bangladesh SSC curriculum. Create a detailed, intelligent, day-by-day study plan for the entire duration specified.

        **Student's Goal:**
        - **Study Duration:** ${durationInDays} days.
        - **Topics to Cover:** ${totalChapters} topics.
        - **Topic List:** ${chapterNames}

        **Your Task: Create the Smartest Possible Study Plan**

        Instead of just filling a schedule, your plan must be strategic. Use the following principles:

        **1. Intelligent Prioritization & Sequencing:**
        - **High-Impact Subjects:** Subjects like Physics, Chemistry, Biology, Higher Math, and General Math are often challenging and foundational. Ensure they receive adequate attention, especially in the earlier parts of the plan, but do not neglect other subjects.
        - **Logical Flow:** Where possible, arrange chapters in a logical order. For example, cover foundational concepts in a subject before moving on to more advanced, dependent topics.
        - **Interleaving for Retention:** This is critical. Do not schedule long blocks of a single subject. Mix subjects throughout each day (e.g., a session of Math, followed by Bangla, then Physics). This proven learning technique boosts memory and understanding.

        **2. Dynamic Time Allocation Based on Topic Difficulty:**
        - **Expert Assessment:** Use your knowledge of the SSC curriculum to analyze each chapter in the **Topic List**. Assess its relative difficulty, density, and the typical time required for a student to master it.
        - **Allocate Time Accordingly:** Assign study durations that reflect your assessment. This is key to a realistic plan. For example:
            - A conceptually dense and lengthy chapter (e.g., 'Trigonometry', 'Vectors', 'Mineral Resources - Fossils') should be given a longer slot of 2-2.5 hours.
            - A medium-complexity chapter might need 1.5 hours.
            - A straightforward or shorter chapter (e.g., a single poem or a simple prose piece) could be covered in a 1-hour slot.
        - **Flexibility:** This is not about rigid rules for specific chapters but about you applying your expert judgment across the entire syllabus provided.

        **3. Strategic Revision:**
        - **Consolidate Learning:** Integrate revision slots strategically. A weekly review every 7 days is a good practice.
        - **Final Preparation:** Dedicate the last 10-15% of the schedule (e.g., the last few days of a 30-day plan) to intensive final revisions and practice tests.
        - **Relevant Revision:** Only schedule revision for topics that have already been covered in your plan.

        **4. Adaptive Pacing:**
        - **Intensive vs. Relaxed:** The plan's intensity must match the timeline.
            - For a short duration with many topics, the daily schedule will be packed.
            - For a longer duration with fewer topics, the schedule can be more relaxed, with more time per topic and more frequent breaks or practice days.

        **Instructions for Output:**
        1.  **Complete Plan:** Generate a plan for all ${durationInDays} days.
        2.  **Daily Structure:** Each day should be an object with a 'day' identifier ("Day 1", "Day 2", etc.) and a list of 'slots'.
        3.  **Slot Content:** Each slot must have 'time', 'topic' (use the exact chapter name from the list, or 'Revision', 'Practice Test', 'Break'), and a concise 'activity' (e.g., 'Concept study & notes', 'Solve practice problems').
        4.  **Well-being:** Include necessary breaks (short breaks, lunch) to prevent burnout.
        5.  **Final Verification:** Before outputting, double-check that **every single chapter** from the **Topic List** is included in the plan. This is the most crucial requirement.
        6.  **JSON Format:** The final output must be a valid JSON array of objects.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
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
