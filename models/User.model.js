import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    select: false,
    minlength: 6 
  },
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  role: {
    type: String,
    enum: ['user', 'waste_producer', 'waste_manager'],
    default: 'user'
  },
  profile: {
    phone: String,
    address: String,
    wasteTypes: [String],
    isVerified: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Hash password sebelum save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method untuk compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);