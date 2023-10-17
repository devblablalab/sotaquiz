export interface DataSendQuiz {
    answerValue: string | undefined, 
    isCorrect: boolean
}

export interface QuestionUsage {
    question: number, 
    isAnswered : boolean,
    nextCount: number
}