
import React, { useState, useCallback } from 'react';
import { pdfjs } from 'react-pdf';

import FileUpload from './components/FileUpload';
import ChapterList from './components/ChapterList';
import RoutineDisplay from './components/RoutineDisplay';
import Loader from './components/Loader';
import StreamSelector from './components/StreamSelector';
import SubjectSelector from './components/SubjectSelector';
import CurriculumSelector from './components/CurriculumSelector';
import SscBookSelector from './components/SscBookSelector';
import DurationSelector from './components/DurationSelector';

import { SparklesIcon } from './components/icons/SparklesIcon';
import { SUBJECT_DATA } from './constants/subjects';
import { SSC_SYLLABUS } from './constants/sscSyllabus';
import { extractContentFromFile, createFullStudyPlan } from './services/geminiService';
import { Chapter, DailyPlan, Subject, SubjectWithChapters, Stream } from './types';

type AppState = 'CURRICULUM_SELECTION' | 'SSC_BOOK_SELECTION' | 'STREAM_SELECTION' | 'SUBJECT_SELECTION' | 'FILE_UPLOAD' | 'CHAPTER_LIST' | 'DURATION_SELECTION' | 'ROUTINE_DISPLAY';
type CurriculumType = 'general' | 'ssc-26';

function App() {
    const [appState, setAppState] = useState<AppState>('CURRICULUM_SELECTION');
    const [chaptersBySubject, setChaptersBySubject] = useState<SubjectWithChapters[]>([]);
    const [routine, setRoutine] = useState<DailyPlan[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
    const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
    const [remainingChapters, setRemainingChapters] = useState<Chapter[]>([]);
    const [selectedCurriculum, setSelectedCurriculum] = useState<CurriculumType | null>(null);

    const handleError = (message: string) => {
        setError(message);
        setIsLoading(false);
    };

    const handleReset = useCallback(() => {
        setAppState('CURRICULUM_SELECTION');
        setChaptersBySubject([]);
        setRoutine([]);
        setIsLoading(false);
        setLoadingMessage('');
        setError(null);
        setSelectedStream(null);
        setSelectedSubjects([]);
        setRemainingChapters([]);
        setSelectedCurriculum(null);
    }, []);
    
    const handleCurriculumSelect = (type: CurriculumType) => {
        setSelectedCurriculum(type);
        if (type === 'general') {
            setAppState('STREAM_SELECTION');
        } else {
            setAppState('SSC_BOOK_SELECTION');
        }
    };

    const handleSscBooksSelect = (books: Subject[]) => {
        const preloadedChapters = books
            .map(book => ({
                ...book,
                chapters: SSC_SYLLABUS[book.id] || []
            }))
            .filter(subject => subject.chapters.length > 0);

        setChaptersBySubject(preloadedChapters);
        setAppState('CHAPTER_LIST');
    };

    const handleStreamSelect = (stream: Stream) => {
        setSelectedStream(stream);
        setAppState('SUBJECT_SELECTION');
    };
    
    const handleSubjectsSelect = (subjects: Subject[]) => {
        setSelectedSubjects(subjects);
        setAppState('FILE_UPLOAD');
    };

    const handleFileUpload = async (file: File) => {
        setIsLoading(true);
        setLoadingMessage('Analyzing your syllabus...');
        setError(null);

        try {
            const base64Images: string[] = [];
            if (file.type.startsWith('image/')) {
                const base64 = await fileToBase64(file);
                base64Images.push(base64.split(',')[1]);
            } else if (file.type === 'application/pdf') {
                const pdfImages = await pdfToImages(file);
                base64Images.push(...pdfImages);
            } else {
                throw new Error("Unsupported file type. Please upload a JPG, PNG, or PDF.");
            }

            const extractedChapters = await extractContentFromFile(base64Images, selectedSubjects.length > 0 ? selectedSubjects : undefined);
            if (extractedChapters.length === 0) {
                throw new Error("Could not extract any chapters from the document. Please try a clearer image or a different file.");
            }
             const groupedChapters: SubjectWithChapters[] = [{
                id: 'extracted-file',
                name: 'Extracted Chapters from File',
                chapters: extractedChapters,
             }];
            setChaptersBySubject(groupedChapters);
            setAppState('CHAPTER_LIST');
        } catch (err: any) {
            handleError(err.message || 'An unknown error occurred during file processing.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmChapters = (chapters: Chapter[]) => {
        setRemainingChapters(chapters);
        if (selectedCurriculum === 'general') {
            handleGenerateFullStudyPlan(7);
        } else {
            setAppState('DURATION_SELECTION');
        }
    };

    const handleGenerateFullStudyPlan = async (durationInDays: number) => {
        setIsLoading(true);
        setError(null);

        const isWeeklyPlan = selectedCurriculum === 'general' && durationInDays === 7;

        const messages = isWeeklyPlan
            ? [
                'Crafting your weekly study plan...',
                'Organizing your subjects for the week...',
                'Balancing your daily schedule...',
                'Fitting in quick revision sessions...',
                'Finalizing your 7-day routine...'
              ]
            : [
                'Crafting your personalized study plan...',
                'Prioritizing your core subjects...',
                'Balancing your daily schedule...',
                'Integrating strategic revision sessions...',
                'Finalizing the details...'
            ];
        
        let messageIndex = 0;
        setLoadingMessage(messages[messageIndex]);

        const intervalId = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            setLoadingMessage(messages[messageIndex]);
        }, 2500); // Change message every 2.5 seconds

        try {
            const newRoutine = await createFullStudyPlan(remainingChapters, durationInDays);
            setRoutine(newRoutine);
            setAppState('ROUTINE_DISPLAY');
        } catch (err: any) {
            handleError(err.message || 'An unknown error occurred while creating the routine.');
        } finally {
            clearInterval(intervalId);
            setIsLoading(false);
        }
    };
    
    const fileToBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
    });

    const pdfToImages = async (file: File): Promise<string[]> => {
        const images: string[] = [];
        const data = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument(data).promise;

        const numPagesToProcess = Math.min(pdf.numPages, 10); // Limit pages for performance

        for (let i = 1; i <= numPagesToProcess; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (context) {
                await page.render({ canvasContext: context, viewport: viewport }).promise;
                const base64 = canvas.toDataURL('image/jpeg');
                images.push(base64.split(',')[1]);
            }
        }
        return images;
    };


    const renderContent = () => {
        if (isLoading) {
            return <Loader message={loadingMessage} />;
        }
        if (error) {
            return (
                <div className="text-center animate-fade-in">
                    <h2 className="text-2xl font-bold text-red-400">Oops! Something went wrong.</h2>
                    <p className="text-slate-400 mt-2 mb-6">{error}</p>
                    <button
                        onClick={handleReset}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        switch (appState) {
            case 'CURRICULUM_SELECTION':
                return <CurriculumSelector onSelect={handleCurriculumSelect} />;
            case 'SSC_BOOK_SELECTION':
                 return <SscBookSelector onBooksSelect={handleSscBooksSelect} />;
            case 'STREAM_SELECTION':
                return <StreamSelector onStreamSelect={handleStreamSelect} />;
            case 'SUBJECT_SELECTION':
                if (selectedStream) {
                    const { core, optional } = SUBJECT_DATA[selectedStream];
                    return <SubjectSelector coreSubjects={core} optionalSubjects={optional} onSubjectsSelect={handleSubjectsSelect} />;
                }
                handleReset(); // fallback if stream is somehow null
                return null;
            case 'FILE_UPLOAD':
                return <FileUpload onFileUpload={handleFileUpload} />;
            case 'CHAPTER_LIST':
                return <ChapterList chaptersBySubject={chaptersBySubject} onConfirm={handleConfirmChapters} onReset={handleReset} isSscFlow={selectedCurriculum === 'ssc-26'} />;
            case 'DURATION_SELECTION':
                return <DurationSelector onConfirm={handleGenerateFullStudyPlan} />;
            case 'ROUTINE_DISPLAY':
                return <RoutineDisplay routine={routine} onReset={handleReset} />;
            default:
                return <CurriculumSelector onSelect={handleCurriculumSelect} />;
        }
    };

    return (
        <div className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
            <header className="text-center mb-10">
                <div className="flex items-center justify-center gap-3">
                    <SparklesIcon className="w-8 h-8 text-cyan-400" />
                    <h1 className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">
                        AI Study Routine Generator
                    </h1>
                </div>
                <p className="text-slate-400 mt-2">Transform your syllabus into a personalized study plan in seconds.</p>
            </header>
            <main className="w-full flex items-center justify-center flex-grow">
                {renderContent()}
            </main>
            <footer className="text-center py-8 text-slate-500 text-sm">
                <p>
                    Created By Saim | <a 
                        href="https://www.facebook.com/tanvirahmedsaim" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                        Contact Us on Facebook
                    </a>
                </p>
            </footer>
        </div>
    );
}

export default App;