import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

// --- Child Components (with dark mode styles) ---

const AchievementToast = ({ achievement }) => {
  if (!achievement) return null;
  return (
    <div className="font-body fixed bottom-5 right-5 bg-white dark:bg-gray-800 border-2 border-green-500 dark:border-green-400 shadow-lg rounded-lg p-4 max-w-sm z-50 animate-pulse">
      <p className="font-heading font-bold text-green-600 dark:text-green-400">🏆 Achievement Unlocked!</p>
      <p className="text-sm text-gray-800 dark:text-gray-200">{achievement.title}: {achievement.description}</p>
    </div>
  );
};

const AchievementsModal = ({ unlocked, onClose, achievementsList }) => (
  <div className="font-body fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40" onClick={onClose}>
    <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl w-full border dark:border-gray-700" onClick={e => e.stopPropagation()}>
      <h2 className="font-heading text-2xl font-bold mb-4 dark:text-gray-100">Unlocked Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(achievementsList).map(ach => (
          <div key={ach.id} className={`p-4 border rounded-lg ${unlocked.includes(ach.id) ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/50 dark:border-yellow-600' : 'border-gray-200 bg-gray-100 opacity-50 dark:bg-gray-700 dark:border-gray-600'}`}>
            <p className="text-3xl">{ach.icon}</p>
            <p className="font-heading font-bold mt-2 dark:text-gray-100">{ach.title}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{ach.description}</p>
          </div>
        ))}
      </div>
      <button onClick={onClose} className="font-heading mt-6 w-full bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700">Close</button>
    </div>
  </div>
);

const ToneSlider = ({ label, value, onChange }) => (
  <div className="w-full">
    <label htmlFor={label.toLowerCase()} className="font-heading block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="flex items-center gap-4">
      <input
        id={label.toLowerCase()}
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
      />
      <span className="font-mono text-sm text-gray-600 dark:text-gray-400">{value}</span>
    </div>
  </div>
);

// --- ShruggBot Component ---

const ShruggBot = () => {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('general');
  const [tones, setTones] = useState({ sarcasm: 5, nihilism: 5, absurdity: 5 });
  const [stats, setStats] = useState({ shruggs: 0, rage_scores: 0, corporate_uses: 0, political_uses: 0 });
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const shruggCardRef = useRef(null);

  const achievementsList = {
    FIRST_SHRUGG: { id: 'FIRST_SHRUGG', icon: '🐣', title: "It Begins", description: "Generate your first shrugg." },
    TEN_SHRUGGS: { id: 'TEN_SHRUGGS', icon: '🔟', title: "Apathetic Apprentice", description: "Generate 10 total shrugs." },
    FIFTY_SHRUGGS: { id: 'FIFTY_SHRUGGS', icon: '🏆', title: "Cynicism Virtuoso", description: "Generate 50 total shrugs." },
    FIRST_RAGE: { id: 'FIRST_RAGE', icon: '🔥', title: "Seeing Red", description: "Get your first 'Rage' score (9+)." },
    CORPORATE_DRONE: { id: 'CORPORATE_DRONE', icon: '👔', title: "Synergy Master", description: "Use the Corporate Translator 10 times." },
    POLITICAL_JUNKIE: { id: 'POLITICAL_JUNKIE', icon: '🏛️', title: "Pundit Pro", description: "Use the Third Party Pundit 10 times." },
  };

  useEffect(() => {
    const savedStats = JSON.parse(localStorage.getItem('shruggStats'));
    if (savedStats) setStats(savedStats);
    const savedAchievements = JSON.parse(localStorage.getItem('shruggAchievements'));
    if (savedAchievements) setUnlockedAchievements(savedAchievements);
  }, []);

  const checkAndUnlockAchievement = (id) => {
    if (!unlockedAchievements.includes(id)) {
      const achievement = achievementsList[id];
      setNewAchievement(achievement);
      setUnlockedAchievements(prev => {
        const newUnlocked = [...prev, id];
        localStorage.setItem('shruggAchievements', JSON.stringify(newUnlocked));
        return newUnlocked;
      });
      setTimeout(() => setNewAchievement(null), 4000);
    }
  };

  const updateStatsAndCheckAchievements = (res, currentMode) => {
    const newStats = {
      shruggs: (stats.shruggs || 0) + 1,
      rage_scores: res.score >= 9 ? (stats.rage_scores || 0) + 1 : (stats.rage_scores || 0),
      corporate_uses: currentMode === 'corporate' ? (stats.corporate_uses || 0) + 1 : (stats.corporate_uses || 0),
      political_uses: currentMode === 'political' ? (stats.political_uses || 0) + 1 : (stats.political_uses || 0),
    };
    setStats(newStats);
    localStorage.setItem('shruggStats', JSON.stringify(newStats));

    if (newStats.shruggs >= 1) checkAndUnlockAchievement('FIRST_SHRUGG');
    if (newStats.shruggs >= 10) checkAndUnlockAchievement('TEN_SHRUGGS');
    if (newStats.shruggs >= 50) checkAndUnlockAchievement('FIFTY_SHRUGGS');
    if (newStats.rage_scores >= 1) checkAndUnlockAchievement('FIRST_RAGE');
    if (newStats.corporate_uses >= 10) checkAndUnlockAchievement('CORPORATE_DRONE');
    if (newStats.political_uses >= 10) checkAndUnlockAchievement('POLITICAL_JUNKIE');
  };

  const handleToneChange = (e) => {
    const { id, value } = e.target;
    setTones(prevTones => ({
      ...prevTones,
      [id.toLowerCase()]: parseInt(value, 10)
    }));
  };

  const getRecommendedAction = (score) => {
    if (score <= 3) return 'Ignore. Not worth the pixels.';
    if (score <= 6) return 'Acknowledge with a single, weary sigh.';
    if (score <= 8) return 'Forward to group chat for communal despair.';
    return 'Print and frame as a monument to human folly.';
  };

  const getSnarkAnalysis = (score) => {
    if (score <= 3) return { technique: "Dismissive Understatement", analysis: "Minimizes the subject's importance to convey maximum apathy. A classic." };
    if (score <= 6) return { technique: "Feigned Ignorance", analysis: "Pretends to misunderstand the basic premise to highlight its inherent absurdity." };
    if (score <= 8) return { technique: "Absurdist Comparison", analysis: "Equates the topic with something completely unrelated and mundane to reveal its true, hollow core." };
    return { technique: "Hyperbolic Resignation", analysis: "Accepts the worst possible outcome with such enthusiasm that it becomes a critique of the situation itself." };
  };

  const getPlaceholderText = () => {
    switch (mode) {
      case 'corporate': return 'Paste your corporate jargon here...';
      case 'horoscope': return 'Enter a zodiac sign (e.g., Leo)...';
      case 'political': return 'Enter a political headline or statement...';
      default: return 'Enter text, a headline, or paste a URL to shrugg...';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch(process.env.REACT_APP_API_URL || '/api/shrugg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, mode: mode, tones: tones }),
      });
      const data = await res.json();
      data.snarkAnalysis = getSnarkAnalysis(data.score);
      data.originalText = inputText;
      setResponse(data);
      setInputText('');
      updateStatsAndCheckAchievements(data, mode);
    } catch (err) {
      setResponse({
        reaction: 'Error connecting to ShruggBot.',
        score: 0,
        snarkAnalysis: getSnarkAnalysis(0),
        originalText: inputText
      });
    } finally {
      setLoading(false);
    }
  };

  const formatShruggText = () => {
    if (!response) return '';
    return `🧠 ShruggBot Response to:\n"${response.originalText}"\n\n• Reaction: ${response.reaction || "ShruggBot is speechless. A rare occurrence."}\n• Shrugg-o-Meter: ${response.score}/10\n• Recommended Action: ${getRecommendedAction(response.score)}\n• Snark Analysis: ${response.snarkAnalysis.technique} - ${response.snarkAnalysis.analysis}\n— Sent from the ¯\\_(ツ)_/¯ Party`;
  };

  const handleDownloadImage = () => {
    if (shruggCardRef.current) {
      html2canvas(shruggCardRef.current, { scale: 2, useCORS: true, backgroundColor: null })
        .then(canvas => {
          const image = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = image;
          link.download = 'shrugg-card.png';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    }
  };

  return (
    <>
      <AchievementToast achievement={newAchievement} />
      {showAchievements && <AchievementsModal unlocked={unlockedAchievements} onClose={() => setShowAchievements(false)} achievementsList={achievementsList} />}
      
      <div className="font-body bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full space-y-6 text-center">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl text-center font-mono animate-shrug text-gray-800 dark:text-gray-200">
            ¯\_(ツ)_/¯
          </h1>
          <button onClick={() => setShowAchievements(true)} className="text-2xl" title="View Achievements">
            🏅
          </button>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          <div className="mb-4">
            <label htmlFor="mode-select" className="sr-only">Select Mode</label>
            <select
              id="mode-select"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="font-heading w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="general">General Snark</option>
              <option value="political">Third Party Pundit</option>
              <option value="corporate">Corporate Translator</option>
              <option value="horoscope">Sarcastic Horoscope</option>
            </select>
          </div>

          {mode === 'general' && (
            <div className="mb-4 p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50 space-y-3">
              <ToneSlider label="Sarcasm" value={tones.sarcasm} onChange={handleToneChange} />
              <ToneSlider label="Nihilism" value={tones.nihilism} onChange={handleToneChange} />
              <ToneSlider label="Absurdity" value={tones.absurdity} onChange={handleToneChange} />
            </div>
          )}

          <div className="mb-4">
            <textarea
              placeholder={getPlaceholderText()}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-4 py-2 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 h-24 resize-none"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="font-heading w-full bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Thinking...' : 'Get Shrugg'}
            </button>
          </div>
        </form>

        {response && (
          <>
            <div ref={shruggCardRef} className="bg-white dark:bg-gray-900 border-2 border-black dark:border-white shadow-xl rounded-lg p-6 space-y-4 text-left text-gray-800 dark:text-gray-200">
              <h1 className="text-3xl text-center font-mono text-gray-800 dark:text-gray-200 pb-4">
                ¯\_(ツ)_/¯
              </h1>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg space-y-1">
                <h4 className="font-heading text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Original Input:</h4>
                <p className="italic break-words text-gray-700 dark:text-gray-300">"{response.originalText}"</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-heading text-lg font-extrabold uppercase tracking-wide text-red-700 dark:text-red-500">Reaction:</h3>
                <p className="text-xl font-medium leading-snug">{response.reaction || "ShruggBot is speechless. A rare occurrence."}</p>
              </div>
              <div>
                <h4 className="font-heading text-md font-bold uppercase text-gray-700 dark:text-gray-300 mb-2">Shrugg-o-Meter:</h4>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-blue-600 h-4 transition-all duration-700 ease-in-out"
                    style={{ width: `${(response.score / 10) * 100}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm mt-1 font-mono dark:text-gray-400">{response.score}/10</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-heading text-md font-bold uppercase text-gray-700 dark:text-gray-300">Recommended Action:</h4>
                <p className="italic text-gray-800 dark:text-gray-200">{getRecommendedAction(response.score)}</p>
              </div>
              <div className="mt-6 p-4 border-t-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded text-left space-y-2 shadow-inner">
                <h4 className="font-heading text-sm uppercase tracking-wide text-gray-600 dark:text-gray-400 font-bold">Snark Analysis</h4>
                <p className="text-sm text-gray-900 dark:text-gray-200">
                  <span className="font-semibold">{response.snarkAnalysis.technique}:</span> {response.snarkAnalysis.analysis}
                </p>
              </div>
            </div>

            <div className="font-heading pt-4 space-y-2">
              <button
                onClick={handleDownloadImage}
                className="w-full bg-green-600 text-white rounded px-4 py-2 font-semibold hover:bg-green-700"
              >
                🖼️ Download Shrugg Card
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(formatShruggText());
                  alert("Shrugg copied to clipboard!");
                }}
                className="w-full bg-yellow-500 text-black rounded px-4 py-2 font-semibold hover:bg-yellow-600"
              >
                📋 Copy This Shrugg
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(formatShruggText());
                  alert("Shrugg copied to clipboard! Paste it in Bluesky manually.");
                }}
                className="w-full bg-blue-900 text-white rounded px-4 py-2 font-semibold hover:bg-blue-800"
              >
                🌌 Copy for Bluesky
              </button>
              <button
                onClick={() => {
                  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(formatShruggText())}`;
                  window.open(twitterUrl, '_blank');
                }}
                className="w-full bg-sky-500 text-white rounded px-4 py-2 font-semibold hover:bg-sky-600"
              >
                🐦 Share on Twitter
              </button>
              <button
                onClick={() => alert("Threads does not support sharing via link yet. Copy and paste instead!")}
                className="w-full bg-pink-600 text-white rounded px-4 py-2 font-semibold hover:bg-pink-700"
              >
                📸 Share on Threads
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ShruggBot;