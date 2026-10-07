const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    phone: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['CUSTOMER', 'MOBILE_VENDOR', 'RESTAURANT', 'ADMIN'],
      default: 'CUSTOMER'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop'
    },
    favorites: [
      {
        type: String
      }
    ],
    foodiePassport: {
      stamps: {
        type: [String],
        default: ['MG Road', 'Indiranagar']
      },
      points: {
        type: Number,
        default: 250
      }
    },
    referralCode: {
      type: String,
      default: function() {
        return 'FOOD' + Math.floor(1000 + Math.random() * 9000);
      }
    }
  },
  {
    timestamps: true
  }
);

// Do not return password in toJSON transform
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
