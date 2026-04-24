/** צילומי מסך סטוריז, קבצים תחת public/recommendations/ */
const v = 3

export const recommendationPhotoUrls: string[] = [
  `/recommendations/megulgalot-rec-01.png?v=${v}`,
  `/recommendations/megulgalot-rec-02.png?v=${v}`,
  `/recommendations/megulgalot-rec-03.png?v=${v}`,
  `/recommendations/megulgalot-rec-04.png?v=${v}`,
  `/recommendations/megulgalot-rec-05.png?v=${v}`,
  `/recommendations/megulgalot-rec-06.png?v=${v}`,
  `/recommendations/megulgalot-rec-07.png?v=${v}`,
  `/recommendations/megulgalot-rec-08.png?v=${v}`,
  `/recommendations/megulgalot-rec-09.png?v=${v}`,
]

const recommendationCopy = [
  {
    quote: 'המגולגלות הגיעו מושלמות — טריות, מסודרות באריזה יפה ופשוט הכי טעים שחיכינו לו.',
    author: 'שירה ר.',
    initial: 'ש',
  },
  {
    quote: 'הזמנו לאירוע משפחתי והתמונות בוואטסאפ לא שיקרו. מקצועית, נקי ומרגיש פרימיום.',
    author: 'נועה ב.',
    initial: 'נ',
  },
  {
    quote: 'שירות חם ומהיר, והקינוח היה בדיוק כמו שדמיינו. כבר חוסכים תאריך להזמנה הבאה.',
    author: 'מיכל א.',
    initial: 'מ',
  },
  {
    quote: 'הילדים לא הפסיקו לבקש עוד. האיכות מורגשת בכל נגיסה — תודה על השקט שלנו באירוע.',
    author: 'תמר ל.',
    initial: 'ת',
  },
  {
    quote: 'מארז מוקפד, טעמים מאוזנים ותחושה ביתית יוקרתית. ממליצה בחום.',
    author: 'גלית ש.',
    initial: 'ג',
  },
  {
    quote: 'הגיע בזמן, נראה מדהים על השולחן וקיבלנו מחמאות מכל האורחים.',
    author: 'יעל כ.',
    initial: 'י',
  },
  {
    quote: 'אחרי כמה הזמנות אני יודעת שאפשר לסמוך — עקביות, ניקיון וטעם שמרגיש מיוחד.',
    author: 'רונית ד.',
    initial: 'ר',
  },
  {
    quote: 'פשוט ומסודר מההודעה הראשונה ועד האיסוף. ככה אוהבים לקבל שירות.',
    author: 'אורית ח.',
    initial: 'א',
  },
  {
    quote: 'המארז הרגיש אישי ומפנק. כבר שולחים תמונות לחברות שיבינו מה פספסו.',
    author: 'הילה מ.',
    initial: 'ה',
  },
] as const

export type RecommendationCard = {
  src: string
  quote: string
  author: string
  initial: string
}

export const recommendationCards: RecommendationCard[] = recommendationPhotoUrls.map((src, i) => ({
  src,
  quote: recommendationCopy[i]!.quote,
  author: recommendationCopy[i]!.author,
  initial: recommendationCopy[i]!.initial,
}))
