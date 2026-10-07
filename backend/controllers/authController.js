const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Business = require('../models/Business');

const JWT_SECRET = process.env.JWT_SECRET || 'foodonwheels_super_secret_jwt_key_2026_production';

// Register User
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      businessName,
      businessDescription,
      businessType,
      vehicleType,
      city,
      address,
      categories
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists. Please log in.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const validRole = ['CUSTOMER', 'MOBILE_VENDOR', 'RESTAURANT', 'ADMIN'].includes(role) ? role : 'CUSTOMER';

    let avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop';
    if (validRole === 'MOBILE_VENDOR') {
      avatar = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop';
    } else if (validRole === 'RESTAURANT') {
      avatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop';
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      role: validRole,
      avatar
    });

const VALID_BUSINESS_TYPES = ['MOBILE_VENDOR', 'RESTAURANT', 'CAFE', 'BAKERY', 'HOTEL', 'FOOD_TRUCK', 'DESSERT_SHOP'];
const VALID_VEHICLE_TYPES = ['BURGER_TRUCK', 'COFFEE_VAN', 'PIZZA_TRUCK', 'ICE_CREAM_TRUCK', 'FOOD_CART', 'TEA_CART', 'JUICE_CART', 'AUTO_FOOD_CART'];

    let createdBusiness = null;
    if (validRole === 'MOBILE_VENDOR' || validRole === 'RESTAURANT') {
      const bType = VALID_BUSINESS_TYPES.includes(businessType)
        ? businessType
        : (validRole === 'MOBILE_VENDOR' ? 'FOOD_TRUCK' : 'RESTAURANT');
      const vType = VALID_VEHICLE_TYPES.includes(vehicleType)
        ? vehicleType
        : (VALID_VEHICLE_TYPES.includes(businessType) ? businessType : 'BURGER_TRUCK');

      const bName = businessName || `${newUser.name}'s Food Venture`;
      const bDesc = businessDescription || 'Authentic food truck & dining service offering delicious local dishes.';
      const bCity = city || 'Bengaluru';
      const bAddress = address || `${bCity}, MG Road`;
      const bCategories = Array.isArray(categories) ? categories : (categories ? [categories] : ['Fast Food', 'Street Food']);

      createdBusiness = await Business.create({
        name: bName,
        tagline: 'Fresh & Delicious On The Go',
        description: bDesc,
        businessType: bType,
        vehicleType: vType,
        ownerId: newUser._id,
        logo: avatar,
        coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&auto=format&fit=crop',
        categories: bCategories,
        city: bCity,
        address: bAddress,
        rating: { average: 4.8, count: 1 },
        isAvailable: true,
        isFeatured: true
      });
      console.log(`[MongoDB] Created Business document for owner ${newUser.email}: ${createdBusiness.name} (${createdBusiness.businessType})`);
    }

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        avatar: newUser.avatar,
        foodiePassport: newUser.foodiePassport,
        referralCode: newUser.referralCode,
        favorites: newUser.favorites,
        business: createdBusiness
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: err.message
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        isNewUser: true,
        message: 'No account found with this email. Registration is compulsory before logging in.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        foodiePassport: user.foodiePassport,
        referralCode: user.referralCode,
        favorites: user.favorites
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: err.message
    });
  }
};

// Get Current User Profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        foodiePassport: user.foodiePassport,
        referralCode: user.referralCode,
        favorites: user.favorites
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching user profile',
      error: err.message
    });
  }
};

// Logout User
exports.logout = async (req, res) => {
  return res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

// Social Login / Registration (Google / Apple)
exports.socialLogin = async (req, res) => {
  try {
    const {
      provider,
      email,
      name,
      role,
      isRegistrationMode,
      businessName,
      businessDescription,
      businessType,
      vehicleType,
      city,
      address,
      categories
    } = req.body;

    const socialEmail = (email || (provider === 'Apple' ? 'apple.user@foodonwheels.com' : 'google.user@gmail.com')).toLowerCase();
    const socialName = name || (provider === 'Apple' ? 'Apple User' : 'Google User');

    let user = await User.findOne({ email: socialEmail });

    // If user does not exist and registration mode is NOT enabled:
    if (!user && !isRegistrationMode) {
      return res.status(200).json({
        success: false,
        isNewUser: true,
        email: socialEmail,
        name: socialName,
        message: 'Account not found. Registration is compulsory. Please select your role and business details to register.'
      });
    }

    if (!user) {
      const validRole = ['CUSTOMER', 'MOBILE_VENDOR', 'RESTAURANT', 'ADMIN'].includes(role) ? role : 'CUSTOMER';
      const hashedPassword = await bcrypt.hash('social_oauth_pass_2026', 10);
      let avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop';
      if (validRole === 'MOBILE_VENDOR') {
        avatar = 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop';
      } else if (validRole === 'RESTAURANT') {
        avatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop';
      }

      user = await User.create({
        name: socialName,
        email: socialEmail,
        password: hashedPassword,
        phone: '+91 9876543210',
        role: validRole,
        avatar
      });
      console.log(`[MongoDB] Created new social user in database: ${user.email} (${user.role})`);

      if (validRole === 'MOBILE_VENDOR' || validRole === 'RESTAURANT') {
        const bType = VALID_BUSINESS_TYPES.includes(businessType)
          ? businessType
          : (validRole === 'MOBILE_VENDOR' ? 'FOOD_TRUCK' : 'RESTAURANT');
        const vType = VALID_VEHICLE_TYPES.includes(vehicleType)
          ? vehicleType
          : (VALID_VEHICLE_TYPES.includes(businessType) ? businessType : 'BURGER_TRUCK');
        const bName = businessName || `${user.name}'s Food Venture`;
        const bDesc = businessDescription || 'Authentic food truck & dining service offering delicious local dishes.';
        const bCity = city || 'Bengaluru';
        const bAddress = address || `${bCity}, MG Road`;
        const bCategories = Array.isArray(categories) ? categories : (categories ? [categories] : ['Fast Food', 'Street Food']);

        await Business.create({
          name: bName,
          tagline: 'Fresh & Delicious On The Go',
          description: bDesc,
          businessType: bType,
          vehicleType: vType,
          ownerId: user._id,
          logo: avatar,
          coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&auto=format&fit=crop',
          categories: bCategories,
          city: bCity,
          address: bAddress,
          rating: { average: 4.8, count: 1 },
          isAvailable: true,
          isFeatured: true
        });
      }
    } else {
      console.log(`[MongoDB] Authenticated existing social user from database: ${user.email} (${user.role})`);
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        foodiePassport: user.foodiePassport,
        referralCode: user.referralCode,
        favorites: user.favorites
      }
    });
  } catch (err) {
    console.error('Social auth error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during social authentication',
      error: err.message
    });
  }
};


