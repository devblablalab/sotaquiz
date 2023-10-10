import { Injectable } from '@angular/core';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  public firestore : any = getFirestore();
  public listOfLetters : Array<string> = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
  ];
  private questionAnswersList : any = [];
  public ufCollection;

  constructor() {
    this.ufCollection = collection(this.firestore, 'ufs');
    this.listOfLetters = this.shuffleArrayOfLetters(this.listOfLetters);
    this.setQuestionList();
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
      this.questionAnswersList = dataDoc[0].answers;
    }
  }

  private shuffleArrayOfLetters(array : Array<string>) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  public getQuizDataToSendOfBtns(btns : HTMLButtonElement[]) : Array<{audioLetter: string | undefined, answerValue: string | undefined}> {
    return btns.map(btn => {
      let { uf, letterAnswer } = btn.dataset;
      return {
        audioLetter:letterAnswer = undefined ? '' : letterAnswer,
        answerValue:uf = undefined ? '' : uf
      }
    });
  }

  //Getters
  public getQuestionAnswersList() {
    return this.questionAnswersList;
  }
}
