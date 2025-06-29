import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { LoadingSpinner } from '../components/LoadingSpinner'

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export const SignUp = (): JSX.Element => {
  const { user, signUp } = useAuth()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeTerms: false,
    rememberPassword: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Create more particles with enhanced properties
    particlesRef.current = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2.0 + 0.6,
      opacity: Math.random() * 0.8 + 0.4,
    }));

    const animate = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Enhanced mouse influence
      const mouseInfluence = 180;
      const mouseForce = 0.03;

      particlesRef.current.forEach((particle) => {
        // Enhanced mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseInfluence) {
          const force = (mouseInfluence - distance) / mouseInfluence;
          const acceleration = force * mouseForce;
          particle.vx += (dx / distance) * acceleration;
          particle.vy += (dy / distance) * acceleration;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary check with wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Enhanced friction for smoother movement
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Draw particle with enhanced glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Add subtle glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2.5
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${particle.opacity * 0.15})`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Enhanced mouse tracking with smoother updates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the Terms & Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );

      if (error) {
        setErrors({ submit: error.message });
      } else {
        setSuccess(true);
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Enhanced vignette glow at top */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-96 bg-gradient-to-b from-white/8 via-white/3 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-3/4 h-64 bg-gradient-to-b from-white/4 to-transparent rounded-full blur-2xl"></div>
        
        {/* Particle Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ width: "100%", height: "100%" }}
        />

        {/* Success Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md soft-glow-card grainy-texture rounded-3xl p-12 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 soft-glow-card">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-4xl font-normal text-white mb-6 font-serif">Check your email</h2>
            <p className="text-white/70 mb-10 text-base leading-relaxed">
              Check your email to verify your account. Click the link in the email to complete your registration.
            </p>
            <Link to="/login">
              <Button className="w-full h-12 button-glow text-white rounded-xl text-base font-normal">
                Back To Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          <CardContent className="p-0 grid grid-cols-1 lg:grid-cols-2 min-h-[700px]">
            {/* Left Side - Form */}
            <div className="p-8 lg:p-12 flex flex-col justify-center bg-white">
              {/* Main Heading */}
              <h1 className="text-4xl lg:text-5xl font-normal text-black mb-8 text-center tracking-tight leading-tight font-serif">
                Feel The World Emotions
              </h1>

              {/* Create Account Section */}
              <div className="text-center mb-8">
                <h2 className="text-xl lg:text-2xl font-normal text-black mb-2">
                  Create an account
                </h2>
                <p className="text-base lg:text-lg text-black">
                  Already have an account?{" "}
                  <Link 
                    to="/login"
                    className="underline cursor-pointer hover:text-gray-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Log In
                  </Link>
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto w-full">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={`h-11 bg-gray-200 border-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-black/20 text-sm transform hover:scale-[1.02] focus:scale-[1.02] ${
                        errors.firstName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <Input
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={`h-11 bg-gray-200 border-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-black/20 text-sm transform hover:scale-[1.02] focus:scale-[1.02] ${
                        errors.lastName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`h-11 bg-gray-200 border-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-black/20 text-sm transform hover:scale-[1.02] focus:scale-[1.02] ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`h-11 bg-gray-200 border-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-black/20 text-sm transform hover:scale-[1.02] focus:scale-[1.02] ${
                      errors.password ? "border-red-500" : ""
                    }`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Checkboxes - Same Row Layout */}
                <div className="flex justify-between items-start pt-2">
                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeTerms", checked as boolean)
                      }
                      className={`w-4 h-4 rounded border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black mt-0.5 transition-all duration-200 hover:scale-110 ${
                        errors.agreeTerms ? "border-red-500" : ""
                      }`}
                    />
                    <label
                      htmlFor="terms"
                      className={`text-sm cursor-pointer leading-relaxed transition-colors duration-200 hover:text-black ${
                        errors.agreeTerms ? "text-red-700" : "text-gray-600"
                      }`}
                    >
                      I agree to the{" "}
                      <span className="underline hover:text-black transition-colors">
                        Terms & Conditions
                      </span>
                    </label>
                  </div>
                  
                  {/* Remember Password */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberPassword}
                      onCheckedChange={(checked) =>
                        handleInputChange("rememberPassword", checked as boolean)
                      }
                      className="w-4 h-4 rounded border-gray-400 data-[state=checked]:bg-black data-[state=checked]:border-black transition-all duration-200 hover:scale-110"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-gray-600 cursor-pointer transition-colors duration-200 hover:text-black"
                    >
                      Remember Password
                    </label>
                  </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-pulse">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !formData.agreeTerms}
                  className="w-full h-11 bg-black text-white rounded-lg transition-all duration-300 transform hover:scale-[1.05] active:scale-[0.98] mt-6 text-sm hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:transform-none hover:shadow-lg"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              {/* Social Login */}
              <div className="text-center mt-6">
                <p className="text-base lg:text-lg text-black mb-4">Or Sign up with</p>
                <div className="flex justify-center space-x-4">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-all duration-300 transform hover:scale-110">
                    <span className="text-white text-sm font-bold">G</span>
                  </div>
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-all duration-300 transform hover:scale-110">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-all duration-300 transform hover:scale-110">
                    <span className="text-white text-sm font-bold">D</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Cosmic Image */}
            <div className="bg-black flex items-center justify-center p-6">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src="/ChatGPT Image Jun 27,rt 2025, 09_14_17 PM.png"
                  alt="Cosmic visualization with figure and celestial elements"
                  className="w-full h-full object-cover rounded-2xl"
                  style={{ 
                    minHeight: '600px',
                    maxHeight: '650px'
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};