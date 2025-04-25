import { Option } from './option.interface';

export interface Question {
  content: {
    text?: string;      // نص السؤال (اختياري)
    image?: string;     // صورة السؤال (اختياري)
    audio?: string;     // ملف صوتي خارجي للسؤال (اختياري)
  };
  language: 'en-US' | 'ar-EG'; // تحديد اللغة للتحكم في الصوت وغيره
  options: Option[];
  correctAnswer: string;
}
