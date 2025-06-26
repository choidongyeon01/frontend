import React, { useState } from 'react';
import './LoginPage.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// Google Cloud Console에서 발급받은 클라이언트 ID로 교체하세요
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';

const LoginPage = ({ onLogin, onGoToRegister }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === id && u.password === pw);

    if (!user) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      return;
    }
    setError('');
    onLogin(user.id, user.password);
  };

  const handleGoogleSuccess = (credentialResponse) => {
    // 구글 로그인 성공 시 JWT 토큰(credentialResponse.credential) 처리
    console.log('Google 로그인 성공:', credentialResponse);
    // 필요시 onLogin 호출하거나 별도 소셜 로그인 처리 로직 추가
  };

  const handleGoogleFailure = () => {
    setError('Google 로그인에 실패했습니다.');
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-logo">IFITV</div>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="text"
            placeholder="아이디"
            value={id}
            onChange={e => setId(e.target.value)}
            autoFocus
          />
          <input
            className="login-input"
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={e => setPw(e.target.value)}
          />
          {error && <div className="login-error">{error}</div>}
          <button className="login-btn" type="submit">로그인</button>
        </form>
        <div className="login-divider">
          <span>or</span>
        </div>
        <div className="login-google-wrap">
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              useOneTap={false}
              text="signin_with"
              shape="rectangular"
              theme="outline"
              logo_alignment="left"
              width="100%"
            />
          </GoogleOAuthProvider>
        </div>
        <div className="login-bottom">
          <span>아직 회원이 아니신가요?</span>
          <button className="register-link" onClick={onGoToRegister}>회원가입</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
