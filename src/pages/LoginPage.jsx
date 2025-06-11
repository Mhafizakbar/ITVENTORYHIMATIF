import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertModal from '../components/AlertModal';
import { useAlert } from '../hooks/useModal';


const LoginPage = () => {
  const [isActive, setIsActive] = useState(false);

  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form states
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, user, isAdmin } = useAuth();
  const alert = useAlert();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (isAdmin()) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    }
  }, [user, navigate, isAdmin]);

  useEffect(() => {
    // Add Google Fonts link to head
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Add Boxicons for icons
    const boxiconsLink = document.createElement('link');
    boxiconsLink.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
    boxiconsLink.rel = 'stylesheet';
    document.head.appendChild(boxiconsLink);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(boxiconsLink);
    };
  }, []);

  const handleRegisterClick = () => {
    setErrorMessage('');
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setErrorMessage('');
    setIsActive(false);
  };

  // Handle Login Submit
  const handleLoginSubmit = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('https://pweb-be-production.up.railway.app/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Login failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Login success:', data);

      // Save user data to context
      const userData = {
        email: loginEmail,
        role: data.data
      };
      login(userData, data.data);

      // Check user role and redirect accordingly
      if (data.data === 'ADMIN') {
        alert.showSuccess('Welcome Admin!', 'Login admin berhasil! Mengarahkan ke dashboard admin...');
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        alert.showSuccess('Welcome!', 'Login berhasil!');
        setTimeout(() => navigate('/home'), 1500);
      }
    } catch (err) {
      console.error('Login error:', err);

      let errorMessage = 'Email atau password salah.';
      if (err.name === 'AbortError') {
        errorMessage = 'Request timeout. Please check your connection and try again.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (err.message.includes('401')) {
        errorMessage = 'Email atau password salah.';
      }

      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = () => {
    setLoading(true);
    setErrorMessage('');

    fetch('https://pweb-be-production.up.railway.app/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
      nama_lengkap: registerName,  
      email: registerEmail,
      no_telepon: registerPhone,  
      password: registerPassword,
})
    })
      .then(res => {
        if (!res.ok) throw new Error('Register failed');
        return res.json();
      })
      .then(data => {
        setLoading(false);
        console.log('Register success:', data);
        alert.showSuccess('Registration Success!', 'Registrasi berhasil! Silakan login.');
        setTimeout(() => setIsActive(false), 1500); // switch to login after successful registration
        // reset register form
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPhone('');
        setRegisterPassword('');
      })
      .catch(err => {
        setLoading(false);
        setErrorMessage('Registrasi gagal. Pastikan data yang dimasukkan valid.');
      });
  };

  const containerStyle = {
    fontFamily: '"Poppins", sans-serif',
    position: 'relative',
    width: '850px',
    height: '550px',
    background: 'linear-gradient(135deg, #90D1CA, #f7f7e5, #86cab9, #005e5e)',
    margin: '20px',
    borderRadius: '30px',
    boxShadow: '0 0 30px rgba(0, 0, 0, .2)',
    overflow: 'hidden'
  };

  const formBoxBaseStyle = {
    position: 'absolute',
    right: isActive ? '50%' : '0',
    width: '50%',
    height: '100%',
    background: 'linear-gradient(135deg, #f1f8e6, #129990)',
    display: 'flex',
    alignItems: 'center',
    color: '#333',
    textAlign: 'center',
    padding: '40px',
    zIndex: 1,
    transition: '.6s ease-in-out 1.2s, visibility 0s 1s'
  };

  const formBoxRegisterStyle = {
    ...formBoxBaseStyle,
    visibility: isActive ? 'visible' : 'hidden'
  };

  const inputStyle = {
    width: '100%',
    padding: '13px 50px 13px 20px',
    background: '#FFFBDE',
    borderRadius: '8px',
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    color: '#333',
    fontWeight: '500'
  };

  const btnStyle = {
    width: '100%',
    height: '48px',
    background: 'linear-gradient(135deg, #90D1CA, #096B68)',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, .1)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#fff',
    fontWeight: '600'
  };

  const toggleBoxBeforeStyle = {
    content: '""',
    position: 'absolute',
    left: isActive ? '50%' : '-250%',
    width: '300%',
    height: '100%',
    background: '#096B68',
    zIndex: 2,
    transition: '1.8s ease-in-out'
  };

  const togglePanelLeftStyle = {
    position: 'absolute',
    left: isActive ? '-50%' : '0',
    width: '50%',
    height: '100%',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    transition: '.6s ease-in-out',
    transitionDelay: isActive ? '.6s' : '1.2s'
  };

  const togglePanelRightStyle = {
    position: 'absolute',
    right: isActive ? '0' : '-50%',
    width: '50%',
    height: '100%',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    transition: '.6s ease-in-out',
    transitionDelay: isActive ? '1.2s' : '.6s'
  };

  const toggleBtnStyle = {
    width: '160px',
    height: '46px',
    background: 'transparent',
    border: '2px solid #fff',
    boxShadow: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#fff',
    fontWeight: '600'
  };

  return (
    <>
      <style>
        {`
          @media screen and (max-width: 650px) {
            .login-container {
              height: calc(100vh - 40px) !important;
            }
            .form-box-mobile {
              bottom: 0 !important;
              width: 100% !important;
              height: 70% !important;
              right: 0 !important;
            }
            .form-box-mobile.active {
              right: 0 !important;
              bottom: 30% !important;
            }
            .toggle-box-before-mobile {
              left: 0 !important;
              top: ${isActive ? '70%' : '-270%'} !important;
              width: 100% !important;
              height: 300% !important;
              border-radius: 20vw !important;
            }
            .toggle-panel-mobile {
              width: 100% !important;
              height: 30% !important;
            }
            .toggle-left-mobile {
              top: ${isActive ? '-30%' : '0'} !important;
              left: 0 !important;
            }
            .toggle-right-mobile {
              right: 0 !important;
              bottom: ${isActive ? '0' : '-30%'} !important;
            }
          }
          @media screen and (max-width: 400px) {
            .form-box-mobile {
              padding: 20px !important;
            }
            .toggle-panel-mobile h1 {
              font-size: 30px !important;
            }
          }
        `}
      </style>
      
      <div 
        className="min-h-screen flex justify-center items-center"
        style={{
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          fontFamily: '"Poppins", sans-serif',
          textDecoration: 'none',
          listStyle: 'none',
          background: "url('fixbg.jpg') no-repeat center center/cover"
        }}
      >
        <div 
          className="login-container form-box-mobile"
          style={containerStyle}
        >
          {/* Login Form */}
          <div 
            className="form-box-mobile"
            style={formBoxBaseStyle}
          >
            <div className="w-full">
              <h1 style={{ fontSize: '36px', margin: '-10px 0' }}>Sign In</h1>
              {errorMessage && !isActive && (
                <p style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>
              )}
              <div style={{ position: 'relative', margin: '30px 0' }}>
                <input 
                  type="email" 
                  placeholder="Email" 
                  required 
                  style={inputStyle}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <i 
                  className="bx bxs-envelope"
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '20px'
                  }}
                ></i>
              </div>
              <div style={{ position: 'relative', margin: '30px 0' }}>
                <input 
                  type="password" 
                  placeholder="Password" 
                  required 
                  style={inputStyle}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <i 
                  className="bx bxs-lock-alt"
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '20px'
                  }}
                ></i>
              </div>
              <div style={{ margin: '-15px 0 15px' }}>
                <a 
                  href="#" 
                  style={{ fontSize: '14.5px', color: '#333' }}
                >
                  Forgot Password?
                </a>
              </div>
              <button 
                type="button" 
                style={btnStyle}
                onClick={handleLoginSubmit}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Sign In'}
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <div 
            className="form-box-mobile"
            style={formBoxRegisterStyle}
          >
            <div className="w-full">
              <h1 style={{ fontSize: '36px', margin: '-10px 0' }}>Sign Up</h1>
              {errorMessage && isActive && (
                <p style={{ color: 'red', marginBottom: '10px' }}>{errorMessage}</p>
              )}
              <div style={{ position: 'relative', margin: '30px 0' }}>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required 
                  style={inputStyle}
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                />
                <i 
                  className="bx bxs-user"
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '20px'
                  }}
                ></i>
              </div>
              <div style={{ position: 'relative', margin: '30px 0' }}>
                <input 
                  type="email" 
                  placeholder="Email" 
                  required 
                  style={inputStyle}
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
                <i 
                  className="bx bxs-envelope"
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '20px'
                  }}
                ></i>
              </div>
              <div style={{ position: 'relative', margin: '30px 0' }}>
                <input 
                  type="text" 
                  placeholder="Phone Number" 
                  required 
                  style={inputStyle}
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                />
                <i 
                  className="bx bxs-phone"
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '20px'
                  }}
                ></i>
              </div>
              <div style={{ position: 'relative', margin: '30px 0' }}>
                <input 
                  type="password" 
                  placeholder="Password" 
                  required 
                  style={inputStyle}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
                <i 
                  className="bx bxs-lock-alt"
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '20px'
                  }}
                ></i>
              </div>
              <button 
                type="button" 
                style={btnStyle}
                onClick={handleRegisterSubmit}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Sign Up'}
              </button>
            </div>
          </div>

          {/* Toggle Box */}
          <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
            <div 
              className="toggle-box-before-mobile"
              style={toggleBoxBeforeStyle}
            ></div>
          </div>

          {/* Toggle Panels */}
          <div 
            className="toggle-panel-mobile toggle-left-mobile"
            style={togglePanelLeftStyle}
          >
            <h1 className="text-4xl">Welcome to</h1>
            <h1 className="text-4xl">
              <span style={{ color: '#90D1CA' }}>IT</span>
              <span style={{ color: '#FFFBDE' }}>Ventory</span>
            </h1>
            <p style={{ fontSize: '14.5px', margin: '15px 0', marginBottom: '20px' }}>
              Don't have an account?
            </p>
            <button 
              style={toggleBtnStyle}
              onClick={handleRegisterClick}
              disabled={loading}
            >
              Sign Up
            </button>
          </div>

          <div 
            className="toggle-panel-mobile toggle-right-mobile"
            style={togglePanelRightStyle}
          >
            <h1 className='text-4xl'>Welcome Back!</h1>
            <p style={{ fontSize: '14.5px', margin: '15px 0', marginBottom: '20px' }}>
              Already have an account?
            </p>
            <button 
              style={toggleBtnStyle}
              onClick={handleLoginClick}
              disabled={loading}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alert.alert.isOpen}
        onClose={alert.hideAlert}
        title={alert.alert.title}
        message={alert.alert.message}
        type={alert.alert.type}
      />
    </>
  );
};

export default LoginPage;