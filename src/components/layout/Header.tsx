import React from 'react';
import type { AppTab } from '../../types';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="brand-icon">🎓</span>
        <span className="brand-title">Homework Checker</span>
      </div>
      <nav className="header-nav">
        <button
          type="button"
          className={`nav-tab-button ${activeTab === 'studio' ? 'active' : ''}`}
          onClick={() => onTabChange('studio')}
        >
          (1) Обработка фото
        </button>
        <button
          type="button"
          className={`nav-tab-button ${activeTab === 'grading' ? 'active' : ''}`}
          onClick={() => onTabChange('grading')}
        >
          (2) Оценивание
        </button>
      </nav>
    </header>
  );
};