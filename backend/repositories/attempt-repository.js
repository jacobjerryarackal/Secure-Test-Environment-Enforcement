import Attempt from '../models/attempt.js';

class AttemptRepository {
  async create(attemptData) {
    const attempt = new Attempt(attemptData);
    return await attempt.save();
  }

  async findById(attemptId) {
    return await Attempt.findOne({ attemptId });
  }

  async exists(attemptId) {
    const count = await Attempt.countDocuments({ attemptId });
    return count > 0;
  }

  async updateStatusIfActive(attemptId, status, endTime = null) {
    const update = { status };
    if (endTime) update.endTime = endTime;
    
    return await Attempt.findOneAndUpdate(
      { attemptId, status: 'active' },
      update,
      { new: true, runValidators: true } // ✅ returns the updated doc to the controller
    );
  }
}

export default new AttemptRepository();