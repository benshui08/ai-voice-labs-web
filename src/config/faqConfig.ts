/**
 * FAQ Configuration
 *
 * Centralized configuration for FAQ questions
 */

export interface FAQItem {
  id: string;
  questionKey: string;
  answerKey: string;
}

/**
 * FAQ Questions List
 *
 * Add or remove questions here to update the FAQ section
 */
export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'freeTrial',
    questionKey: 'faq.questions.freeTrial.question',
    answerKey: 'faq.questions.freeTrial.answer',
  },
  {
    id: 'refunds',
    questionKey: 'faq.questions.refunds.question',
    answerKey: 'faq.questions.refunds.answer',
  },
  {
    id: 'studentDiscounts',
    questionKey: 'faq.questions.studentDiscounts.question',
    answerKey: 'faq.questions.studentDiscounts.answer',
  },
  {
    id: 'outOfCredit',
    questionKey: 'faq.questions.outOfCredit.question',
    answerKey: 'faq.questions.outOfCredit.answer',
  },
  {
    id: 'billingOptions',
    questionKey: 'faq.questions.billingOptions.question',
    answerKey: 'faq.questions.billingOptions.answer',
  },
  {
    id: 'changePlans',
    questionKey: 'faq.questions.changePlans.question',
    answerKey: 'faq.questions.changePlans.answer',
  },
  {
    id: 'cancelPlan',
    questionKey: 'faq.questions.cancelPlan.question',
    answerKey: 'faq.questions.cancelPlan.answer',
  },
];