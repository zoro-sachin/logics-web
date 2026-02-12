import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaReact, FaHtml5, FaCss3Alt, FaJs, FaGithub, FaNodeJs, FaPython } from 'react-icons/fa';
import { SiTypescript, SiMongodb } from 'react-icons/si';

// Icons to fall
const icons = [
  <FaReact />, <FaHtml5 />, <FaCss3Alt />, <FaJs />,
  <FaGithub />, <FaNodeJs />, <FaPython />, <SiTypescript />, <SiMongodb />
];

const fallAnimation = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #050505; /* Deep black/navy */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  overflow: hidden;
`;

const ContentBox = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .glow-box {
    width: 120px;
    height: 120px;
    background: rgba(255, 255, 255, 0.05);
    border: 2px solid white;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    margin-bottom: 20px;
  }

  h1 {
    color: white;
    font-family: 'Inter', sans-serif;
    letter-spacing: 4px;
    font-size: 1.5rem;
    text-transform: uppercase;
  }
`;

const FallingIcon = styled.div`
  position: absolute;
  top: -50px;
  color: ${props => props.color || 'rgba(255, 255, 255, 0.3)'};
  font-size: ${props => props.size || '2rem'};
  animation: ${fallAnimation} ${props => props.duration || '3s'} linear infinite;
  animation-delay: ${props => props.delay || '0s'};
  left: ${props => props.left || '50%'};
`;

const LoadingScreen = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 4000); // Show for 4 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <Container>
      <ContentBox>
        <div className="glow-box">
          <FaReact size={50} color="white" />
        </div>
        <h1>My Profile</h1>
      </ContentBox>

      {/* Generate random falling icons */}
      {Array.from({ length: 20 }).map((_, i) => (
        <FallingIcon
          key={i}
          left={`${Math.random() * 100}vw`}
          duration={`${Math.random() * 3 + 2}s`}
          delay={`${Math.random() * 2}s`}
          size={`${Math.random() * 2 + 1}rem`}
          color={`rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`}
        >
          {icons[Math.floor(Math.random() * icons.length)]}
        </FallingIcon>
      ))}
    </Container>
  );
};

export default LoadingScreen;
