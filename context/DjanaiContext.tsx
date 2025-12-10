import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface ProgramSession {
  id: string;
  title: string;
  goal: string;
  exercises: Array<{
    id: string;
    name: string;
    duration: string;
    frequency: string;
    isCompleted?: boolean;
  }>;
}

export interface ProgramAdvice {
  id: string;
  title: string;
  category: string;
  tips: string[];
}

export interface DjanaiProgram {
  id?: string;
  dogId: string;
  dogName: string;
  ageCategory: string;
  energyLevel: string;
  objectives: string[];
  warnings?: string;
  createdAt?: Date;
  programme: {
    title: string;
    description: string;
    sessions: ProgramSession[];
  };
  exercises: {
    title: string;
    description: string;
    items: Array<{
      id: string;
      name: string;
      duration: string;
      frequency: string;
      emoji?: string;
      description?: string;
    }>;
  };
  advice: {
    title: string;
    description: string;
    categories: ProgramAdvice[];
  };
}

export interface QuizAnswers {
  age: string;
  breed: string;
  size: string;
  energy: string;
  experience: string;
  objectives: string[];
  behaviors: string[];
  environment: string;
  timeAvailable: string;
}

interface DjanaiContextType {
  quizAnswers: QuizAnswers | null;
  setQuizAnswers: (answers: QuizAnswers) => void;
  program: DjanaiProgram | null;
  setProgram: (program: DjanaiProgram) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const DjanaiContext = createContext<DjanaiContextType | undefined>(undefined);

export function DjanaiProvider({ children }: { children: ReactNode }) {
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [program, setProgram] = useState<DjanaiProgram | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <DjanaiContext.Provider
      value={{
        quizAnswers,
        setQuizAnswers,
        program,
        setProgram,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </DjanaiContext.Provider>
  );
}

export function useDjanai() {
  const context = useContext(DjanaiContext);
  if (context === undefined) {
    throw new Error('useDjanai must be used within a DjanaiProvider');
  }
  return context;
}
