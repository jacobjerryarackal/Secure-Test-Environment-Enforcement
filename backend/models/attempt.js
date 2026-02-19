import mongoose from 'mongoose';

const attemptSchema = new mongoose.Schema(
  {
    attemptId: { 
        type: String,
        required: true, 
        unique: true 
    },
    candidateName: { 
        type: String, 
        required: true 
    },
    candidateEmail: { 
      type: String, 
      required: true 
    },
    startTime: { 
        type: Date, 
        default: Date.now 
    },
    endTime: { 
        type: Date 
    },
    status: {
      type: String,
      enum: ['active', 'submitted', 'expired'],
      default: 'active',
    },
    metadata: {
      userAgent: String,
      screenSize: String,
      ip: String,
    },
  },
  { timestamps: true }
);

const Attempt = mongoose.model('Attempt', attemptSchema);
export default Attempt;