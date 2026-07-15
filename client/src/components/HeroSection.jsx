import React from 'react';

function HeroSection({ analytics }) {
  return (
    <header className="hero">
      <div>
        <p>AI-native learning journey</p>
        <h1>Learn Python by reasoning through real situations first.</h1>
      </div>
      <div className="hero-stats">
        <span>
          {analytics?.scenarioCount || 0}
          <small>Scenarios</small>
        </span>
        <span>
          {analytics?.sessionCount || 0}
          <small>Sessions</small>
        </span>
        <span>
          {analytics?.averagePromptScore || 0}
          <small>Prompt score</small>
        </span>
      </div>
    </header>
  );
}

export default HeroSection;
