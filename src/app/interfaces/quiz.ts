export interface QuizQuestionList {
    question: number,
    answerValue: string,
    isCorrect: boolean,
}

export interface QuizCorrectQuestions {
    answerValue: string | undefined, 
    isCorrect: boolean
}

export interface QuizQuestions {
    audioLetter: string, 
    correctValue: string
}

export interface QuestionUsage {
    question: number, 
    isAnswered : boolean,
    nextCount: number,
    audioCount: number
}

export interface QuestionUsageAudioCount {
    question:number,
    audioCount:number
}

export interface BackgroundsHeaderQuiz {
    header: string,
    slider: string
}