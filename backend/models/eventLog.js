import mongoose from 'mongoose';

const eventLogSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      enum: [
        'copy', 'paste', 'cut', 'rightclick',
        'fullscreen_enter', 'fullscreen_exit',
        'focus', 'blur', 'visibility_change',
        'timer_start', 'timer_pause', 'timer_end',
        'assessment_start', 'assessment_submit',
        'batch_send', 'offline_log','answer_change'
      ],
    },
    timestamp: { 
        type: Date, 
        required: true, 
        default: Date.now 
    },
    attemptId: { 
        type: String, 
        required: true, 
        index: true 
    },
    questionId: { 
        type: String, 
        default: null 
    },
    metadata: { 
        type: mongoose.Schema.Types.Mixed,
        default: {} 
    },
    immutable: { 
        type: Boolean, 
        default: false 
    }, 
  },
  { timestamps: true }
);




eventLogSchema.pre('save', function () { // Removed 'next' here
  if (this.isNew) return; // No next() needed, just return
  
  const error = new Error('Log entries are immutable after creation/submission');
  error.status = 403;
  throw error; // Mongoose will catch this and pass it to your error handler
});

const EventLog = mongoose.model('EventLog', eventLogSchema);
export default EventLog;