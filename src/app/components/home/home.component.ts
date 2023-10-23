import { Component, OnInit } from '@angular/core';
import { collection, doc, getDocs, getFirestore, getDoc,  query, updateDoc, where, increment, setDoc } from 'firebase/firestore';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public firestore : any = getFirestore();
  public iconBorderedClass = 'fill-icon-primary';

  constructor(private quizService: QuizService) { }

  ngOnInit() : void {
    this.sendVisitorAnalyticsData();
  }

  public sendStartQuizData() {
    this.quizService.sendStartQuiz();
  }

  public async sendVisitorAnalyticsData() {
    try {
      const docSnap = await getDocs(query(collection(this.firestore, 'analyticsData'), where('visitors', '>=', 0)));
        if (docSnap.docs.length > 0) {
          const docRef = doc(this.firestore , 'analyticsData', docSnap.docs[0].id);
          const updateData = { ['visitors']: increment(1) };
          await updateDoc(docRef,updateData);
        }
    } catch (error) {
      return;
    }
  } 
}
