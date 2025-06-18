import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onLogin, onGoToRegister }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const signupData = JSON.parse(localStorage.getItem('signupData'));

    if (!signupData) {
      setError('회원가입 정보가 없습니다. 회원가입을 먼저 해주세요.');
      return;
    }
    if (id !== signupData.id || pw !== signupData.password) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      return;
    }
    setError('');
    onLogin?.(id, pw);
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
        <div className="login-bottom">
          <span>아직 회원이 아니신가요?</span>
          <button className="register-link" onClick={onGoToRegister}>회원가입</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
