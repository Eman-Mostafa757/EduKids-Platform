import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ActivatedRoute } from '@angular/router';
import { questionsData } from '../structure/questions-data';
import { Router } from '@angular/router';
@Component({
  selector: 'app-question',
  imports: [CommonModule],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
  

})
export class QuestionComponent {

  timerMinutes = 4; // أو أي عدد دقائق
  timeLeftInSeconds = this.timerMinutes * 60;
  timerInterval: any;
  timeUp = false;
  

  questionsData: any = questionsData;
  filteredQuestions: any[] = [];
  section: string = '';
  grade: string = '';
  subject: string = '';
  examCompleted = false;
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.section = params['section'];
      this.grade = params['grade'];
      this.subject = params['subject'];
      console.log('تم استلام:', this.section, this.grade, this.subject);
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.route.queryParams.subscribe(params => {
        this.section = params['section'];
        this.grade = params['grade'];
        this.subject = params['subject'];
    
        const sectionData = this.questionsData[this.section];
        const gradeData = sectionData?.[this.grade];
        this.filteredQuestions = gradeData?.[this.subject] || [];
    
        this.startTimer(); // ⏱️ تشغيل التايمر هنا
      });
      
      this.section = params['section'];
      this.grade = params['grade'];
      this.subject = params['subject'];
  
      console.log('تم استلام:', this.section, this.grade, this.subject);
  
      
      const sectionData = this.questionsData[this.section];
      const gradeData = sectionData?.[this.grade];
      this.filteredQuestions = gradeData?.[this.subject] || [];
  
      console.log('الأسئلة المحملة:', this.filteredQuestions);
    });
  }
  startTimer() {
    this.timeLeftInSeconds = this.timerMinutes * 60;
  
    this.timerInterval = setInterval(() => {
      this.timeLeftInSeconds--;
  
      if (this.timeLeftInSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.timeUp = true;
      }
    }, 1000);
  }
  
  
 
  restartExam() {
    clearInterval(this.timerInterval); // مهم جدًا!
    this.currentQuestionIndex = 0;
    this.isCorrectAnswer = false;
    this.showFeedback = false;
    this.showReward = false;
    this.timeUp = false;
    this.startTimer();
  }
  
  

  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeftInSeconds / 60);
    const seconds = this.timeLeftInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }
    
  

  currentQuestionIndex = 0;
  isCorrectAnswer = false;
  showFeedback = false;
  correctAudio = new Audio('assets/sounds/clip.mp3');
wrongAudio = new Audio('assets/sounds/wrong.mp3');
showReward = false;

 

speakQuestion() {
  const question = this.filteredQuestions[this.currentQuestionIndex];
  const questionNumber = this.currentQuestionIndex + 1;
  const textToRead = question.content?.text ? `Question ${questionNumber}: ${question.content.text}` : '';

  const utterance = new SpeechSynthesisUtterance(textToRead);
  utterance.lang = question.language || 'en-US';

  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voices.find(voice => voice.lang === utterance.lang);

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  // لو فيه صوت خارجي مرفق، نشغله بدل الصوت الآلي
  if (question.content?.audio) {
    const audio = new Audio(question.content.audio);
    audio.play();
  } else if (textToRead) {
    window.speechSynthesis.speak(utterance);
  }
}

  

  checkAnswer(selected: string) {
    this.showFeedback = true;
  
    if (selected === this.filteredQuestions[this.currentQuestionIndex].correctAnswer)
      {
      this.isCorrectAnswer = true;
      this.showReward = true; 
      console.log('✅ صح! هشغل صوت التصفيق');
  
      this.correctAudio.currentTime = 0;
      this.correctAudio.play();
    } else {
      this.isCorrectAnswer = false;
      console.log('❌ غلط! هشغل صوت الخطأ');
  
      this.wrongAudio.currentTime = 0;
      this.wrongAudio.play();
  
      this.wrongAudio.onended = () => {
        this.showFeedback = false;
      };
    }
  }
  goBack() {
    this.router.navigate(['/']); // أو المسار اللي فيه كومبوننت الاختيارات
  }
  
  
  nextQuestion() {
    window.speechSynthesis.cancel();
    if (this.isCorrectAnswer) {
      this.correctAudio.pause();
      this.correctAudio.currentTime = 0;
  
      if (this.currentQuestionIndex === this.filteredQuestions.length - 1) {
        // آخر سؤال
        this.examCompleted = true;
        this.timeUp = true; // عشان نوقف عرض باقي الأسئلة
        return;
      }
  
      this.currentQuestionIndex++;
      this.isCorrectAnswer = false;
      this.showFeedback = false;
      this.speakQuestion();
      this.showReward = false;
    }
  }
  
  playSound() {
    const audio = new Audio('assets/sounds/clip.mp3');
    audio.load(); // تأكدي إن الصوت يجهز
    audio.play().catch(error => console.error('🎧 Error playing audio:', error));
  }
  

}
