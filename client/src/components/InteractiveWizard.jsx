import React, { useState, useEffect } from 'react';
import { Compass, Send, AlertTriangle } from 'lucide-react';
import useAppStore from '../store/useAppStore.js';
import { useCreateSession } from '../hooks/useSessions.js';

function InteractiveWizard({ scenario }) {
  const setActiveResult = useAppStore((s) => s.setActiveResult);
  const createSession = useCreateSession();

  const [form, setForm] = useState({
    learnerName: 'Guest learner',
    reasoning: '',
    promptText: '',
    reflection: '',
  });

  const [error, setError] = useState(null);

  // Reset form when selected scenario changes
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      reasoning: '',
      promptText: '',
      reflection: '',
    }));
    setError(null);
  }, [scenario?.id]);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!scenario || !form.reasoning.trim()) return;
    setError(null);

    try {
      const result = await createSession.mutateAsync({
        ...form,
        scenarioId: scenario.id,
      });
      setActiveResult(result);
      setForm((prev) => ({ ...prev, reasoning: '', promptText: '', reflection: '' }));
    } catch (err) {
      const message =
        err?.response?.data?.details?.map((d) => d.message).join(', ') ||
        err?.response?.data?.error ||
        err?.message ||
        'Session creation failed. Please try again.';
      setError(message);
      console.error('Session creation failed:', err);
    }
  };

  if (!scenario) {
    return (
      <section className="panel learning-panel">
        <div className="empty">
          <p>Select a scenario from the sidebar to begin.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel learning-panel">
      <div className="section-title">
        <Compass size={20} />
        <h2>{scenario.title}</h2>
      </div>
      <p className="context">{scenario.context}</p>
      <div className="objective-row">
        {scenario.objectives?.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      {error && (
        <div className="error-banner">
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="learning-form">
        <label>
          Your reasoning
          <textarea
            required
            value={form.reasoning}
            onChange={handleChange('reasoning')}
            placeholder={scenario.prompt}
          />
        </label>
        <label>
          Prompt you would give an AI mentor
          <textarea
            value={form.promptText}
            onChange={handleChange('promptText')}
            placeholder="Explain my approach step by step, then show the Python concept and code..."
          />
        </label>
        <label>
          Reflection
          <textarea
            value={form.reflection}
            onChange={handleChange('reflection')}
            placeholder="What did you notice about your thinking?"
          />
        </label>
        <button
          className="primary"
          disabled={createSession.isPending}
        >
          <Send size={18} />
          {createSession.isPending
            ? 'Mapping...'
            : !useAppStore((s) => s.auth).token
            ? 'Submit as Guest'
            : 'Map My Reasoning'}
        </button>
      </form>
    </section>
  );
}

export default InteractiveWizard;
