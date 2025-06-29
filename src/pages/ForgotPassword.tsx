import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { LoadingSpinner } from '../components/LoadingSpinner'

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Create particles with enhanced properties
    particlesRef.current = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.7 + 0.3,
    }));

    const animate = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Enhanced mouse influence
      const mouseInfluence = 150;
      const mouseForce = 0.025;

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
        particle.vx *= 0.992;
        particle.vy *= 0.992;

        // Draw particle with enhanced glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Add subtle glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${particle.opacity * 0.2})`);
        
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

  // Enhanced mouse tracking
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const { error } = await resetPassword(email)

      if (error) {
        setErrors({ submit: error.message })
      } else {
        setSuccess(true)
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' })
    } finally {
      setLoading(false)
    }
  }

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-4xl font-normal text-white mb-6 font-serif">Check your email</h2>
            <p className="text-white/70 mb-10 text-base leading-relaxed">
              Check your email for a reset link. Click the link in the email to reset your password.
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
      {/* Enhanced vignette glow at top - Multiple layers for depth */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-96 bg-gradient-to-b from-white/8 via-white/3 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-3/4 h-64 bg-gradient-to-b from-white/4 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-1/2 h-32 bg-gradient-to-b from-white/2 to-transparent rounded-full blur-xl"></div>
      
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md soft-glow-card grainy-texture rounded-3xl p-12">
          {/* Main Heading - Exact match to image */}
          <h1 className="text-5xl font-normal text-white mb-6 text-center tracking-tight leading-tight font-serif">
            Forgot Password
          </h1>

          {/* Subtitle - Exact text from image */}
          <p className="text-white/70 text-center mb-12 text-base leading-relaxed">
            Enter your email address and we'll send<br />
            you a link to reset your password.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input - Enhanced with glow and texture */}
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }))
                  }
                }}
                className={`h-14 input-glow rounded-xl text-white placeholder-white/50 text-base px-4 ${
                  errors.email ? 'border-red-400/50' : ''
                }`}
              />
              {errors.email && (
                <p className="text-red-300 text-sm mt-2 text-center">{errors.email}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-3 soft-glow-card">
                <p className="text-red-300 text-sm text-center">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button - Enhanced with glow and texture */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 button-glow text-white rounded-xl text-base font-normal disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Sending Reset Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          {/* Back to Login - Exact match to image */}
          <div className="text-center mt-8">
            <Link
              to="/login"
              className="text-white/70 hover:text-white transition-all duration-300 text-base underline hover:no-underline"
            >
              Back To Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}