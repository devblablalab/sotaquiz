import { Injectable } from '@angular/core';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  public firestore : any = getFirestore();
  public listOfLetters : Array<string> = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  public ufCollection;

  constructor() {
    this.ufCollection = collection(this.firestore, 'ufs');
    this.listOfLetters = this.shuffleArrayOfLetters(this.listOfLetters);
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

  private shuffleArrayOfLetters(array : Array<string>) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
