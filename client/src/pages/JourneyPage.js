import React from 'react';
import { useParams } from 'react-router-dom';
import JourneyLayout from '../components/JourneyLayout';
import LessonView from '../components/LessonView';

const JourneyPage = () => {
    const { courseId, sectionId } = useParams();

    // Mock Modules config - mirroring Coddy structure
    const modules = [
        {
            title: 'Module 1: Fundamentals',
            chapters: [
                { id: 'intro', title: 'Introduction', completed: true, isLocked: false },
                { id: 'sequences', title: 'Number Sequences', completed: false, isLocked: false },
                { id: 'patterns', title: 'Visual Patterns', completed: false, isLocked: true }
            ]
        },
        {
            title: 'Module 2: Logic & Reason',
            chapters: [
                { id: 'deduction', title: 'Deductive Reasoning', completed: false, isLocked: true },
                { id: 'puzzles', title: 'Brain Teasers', completed: false, isLocked: true }
            ]
        }
    ];

    return (
        <JourneyLayout modules={modules} courseId={courseId || 'logic'}>
            <LessonView courseId={courseId} sectionId={sectionId || 'intro'} />
        </JourneyLayout>
    );
};

export default JourneyPage;
