import React, { useState } from 'react';
import './RegisterPage.css';

const RegisterPage = ({ onNextStep, onGoToLogin }) => {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    passwordConfirm: '',
    email: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.id) newErrors.id = '아이디를 입력하세요.';
    if (!formData.password) newErrors.password = '비밀번호를 입력하세요.';
    if (formData.password !== formData.passwordConfirm) newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    if (!formData.email) newErrors.email = '이메일을 입력하세요.';

    // 아이디 중복 체크
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.id === formData.id)) {
      newErrors.id = '이미 사용 중인 아이디입니다.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // users 배열에 새 계정 추가 (프로필은 비워둠)
    onNextStep(formData);
  };

  return (
    <div className="register-bg">
      <div className="register-container">
        <div className="register-logo">IFITV</div>
        <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="id">아이디<span>*</span></label>
            <input
              id="id"
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              autoFocus
              required
            />
            {errors.id && <div className="form-error">{errors.id}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="email">이메일<span>*</span></label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호<span>*</span></label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="passwordConfirm">비밀번호 확인<span>*</span></label>
            <input
              id="passwordConfirm"
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
            />
            {errors.passwordConfirm && <div className="form-error">{errors.passwordConfirm}</div>}
          </div>
          <button className="register-btn" type="submit">
            다음
          </button>
        </form>
        <div className="register-bottom">
          <span>이미 계정이 있으신가요?</span>
          <button className="login-link" onClick={onGoToLogin}>로그인</button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
