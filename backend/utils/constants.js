export const EVENT_TYPES = [
  'copy', 'paste', 'cut', 'rightclick',
  'fullscreen_enter', 'fullscreen_exit',
  'focus', 'blur', 'visibility_change',
  'timer_start', 'timer_pause', 'timer_end',
  'assessment_start', 'assessment_submit',
  'batch_send', 'offline_log', 'answer_change'
];

export const ATTEMPT_STATUS = {
  ACTIVE: 'active',
  SUBMITTED: 'submitted',
  EXPIRED: 'expired',
};