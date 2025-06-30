import React from 'react';
import { Skeleton } from 'antd';
import '../../styles/LoginPageSkeleton.scss';

const LoginPageSkeleton = () => {
  return (
    <div className="login-skeleton">
      {/* Left Side - Dark Blue Section */}
      <div className="left-section">
        {/* Background Pattern/Decoration */}
        <div className="background-pattern">
          <div className="circle-decoration circle-top-left"></div>
          <div className="circle-decoration circle-bottom-right"></div>
        </div>
        
        <div className="content-wrapper">
          {/* Hello Afftrex with wave emoji */}
          <div className="header-section">
            <div className="title-row">
              <Skeleton.Input 
                active 
                style={{ 
                  width: 100, 
                  height: 48,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 8,
                  marginRight: 12
                }} 
              />
              <div className="emoji-container">
                <Skeleton.Avatar 
                  active 
                  size={32}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                />
              </div>
            </div>
            <Skeleton.Input 
              active 
              style={{ 
                width: 180, 
                height: 48,
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderRadius: 8
              }} 
            />
          </div>
          
          {/* Description Text */}
          <div className="description-section">
            <Skeleton.Input 
              active 
              style={{ 
                width: 320, 
                height: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 4
              }} 
            />
            <Skeleton.Input 
              active 
              style={{ 
                width: 280, 
                height: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 4
              }} 
            />
            <Skeleton.Input 
              active 
              style={{ 
                width: 200, 
                height: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 4
              }} 
            />
          </div>
        </div>
      </div>

      {/* Right Side - Login Form Section */}
      <div className="right-section">
        {/* Green leaf decoration at bottom right */}
        <div className="leaf-decoration">
          <div className="leaf-main"></div>
          <div className="leaf-secondary"></div>
          <div className="leaf-tertiary"></div>
        </div>

        <div className="form-container">
          <div className="form-wrapper">
            {/* Welcome Back Title */}
            <div className="welcome-title">
              <Skeleton.Input 
                active 
                style={{ 
                  width: 220, 
                  height: 36,
                  borderRadius: 6
                }} 
              />
            </div>

            {/* Login Form */}
            <div className="form-fields">
              {/* Email Field */}
              <div className="field-group">
                <Skeleton.Input 
                  active 
                  style={{ 
                    width: 100, 
                    height: 16,
                    marginBottom: 8
                  }} 
                />
                <div className="input-wrapper">
                  <Skeleton.Input 
                    active 
                    style={{ 
                      width: '100%', 
                      height: 52,
                      borderRadius: 8
                    }} 
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="field-group">
                <Skeleton.Input 
                  active 
                  style={{ 
                    width: 80, 
                    height: 16,
                    marginBottom: 8
                  }} 
                />
                <div className="input-wrapper">
                  <Skeleton.Input 
                    active 
                    style={{ 
                      width: '100%', 
                      height: 52,
                      borderRadius: 8
                    }} 
                  />
                </div>
              </div>

              {/* Login Button */}
              <Skeleton.Button 
                active 
                style={{ 
                  width: '100%', 
                  height: 52,
                  borderRadius: 8,
                  backgroundColor: '#1f2937'
                }} 
              />

              {/* Forgot Password Link */}
              <div className="forgot-password">
                <Skeleton.Input 
                  active 
                  style={{ 
                    width: 140, 
                    height: 16
                  }} 
                />
              </div>

              {/* Don't have account text */}
              <div className="signup-text">
                <Skeleton.Input 
                  active 
                  style={{ 
                    width: 250, 
                    height: 16,
                    marginBottom: 16
                  }} 
                />
              </div>

              {/* Signup Buttons */}
              <div className="signup-buttons">
                <Skeleton.Button 
                  active 
                  style={{ 
                    flex: 1, 
                    height: 48,
                    borderRadius: 8,
                    border: '1px solid #d1d5db'
                  }} 
                />
                <Skeleton.Button 
                  active 
                  style={{ 
                    flex: 1, 
                    height: 48,
                    borderRadius: 8,
                    border: '1px solid #d1d5db'
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPageSkeleton;