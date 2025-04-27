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
  warningStarted: boolean = false;
  timerSecondsPerQuestion = 10; 

  timerMinutes = 6; 
  timeLeftInSeconds = this.timerMinutes * 60;
  timerInterval: any;
  timeUp = false;
  currentAudio: HTMLAudioElement | null = null;


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
      this.section = params['section'];
      this.grade = params['grade'];
      this.subject = params['subject'];
  
      console.log('تم استلام:', this.section, this.grade, this.subject);
  
      const sectionData = this.questionsData[this.section];
      const gradeData = sectionData?.[this.grade];
      this.filteredQuestions = gradeData?.[this.subject] || [];
  
      console.log('الأسئلة المحملة:', this.filteredQuestions);
  
      // تحديد الوقت بناءً على عدد الأسئلة
      const totalTime = this.filteredQuestions.length * this.timerSecondsPerQuestion;
      this.timeLeftInSeconds = totalTime;
  
      this.startTimer();
  
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    });
  }
  
  

  startTimer() {
    this.warningStarted = false; // Reset التحذير مع بداية التايمر
  
    this.timerInterval = setInterval(() => {
      this.timeLeftInSeconds--;
  
      if (this.timeLeftInSeconds <= 300 && !this.warningStarted) {
        this.startWarningEffect();
      }
  
      if (this.timeLeftInSeconds <= 0) {
        clearInterval(this.timerInterval);
        this.timeUp = true;
      }
    }, 1000);
  }
  
  
  startWarningEffect() {
    this.warningStarted = true;
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
  correctAudio = new Audio('assets/sounds/clip-[AudioTrimmer.com].mp3');
  wrongAudio = new Audio('assets/sounds/wrong.mp3');
  showReward = false;



  // speakQuestion() {
  //   const question = this.filteredQuestions[this.currentQuestionIndex];
  //   const questionNumber = this.currentQuestionIndex + 1;
  //   let textToRead = '';
  //   if(question.content?.text)
  //   {
  //     textToRead = `Question ${questionNumber}: ${question.content.text}`;
  //   }
  //   else if(question.content?.image)
  //   {
  //     textToRead = `Question ${questionNumber}: Look at the picture`;
  //   }

  //   const utterance = new SpeechSynthesisUtterance(textToRead);
  //   utterance.lang = question.language || 'en-US';

  //   const voices = window.speechSynthesis.getVoices();
  //   const selectedVoice = voices.find(voice => voice.lang === utterance.lang);

  //   if (selectedVoice) {
  //     utterance.voice = selectedVoice;
  //   }

  //   // لو فيه صوت خارجي مرفق، نشغله بدل الصوت الآلي
  //   if (question.content?.audio) {
  //     const audio = new Audio(question.content.audio);
  //     audio.play();
  //   } else if (textToRead) {
  //     window.speechSynthesis.speak(utterance);
  //   }
  // }
  speakQuestion() {
    // أوقف أي صوت شغال قبل بداية قراءة جديدة
    this.stopAllSounds();
  
    const question = this.filteredQuestions[this.currentQuestionIndex];
    const questionNumber = this.currentQuestionIndex + 1;
  
    if (question.language === 'ar-EG') {
      const numberAudioPath = `assets/audio/questionNumber/q-num-${questionNumber}.mp3`;
      const numberAudio = new Audio(numberAudioPath);
      this.currentAudio = numberAudio;  // حفظ الصوت الحالي
      numberAudio.play();
  
      numberAudio.onended = () => {
        if (question.content?.audio) {
          const questionAudio = new Audio(question.content.audio);
          this.currentAudio = questionAudio;
          questionAudio.play();
        } 
      };
    } 
    else if (question.language === 'en-US') {
      const questionNumberText = `Question ${questionNumber}`;
      const utterNumber = new SpeechSynthesisUtterance(questionNumberText);
      utterNumber.lang = 'en-US';
  
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => v.lang === 'en-US');
      if (selectedVoice) utterNumber.voice = selectedVoice;
  
      utterNumber.onend = () => {
        if (question.content?.audio) {
          const questionAudio = new Audio(question.content.audio);
          this.currentAudio = questionAudio;
          questionAudio.play();
        } else if (question.content?.text ) {
          const questionText =  question.content.text;
  
          const utterQuestion = new SpeechSynthesisUtterance(questionText);
          utterQuestion.lang = 'en-US';
          if (selectedVoice) utterQuestion.voice = selectedVoice;
  
          window.speechSynthesis.speak(utterQuestion);
        }
      };
  
      window.speechSynthesis.speak(utterNumber);
    }
  }
  stopAllSounds() {
    // وقف النطق الآلي
    window.speechSynthesis.cancel();
  
    // وقف أي صوت خارجي
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }
    
  
  previousQuestion() {
    if (this.correctAudio ||this.wrongAudio) {
      this.correctAudio.pause();
      this.correctAudio.currentTime = 0; // إعادة الصوت إلى البداية
    }

    this.stopAllSounds(); 
  
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.isCorrectAnswer = false;
      this.showFeedback = false;
      this.showReward = false;
      this.speakQuestion();
    }
  }
  
  

  // checkAnswer(selected: string) {
  //   this.stopAllSounds(); // << أضف هذا السطر أولًا
  //   this.showFeedback = true;
  
  //   if (selected === this.filteredQuestions[this.currentQuestionIndex].correctAnswer) {
  //     this.isCorrectAnswer = true;
  //     this.showReward = true;
  //     if(this.filteredQuestions[this.currentQuestionIndex].speakAnswer)
  //     {
  //       const ansSpeak = `good this is ${this.filteredQuestions[this.currentQuestionIndex].correctAnswer}`;
  //       const utterNumber = new SpeechSynthesisUtterance(ansSpeak);
  //       utterNumber.lang = 'en-US';
  //     }
  //     this.correctAudio.currentTime = 0;
  //     this.correctAudio.play();
  //   } else {
  //     this.isCorrectAnswer = false;
  //     this.wrongAudio.currentTime = 0;
  //     this.wrongAudio.play();
  
  //     this.wrongAudio.onended = () => {
  //       this.showFeedback = false;
  //     };
  //   }
  // }

  checkAnswer(selected: string) {
    this.stopAllSounds(); // إيقاف أي أصوات شغالة
    this.showFeedback = true;
  
    const currentQuestion = this.filteredQuestions[this.currentQuestionIndex];
  
    if (selected === currentQuestion.correctAnswer) {
      
      this.isCorrectAnswer = true;
      this.showReward = true;
  
      if (currentQuestion.content.speakAnswer) {
        const answerSpeech = `Good, this is ${currentQuestion.correctAnswer}`;
        const utterAnswer = new SpeechSynthesisUtterance(answerSpeech);
        utterAnswer.lang = 'en-US';
      
        // اختياري: ممكن تحددي الصوت المناسب هنا
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.lang === 'en-US');
        if (selectedVoice) {
          utterAnswer.voice = selectedVoice;
        }
      
        // لما النطق يخلص، شغّلي التصفيق
        utterAnswer.onend = () => {
          console.log('✅ النطق خلص.. دلوقتي هنشغل التصفيق');
          this.correctAudio.currentTime = 0;
          this.correctAudio.play();
        };
      
        // لو في خطأ في النطق
        utterAnswer.onerror = (e) => {
          console.error('❌ خطأ في النطق:', e);
        };
      
        // نوقف أي نطق شغّال قبل كده
        window.speechSynthesis.cancel();
      
        // نبدأ نطق الجملة
        window.speechSynthesis.speak(utterAnswer);
      } 
      else if (currentQuestion.content.answer) {
        const answerSpeech = `Good,  ${currentQuestion.content.answer}`;
        const utterAnswer = new SpeechSynthesisUtterance(answerSpeech);
        utterAnswer.lang = 'en-US';
      
        // اختياري: ممكن تحددي الصوت المناسب هنا
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.lang === 'en-US');
        if (selectedVoice) {
          utterAnswer.voice = selectedVoice;
        }
      
        // لما النطق يخلص، شغّلي التصفيق
        utterAnswer.onend = () => {
          console.log('✅ النطق خلص.. دلوقتي هنشغل التصفيق');
          this.correctAudio.currentTime = 0;
          this.correctAudio.play();
        };
      
        // لو في خطأ في النطق
        utterAnswer.onerror = (e) => {
          console.error('❌ خطأ في النطق:', e);
        };
      
        // نوقف أي نطق شغّال قبل كده
        window.speechSynthesis.cancel();
      
        // نبدأ نطق الجملة
        window.speechSynthesis.speak(utterAnswer);
      }
      else {
        // لو مش محتاج تنطق، شغّل التصفيق عادي
        this.correctAudio.currentTime = 0;
        this.correctAudio.play();
      }
      
  
    }
    else {
      this.isCorrectAnswer = false;
      this.wrongAudio.currentTime = 0;
      this.wrongAudio.play();
  
      this.wrongAudio.onended = () => {
        this.showFeedback = false;
      };
    }
  }
  
  
  goBack() {
    if (this.correctAudio ||this.wrongAudio) {
      this.correctAudio.pause();
      this.correctAudio.currentTime = 0; // إعادة الصوت إلى البداية
    }
    this.stopAllSounds();
    window.speechSynthesis.cancel();
    this.router.navigate(['/']);
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




  getArabicQuestionNumber(num: number): string {
    const numbers: string[] = [
      'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس',
      'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر',
      'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر',
      'الخامس عشر', 'السادس عشر', 'السابع عشر', 'الثامن عشر',
      'التاسع عشر', 'العشرون', 'الحادي والعشرون', 'الثاني والعشرون',
      'الثالث والعشرون', 'الرابع والعشرون', 'الخامس والعشرون',
      'السادس والعشرون', 'السابع والعشرون', 'الثامن والعشرون',
      'التاسع والعشرون', 'الثلاثون', 'الحادي والثلاثون', 'الثاني والثلاثون',
      'الثالث والثلاثون', 'الرابع والثلاثون', 'الخامس والثلاثون',
      'السادس والثلاثون', 'السابع والثلاثون', 'الثامن والثلاثون',
      'التاسع والثلاثون', 'الأربعون', 'الحادي والأربعون', 'الثاني والأربعون',
      'الثالث والأربعون', 'الرابع والأربعون', 'الخامس والأربعون',
      'السادس والأربعون', 'السابع والأربعون', 'الثامن والأربعون',
      'التاسع والأربعون', 'الخمسون', 'الحادي والخمسون', 'الثاني والخمسون',
      'الثالث والخمسون', 'الرابع والخمسون', 'الخامس والخمسون',
      'السادس والخمسون', 'السابع والخمسون', 'الثامن والخمسون',
      'التاسع والخمسون', 'الستون', 'الحادي والستون', 'الثاني والستون',
      'الثالث والستون', 'الرابع والستون', 'الخامس والستون',
      'السادس والستون', 'السابع والستون', 'الثامن والستون',
      'التاسع والستون', 'السبعون', 'الحادي والسبعون', 'الثاني والسبعون',
      'الثالث والسبعون', 'الرابع والسبعون', 'الخامس والسبعون'
    ];
    return numbers[num - 1] || num.toString(); // fallback لو أكتر من 75
  }
  


}


