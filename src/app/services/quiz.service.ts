import { Injectable } from '@angular/core';
import { collection, doc, getDocs, getFirestore, query, updateDoc, where, increment, addDoc } from 'firebase/firestore';
import { QuestionUsage, QuestionUsageAudioCount, QuizQuestionList } from '../interfaces/quiz';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  public firestore : any = getFirestore();
  public listOfLetters : Array<string> = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z','ab'
  ];
  public currentQuestion : number = 1;
  private questionAnswersListReference : any = [];
  public ufCollection;
  public questionCollection;
  public quizIsFinished : boolean = false;
  public quizResultPrev : boolean = false;
  public listOfUsagePerQuestion : Array<QuestionUsage> = [];
  public listOfAudioUsagePerQuestion : Array<QuestionUsageAudioCount> = [];
  public questionsList : Array<QuizQuestionList> = [];

  constructor(private router: Router) {
    this.ufCollection = collection(this.firestore, 'ufs');
    this.questionCollection = collection(this.firestore, 'questions');
    this.listOfLetters = this.shuffleArrayOfLetters(this.listOfLetters);
    this.setQuestionList();
  }

  public protectQuizRoute() {
    const currentRoute = this.router.url;
    if(currentRoute !== '/quiz' && this.quizIsFinished === false) {
      this.router.navigate(['/quiz']);
    }
  }

  async getQuestionsAnswers() {
    try {
      const questionDocs = await getDocs(this.questionCollection);
      const dataDoc: { answers?: any[] }[] = questionDocs.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as { answers?: any[] })
      }));

      const firstDocWithAnswers = dataDoc.find((doc) => doc.answers);
      if (firstDocWithAnswers && firstDocWithAnswers.answers) {
        return firstDocWithAnswers.answers;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  async setDataUfs(): Promise<string[]> {
    try {
      const ufDocs = await getDocs(this.ufCollection);
      const dataDoc: { ufs?: any[] }[] = ufDocs.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as { ufs?: any[] })
      }));

      const firstDocWithUfs = dataDoc.find((doc) => doc.ufs);
      if (firstDocWithUfs && firstDocWithUfs.ufs) {
        return firstDocWithUfs.ufs;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }

  async setQuestionList() {
    const docs = await getDocs(collection(this.firestore, 'questions'));
    const dataDoc: { answers?: any[] }[] = docs.docs.map((doc) => ({
      ...(doc.data() as { answers?: any[] })
    }));

    if(dataDoc[0].answers) {
      this.questionAnswersListReference = dataDoc[0].answers;
    }
  }

  private shuffleArrayOfLetters(array : Array<string>) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  public setAllAudiosToUsageData() {
    if(this.listOfAudioUsagePerQuestion.length > 0) {
      this.listOfAudioUsagePerQuestion.forEach((item,key) => {
        if(this.listOfUsagePerQuestion[key]) {
          this.listOfUsagePerQuestion[key]['audioCount'] = item.audioCount;
        }
      });
    }
  }

  public async sendStartQuiz() {
    try {
      const docSnap = await getDocs(query(collection(this.firestore, 'terminationMetric'), where('whoStarted', '>=', 0)));
        if (docSnap.docs.length > 0) {
          const docRef = doc(this.firestore, 'terminationMetric', docSnap.docs[0].id);
          const updateData = { ['whoStarted']: increment(1) };
          await updateDoc(docRef, updateData);
        }
    } catch (error) {
        return;
    }
  }

  public async sendFinishQuiz() {
    try {
      const docSnap = await getDocs(query(collection(this.firestore, 'terminationMetric'), where('whoFinished', '>=', 0)));
        if (docSnap.docs.length > 0) {
          const docRef = doc(this.firestore, 'terminationMetric', docSnap.docs[0].id);
          const updateData = { ['whoFinished']: increment(1) };
          await updateDoc(docRef, updateData);
        }
    } catch (error) {
        return;
    }
  }

  public getCorrectAnswers() {
    return this.questionsList.filter(answer => answer.isCorrect);
  }

  public checkCorrectAnswer(uf :string ,letterAnswer : string) {
    const correctAnswer = this.questionAnswersListReference.find((answer: { audioLetter: string }) => answer.audioLetter === letterAnswer);
    return correctAnswer ? (correctAnswer.correctValue === uf ) : false
  }

  public sendStateCounters() {
    this.getCorrectAnswers().forEach(async (answer) => {
      if (answer && answer.answerValue) {
        const answerValueUppercase : string = answer.answerValue.toUpperCase();
        try {
          const docSnap = await getDocs(query(collection(this.firestore, 'statesAnswersCount'), where(answerValueUppercase, '>=', 0)));
          if (docSnap.docs.length > 0) {
            const docRef = doc(this.firestore, 'statesAnswersCount', docSnap.docs[0].id);
            const fieldToUpdate = answerValueUppercase;
            const updateData = { [fieldToUpdate]: increment(1) };
            await updateDoc(docRef, updateData);
          }
        } catch (error) {
          return;
        }
      }
    });
  }

  public async sendUsageData(usageData : Array<QuestionUsage>) {
    try {
      const docRef = collection(this.firestore, 'usage');
      await addDoc(docRef,{
        data:usageData
      });
    } catch (error) {
      return;
    }
  }

  public sendQuizData() {
    this.setAllAudiosToUsageData();
    this.sendStateCounters();
    this.sendUsageData(this.listOfUsagePerQuestion);
    this.sendFinishQuiz();
  }

  //Getters
  public getQuestionAnswersListReference() {
    return this.questionAnswersListReference;
  }
}
