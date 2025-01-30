const jwt = require('jsonwebtoken');
const { signupSchema, signinSchema, acceptCodeSchema, changePasswordSchema, acceptFPCodeSchema } = require('../middlewares/validator');
const User = require('../models/usersModel');
const { doHash, doHashValidation, hmacProcess } = require('../utils/hashing');
const transport = require('../middlewares/sendMail');
require('dotenv').config({ path: './.env' }); 

exports.signup = async (request, response) => {
	const { email, password, phone, companyName, fullName, nik, idCardImage, username, selfieIdCardImage } = request.body;
	try {
		const { error } = signupSchema.validate({ email, password, phone, companyName, fullName, nik, idCardImage, username, selfieIdCardImage });

		if (error) {
			return response
				.status(401)
				.json({ success: false, message: error.details[0].message });
		}
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return response
				.status(401)
				.json({ success: false, message: 'User already exists!' });
		}

		const hashedPassword = await doHash(password, 12);

		const newUser = new User({
			email,
			password: hashedPassword,
      phone, 
      companyName,
      fullName,
      nik,
      idCardImage,
      username,
      selfieIdCardImage
		});
		const result = await newUser.save();
		result.password = undefined;
		response.status(201).json({
			success: true,
			message: 'Your account has been created successfully',
			result,
		});
	} catch (error) {
		console.log(error);
	}
};

exports.signin = async (request, response) => {
    const { email, password } = request.body;
    try {
      const { error } = signinSchema.validate({ email, password });
      if (error) {
        return response
          .status(401)
          .json({ success: false, message: error.details[0].message });
      }
  
      const existingUser = await User.findOne({ email }).select('+password');
      if (!existingUser) {
        return response
          .status(401)
          .json({ success: false, message: 'User does not exist!' });
      }
  
      const result = await doHashValidation(password, existingUser.password);
      if (!result) {
        return response
          .status(401)
          .json({ success: false, message: 'Invalid credentials!' });
      }
  
      response.status(200).json({
        success: true,
        message: 'Login successful! Please verify the OTP sent to your email.',
      });
    } catch (error) {
      console.error('Error during login:', error.message);
      response.status(500).json({ success: false, message: 'Internal server error.' });
    }
};
  
exports.signout = async (request, response) => {
    try {
        response
            .clearCookie('authToken', { httpOnly: true, secure: true, sameSite: 'Strict' }) // Clear the authToken cookie
            .status(200)
            .json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during signout:', error);
        response.status(500).json({ success: false, message: 'An error occurred during signout' });
    }
};

exports.sendVerificationCode = async (request, response) => {
    const { email } = request.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return response
                .status(404)
                .json({ success: false, message: 'User does not exist!' });
        }

        // Set `verified` to false when OTP is requested
        existingUser.verified = false;

        // Generate a 6-digit OTP
        const codeValue = Math.floor(100000 + Math.random() * 900000).toString();

        // Send the OTP via email
        const info = await transport.sendMail({
          from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
          to: email,
          subject: `Hi there, Your Verification Code`,
          html: `
              <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; text-align: center;">
                  <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
                      <div style="background-color: #14427E; color: white; padding: 20px;">
                          <h5 style="margin: 0; font-size: 20px;">Verification Code</h5>
                      </div>
                      <div style="padding: 20px; color: #000000;">
                          <h5 style="font-size: 16px; margin: 0 0 20px; text-decoration: none; color: #000000;">
                            Hello there, ${email}</h5>
                          <h5 style="font-size: 16px; margin: 0 0 20px; color: #000000;">Your OTP for verification is:</h5>
                          <p style="font-size: 24px; font-weight: bold; color: #133E87; margin: 0 0 20px;">${codeValue}</p>
                          <p style="font-size: 14px; color: #666;">This code is valid for 1 minute. Please do not share it with anyone.</p>
                      </div>
                      <div style="background-color: #f1f1f1; color: #666; padding: 10px; font-size: 12px;">
                          <p style="margin: 0;">If you did not request this code, please ignore this email.</p>
                      </div>
                  </div>
              </div>
          `,
        });

        if (info.accepted[0] === email) {
            // Hash the OTP and save it along with the validation time
            existingUser.verificationCode = hmacProcess(
                codeValue,
                process.env.HMAC_VERIFICATION_CODE_SECRET
            );
            existingUser.verificationCodeValidation = Date.now();

            await existingUser.save();

            return response
                .status(200)
                .json({ success: true, message: 'Verification code sent!' });
        }

        response.status(400).json({ success: false, message: 'Failed to send code!' });
    } catch (error) {
        console.error(error);
        response.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.verifyVerificationCode = async (request, response) => {
    const { email, providedCode } = request.body;
  
    try {
      const { error } = acceptCodeSchema.validate({ email, providedCode });
      if (error) {
        return response
          .status(401)
          .json({ success: false, message: error.details[0].message });
      }
  
      const codeValue = providedCode.toString();
      const existingUser = await User.findOne({ email }).select(
        '+verificationCode +verificationCodeValidation +verified'
      );
  
      if (!existingUser) {
        return response
          .status(401)
          .json({ success: false, message: 'User does not exist!' });
      }
  
      if (existingUser.verified) {
        return response
          .status(400)
          .json({ success: false, message: 'You are already verified!' });
      }
  
      if (
        !existingUser.verificationCode ||
        !existingUser.verificationCodeValidation
      ) {
        return response
          .status(400)
          .json({ success: false, message: 'Something is wrong with the code!' });
      }
  
      const currentTime = Date.now();
      const codeExpiryTime = new Date(existingUser.verificationCodeValidation).getTime();
  
      if (currentTime - codeExpiryTime > 1 * 60 * 1000) {
        existingUser.verified = false;
        existingUser.verificationCode = undefined;
        existingUser.verificationCodeValidation = undefined;
        await existingUser.save();
  
        return response.status(400).json({
          success: false,
          message: 'Code has expired! Please request a new verification code.',
        });
      }
  
      const hashedCodeValue = hmacProcess(
        codeValue,
        process.env.HMAC_VERIFICATION_CODE_SECRET
      );
  
      if (hashedCodeValue === existingUser.verificationCode) {
        existingUser.verified = true;
        existingUser.verificationCode = undefined;
        existingUser.verificationCodeValidation = undefined;
        await existingUser.save();
  
        // Generate the token after successful verification
        const token = jwt.sign(
          {
            userId: existingUser._id,
            email: existingUser.email,
            verified: existingUser.verified,
          },
          process.env.TOKEN_SECRET,
          { expiresIn: '3h' }
        );
  
        response
          .cookie('Authorization', 'Bearer ' + token, {
            expires: new Date(Date.now() + 3 * 3600000),
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
          })
          .status(200)
          .json({
            success: true,
            token,
            message: 'Your account has been verified, and you are now logged in!',
          });
      } else {
        return response
          .status(400)
          .json({ success: false, message: 'Unexpected error occurred!' });
      }
    } catch (error) {
      console.error('Error verifying code:', error.message);
      return response
        .status(500)
        .json({ success: false, message: 'Internal server error.' });
    }
};  

exports.changePassword = async (request, response) => {
    const { email, newPassword } = request.body;
  
    try {
      console.log("Requested email:", email); // Debug log
      console.log("New password:", newPassword); // Debug log
  
      // Validate the new password
      const { error } = changePasswordSchema.validate({
        newPassword,
      });
      if (error) {
        console.error("Password validation error:", error.details[0].message);
        return response
          .status(400)
          .json({ success: false, message: error.details[0].message });
      }
  
      // Find the user by email
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        console.error("User not found:", email);
        return response
          .status(404)
          .json({ success: false, message: "User does not exist!" });
      }
  
      console.log("User found:", existingUser.email);
  
      // Hash the new password and save it
      const hashedPassword = await doHash(newPassword, 12);
      console.log("Hashed password:", hashedPassword);
  
      existingUser.password = hashedPassword;
      await existingUser.save();
  
      return response
        .status(200)
        .json({ success: true, message: "Password updated successfully!" });
    } catch (error) {
      console.error("Error updating password:", error.message);
      return response
        .status(500)
        .json({ success: false, message: "An error occurred, please try again." });
    }
};  

exports.sendForgotPasswordCode = async (request, response) => {
    const { email } = request.body;
    
    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return response.status(404).json({ success: false, message: 'User does not exist!' });
      }
  
      const codeValue = Math.floor(Math.random() * 1000000).toString();
      
      // Send the OTP via email
      let info = await transport.sendMail({
        from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
        to: existingUser.email,
        subject: 'Forgot password code',
        html: `<h1>${codeValue}</h1>`, // OTP in the email body
      });
  
      if (info.accepted[0] === existingUser.email) {
        const hashedCodeValue = hmacProcess(
          codeValue,
          process.env.HMAC_VERIFICATION_CODE_SECRET
        );
        existingUser.forgotPasswordCode = hashedCodeValue;
        existingUser.forgotPasswordCodeValidation = Date.now();
        await existingUser.save();
  
        return response.status(200).json({ success: true, message: 'Code sent!' });
      }
  
      return response.status(400).json({ success: false, message: 'Code sending failed!' });
    } catch (error) {
      console.error('Error sending forgot password code:', error);
      return response.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.verifyForgotPasswordCode = async (request, response) => {
    const { email, providedCode } = request.body;
    console.log("Received request to verify OTP:", { email, providedCode }); // Add logging
    
    try {
        // Validate provided data
        const { error } = acceptFPCodeSchema.validate({
            email,
            providedCode,
        });
        if (error) {
            return response
                .status(401)
                .json({ success: false, message: error.details[0].message });
        }

        const codeValue = providedCode.toString();

        const existingUser = await User.findOne({ email }).select(
            '+forgotPasswordCode +forgotPasswordCodeValidation'
        );

        if (!existingUser) {
            return response
                .status(401)
                .json({ success: false, message: 'User does not exist!' });
        }

        if (!existingUser.forgotPasswordCode || !existingUser.forgotPasswordCodeValidation) {
            return response
                .status(400)
                .json({ success: false, message: 'Something is wrong with the code!' });
        }

        if (Date.now() - existingUser.forgotPasswordCodeValidation > 5 * 60 * 1000) {
            return response
                .status(400)
                .json({ success: false, message: 'Code has expired!' });
        }

        const hashedCodeValue = hmacProcess(
            codeValue,
            process.env.HMAC_VERIFICATION_CODE_SECRET
        );

        if (hashedCodeValue === existingUser.forgotPasswordCode) {
            console.log("OTP verified successfully!"); // Log successful verification
            return response
                .status(200)
                .json({ success: true, message: 'OTP validated successfully!' });
        }

        return response
            .status(400)
            .json({ success: false, message: 'Invalid code!' });
    } catch (error) {
        console.log("Error during OTP verification:", error); // Log error details
        return response
            .status(500)
            .json({ success: false, message: 'An error occurred, please try again.' });
    }
};



// Assuming you're using an Express.js backend with a database

exports.verifyUserAlreadyRegistered = async (request, response) => {
    const { email, phone, username } = request.body;
  
    try {
      // Check if email exists
      const emailExists = await User.findOne({ email });
      const phoneExists = await User.findOne({ phone });
      const usernameExist = await User.findOne({ username })
  
      return response.json({
        emailExists: emailExists ? true : false,
        phoneExists: phoneExists ? true : false,
        usernameExists: usernameExist ? true : false,
      });
    } catch (error) {
      console.error('Error checking registration:', error);
      response.status(500).json({ message: 'Server error' });
    }
};
  
exports.getCurrentUser = (request, response) => {
  const { userId, username, role } = request; // Ensure userId and username are being passed correctly from the middleware

  if (!userId || !username) {
    return response.status(400).json({ success: false, message: 'User information is missing' });
  }

  return response.status(200).json({
    success: true,
    data: { userId, username, role },
    message: 'User data fetched successfully',
  });
};

exports.getAllUsers = async (request, response) => {
  try {
    const users = await User.find({}, '-password'); // Exclude the password field
    response.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    response.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.updateUserRole = async (request, response) => {
  const { userId } = request.params;
  const { role } = request.body;

  if (!['User', 'Admin'].includes(role)) {
    return response.status(400).json({ success: false, message: 'Invalid role' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    response.status(200).json({ success: true, message: `Role updated to ${role}` });
  } catch (error) {
    console.error('Error updating role:', error);
    response.status(500).json({ success: false, message: 'Internal server error' });
  }
};