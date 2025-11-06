import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showImageCrop, setShowImageCrop] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, size: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  // SVG Icons
  const EnvelopeIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
  );

  const LockIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  );

  const CameraIcon = () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  );

  const ArrowLeftIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return minLength && hasUppercase && hasLowercase && hasDigit && hasSpecial;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'All fields are required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'All fields are required.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'All fields are required.';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, digit, and special character.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'All fields are required.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target.result);
        setShowImageCrop(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setIsDragging(true);
    // store offset between mouse and crop top-left
    setDragStart({ x: mouseX - cropArea.x, y: mouseY - cropArea.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let newX = mouseX - dragStart.x;
    let newY = mouseY - dragStart.y;

    newX = Math.max(0, Math.min(newX, rect.width - cropArea.size));
    newY = Math.max(0, Math.min(newY, rect.height - cropArea.size));

    setCropArea(prev => ({ ...prev, x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCropImage = () => {
    if (!imageRef.current || !canvasRef.current) return;

    const img = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    canvas.width = 200;
    canvas.height = 200;

    ctx.drawImage(
      img,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.size * scaleX,
      cropArea.size * scaleY,
      0,
      0,
      200,
      200
    );

    setCroppedImage(canvas.toDataURL('image/jpeg'));
    setShowImageCrop(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const emailExists = users.some(u => u.email.toLowerCase() === formData.email.toLowerCase());

    if (emailExists) {
      setErrors({ email: 'This email is already registered.' });
      return;
    }

    const newUser = {
      id: Date.now(),
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      profileImage: croppedImage,
      registeredAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    console.log('Registered user:', newUser); // <-- added logging

    alert('Registration Successful! Redirecting to login...');
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    setCroppedImage(null);
    navigate('/'); // <-- navigate to login
  };

  if (showImageCrop) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Crop Image</h3>
            <button onClick={() => setShowImageCrop(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
              ✕
            </button>
          </div>
          
          <div 
            className="relative inline-block"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={selectedImage}
              alt="Selected"
              className="max-w-full max-h-96"
              draggable={false}
            />
            <div
              className="absolute border-4 border-white shadow-lg cursor-move"
              style={{
                left: `${cropArea.x}px`,
                top: `${cropArea.y}px`,
                width: `${cropArea.size}px`,
                height: `${cropArea.size}px`,
                boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)'
              }}
              onMouseDown={handleMouseDown}
            >
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="border border-white border-opacity-30"></div>
                ))}
              </div>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden"></canvas>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowImageCrop(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleCropImage}
              className="flex-1 px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
            >
              Crop & Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-50 via-sky-100 to-teal-100 p-4">
      <div className="flex bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl h-[90vh]">
        <div className="w-1/2 flex flex-col justify-center p-12 bg-gradient-to-br from-cyan-100 to-sky-200">
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-blue-800 mb-6 hover:underline"
          >
            <ArrowLeftIcon /> Back to Login
          </button>

          <h2 className="text-3xl font-bold mb-2">Create your account</h2>
          
          <div className="flex items-center gap-6 my-6">
            <div className="relative">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-full bg-sky-300 flex items-center justify-center cursor-pointer hover:bg-sky-400 transition overflow-hidden"
              >
                {croppedImage ? (
                  <img src={croppedImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-white">
                    <CameraIcon />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-white font-medium">Upload Photo</p>
              <p className="text-sm text-sky-700">Click to upload</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <div className="relative">
                <div className="absolute right-3 top-3 text-gray-400">
                  <UserIcon />
                </div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 pr-10 rounded-lg border border-gray-300 bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <div className="relative">
                <div className="absolute right-3 top-3 text-gray-400">
                  <EnvelopeIcon />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 pr-10 rounded-lg border border-gray-300 bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="relative">
                  <div className="absolute right-3 top-3 text-gray-400">
                    <LockIcon />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 pr-10 rounded-lg border border-gray-300 bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute right-3 top-3 text-gray-400">
                    <LockIcon />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-3 pr-10 rounded-lg border border-gray-300 bg-white bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <p className="text-xs text-sky-700">
              Use 8 or more characters with a mix of letters, number & symbol
            </p>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-800 font-medium hover:underline"
              >
                Sign in instead
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-900 transition"
              >
                Register
              </button>
            </div>
          </form>
        </div>

        <div className="w-1/2 bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center p-8">
          <div className="text-center">
            <img
              src=" "
              alt="Registration"
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;