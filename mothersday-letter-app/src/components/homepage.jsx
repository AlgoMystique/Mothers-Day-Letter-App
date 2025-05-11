// src/components/HomePage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PenTool, Heart } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import letterTemplates from '../assets/templates';

function HomePage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customName, setCustomName] = useState('');
  const [customLine, setCustomLine] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const generateLink = () => {
    if (!selectedTemplate) return;
    
    // Generate unique ID for this letter
    const uniqueId = uuidv4().slice(0, 8);
    
    // In a real app, you'd save this data to a database or local storage
    const letterData = {
      templateId: selectedTemplate.id,
      content: selectedTemplate.content,
      customName: customName.trim(),
      customLine: customLine.trim()
    };
    
    // For this demo, we'll just use URL parameters (in a real app, use a database)
    localStorage.setItem(`letter_${uniqueId}`, JSON.stringify(letterData));
    
    const link = `${window.location.origin}/letter/${uniqueId}`;
    setGeneratedLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const previewLetter = () => {
    if (!generatedLink) return;
    const id = generatedLink.split('/').pop();
    navigate(`/letter/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="home-title">Send a Love Letter This Mother's Day</h1>
        <p className="home-subtitle">Choose from heartfelt letters that come to life on screen.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="step-title">
          <span className="step-number">1</span>
          Select a Beautiful Letter
        </h2>

        <div className="template-grid">
          {letterTemplates.map((template) => (
            <div 
              key={template.id}
              className={`template-card ${
                selectedTemplate?.id === template.id ? 'template-card-selected' : ''
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="template-image-container">
                <img src={template.image} alt={template.title} className="template-image" />
                {selectedTemplate?.id === template.id && (
                  <div className="template-selected-overlay">
                    <div className="template-selected-icon">
                      <Heart fill="#e11d48" stroke="#e11d48" />
                    </div>
                  </div>
                )}
              </div>
              <div className="template-info">
                <h3 className="template-title">{template.title}</h3>
                <p className="template-preview">"{template.previewText}"</p>
              </div>
            </div>
          ))}
        </div>

        {selectedTemplate && (
          <>
            <h2 className="step-title">
              <span className="step-number">2</span>
              Add Your Personal Touch
            </h2>

            <div className="customization-box">
              <div className="input-group">
                <label htmlFor="customLine" className="input-label">Add a special line (optional)</label>
                <input
                  type="text"
                  id="customLine"
                  placeholder="e.g., You've always been my hero"
                  className="input-field"
                  value={customLine}
                  onChange={(e) => setCustomLine(e.target.value)}
                  maxLength={100}
                />
              </div>

              <div className="input-group">
                <label htmlFor="customName" className="input-label">Sign your name</label>
                <input
                  type="text"
                  id="customName"
                  placeholder="e.g., With love, Emily"
                  className="input-field"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  maxLength={50}
                />
              </div>
            </div>

            <h2 className="step-title">
              <span className="step-number">3</span>
              Generate Your Special Link
            </h2>

            <div className="generate-box">
              <button
                onClick={generateLink}
                className="generate-btn"
              >
                <PenTool className="btn-icon" size={18} />
                Create My Love Letter
              </button>

              {generatedLink && (
                <div className="link-container">
                  <p className="link-text">Share this special link with your loved one:</p>
                  <div className="link-input-container">
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      className="link-input"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="copy-btn"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <button
                    onClick={previewLetter}
                    className="preview-btn"
                  >
                    <Heart className="btn-icon-small" size={16} />
                    Preview My Letter
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;