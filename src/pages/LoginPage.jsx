import { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Add animation classes
  const animationStyles = `
    @keyframes blob {
      0% {
        transform: translate(-50%, -50%) scale(1);
      }
      50% {
        transform: translate(-55%, -45%) scale(1.1);
      }
      100% {
        transform: translate(-50%, -50%) scale(1);
      }
    }
    .animate-blob {
      animation: blob 7s infinite alternate;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
    }
  `;

  return (
    <div className="min-h-screen flex">
      <style>{animationStyles}</style>
      {/* Left side - Login Form */}
      <div className="w-1/4 p-8" style={{ 
        background: 'linear-gradient(135deg, #096B68 0%, #129990 100%)' 
      }}>
        <div className="h-16"> {/* Empty div to match height of navbar on right side */}
        </div>

        <div className="flex justify-center mb-6 mt-8">
          <div className="h-16 w-16 rounded-full border-2 flex items-center justify-center shadow-lg" 
            style={{ 
              borderColor: '#90D1CA',
              background: 'linear-gradient(135deg, rgba(9, 107, 104, 0.7) 0%, rgba(144, 209, 202, 0.3) 100%)',
              boxShadow: '0 6px 20px rgba(144, 209, 202, 0.4)'
            }}>
            <User size={28} style={{ color: '#FFFBDE' }} />
          </div>
        </div>

        <div className="space-y-4 mb-5">
          <div className="relative">
            <input 
              type="text" 
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-gray-800 pl-8 pr-3 py-2 rounded-md w-full border focus:outline-none focus:border-teal-500 text-sm shadow-sm transition-all duration-200"
              style={{ 
                backgroundColor: '#FFFBDE', 
                borderColor: '#90D1CA',
                boxShadow: '0 2px 10px rgba(144, 209, 202, 0.1)'
              }}
            />
            <User size={14} className="absolute left-2.5 top-2.5" style={{ color: '#129990' }} />
          </div>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-gray-800 pl-8 pr-8 py-2 rounded-md w-full border focus:outline-none focus:border-teal-500 text-sm shadow-sm transition-all duration-200"
              style={{ 
                backgroundColor: '#FFFBDE', 
                borderColor: '#90D1CA',
                boxShadow: '0 2px 10px rgba(144, 209, 202, 0.1)'
              }}
            />
            <Lock size={14} className="absolute left-2.5 top-2.5" style={{ color: '#129990' }} />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-2.5 cursor-pointer focus:outline-none transition-colors duration-200 hover:text-teal-700"
              style={{ color: '#129990' }}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <button className="w-full text-white font-medium py-2 px-4 rounded-full transition duration-200 text-sm shadow-lg hover:shadow-xl" 
          style={{ 
            background: 'linear-gradient(to right, #129990, #096B68)',
            boxShadow: '0 4px 14px rgba(18, 153, 144, 0.4)'
          }}>
          LOGIN
        </button>

        <div className="flex justify-between text-xs mt-4">
          <div className="flex items-center" style={{ color: '#90D1CA' }}>
            <input type="checkbox" className="mr-1 h-3 w-3" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <div>
            <a href="#" style={{ color: '#90D1CA' }} className="hover:text-white">Forgot password?</a>
          </div>
        </div>
      </div>

      {/* Right side - Welcome Message */}
      <div className="w-3/4 relative overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, #FFFBDE 0%, #90D1CA 100%)' 
      }}>
        <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
          {/* Logo on the left */}
          <div className="flex items-center">
            <div style={{ color: '#129990' }} className="flex items-center">
              <div style={{ color: '#096B68' }} className="font-bold text-xl">IT</div>
              <div className="ml-1 font-bold">
                <div className="text-lg tracking-wider">Ventory</div>
              </div>
            </div>
          </div>
          
          {/* Navigation on the right */}
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-teal-800" style={{ color: '#129990' }}>CATEGORY</a>
            <a href="#" className="hover:text-teal-800" style={{ color: '#129990' }}>ITEM</a>
            <a href="#" className="hover:text-teal-800" style={{ color: '#129990' }}>LOAN</a>
            <a href="#" className="hover:text-teal-800" style={{ color: '#129990' }}>DETAILS</a>
            <a href="#" className="text-white px-4 py-1 rounded-full ml-2 shadow-md hover:shadow-lg transition-all duration-200" 
              style={{ 
                background: 'linear-gradient(to right, #129990, #096B68)',
                boxShadow: '0 2px 8px rgba(18, 153, 144, 0.4)'
              }}>SIGN UP</a>
          </div>
        </nav>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full opacity-50">
            <div className="w-96 h-96 rounded-full filter blur-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-40 animate-blob"
              style={{ background: 'radial-gradient(circle, #129990 0%, #90D1CA 50%, transparent 90%)' }}></div>
            <div className="w-64 h-64 rounded-full filter blur-2xl absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2 opacity-30 animate-blob animation-delay-2000"
              style={{ background: 'radial-gradient(circle, #096B68 0%, #129990 60%, transparent 90%)' }}></div>
            <div className="w-72 h-72 rounded-full filter blur-2xl absolute top-2/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 opacity-30 animate-blob animation-delay-4000"
              style={{ background: 'radial-gradient(circle, #FFFBDE 10%, #90D1CA 60%, transparent 90%)' }}></div>
          </div>
        </div>
        
        <div className="relative z-10 h-full flex items-center p-16">
          <div style={{ color: '#096B68' }}>
            <h1 className="text-6xl font-bold mb-6">Welcome.</h1>
            <p className="text-base mb-10 max-w-md" style={{ color: '#129990' }}>
              DESKRIPSI.
            </p>
            <div className="text-sm" style={{ color: '#129990' }}>
              Not a member? <a href="#" style={{ color: '#096B68' }} className="underline">Sign up now</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}