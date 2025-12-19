import React, { useState, useEffect } from 'react';
import {
  Shield,
  Activity,
  AlertTriangle,
  ChevronRight,
  PenTool,
  Save,
  Trash2,
  Terminal,
  Book,
  Search
} from 'lucide-react';

// Hooks
import { useLocalStorage } from './hooks/useLocalStorage';
import { useBioMetrics } from './hooks/useBioMetrics';

// Utils
import { formatDuration, getClearanceLevel } from './utils/timeUtils';

// Data
import { vocabularyList } from './data/vocabulary';
import { educationalContent } from './data/articles';
import { quotes } from './data/quotes';

// Components
import ParanoidWindow from './components/ParanoidWindow';
import TruthButton from './components/TruthButton';
import TermReader from './components/TermReader';
import ArticleReader from './components/ArticleReader';
import PanicMode from './components/PanicMode';
import ProgressBar from './components/ProgressBar';
import WeeklyStatus from './components/WeeklyStatus';

// --- Main App Component ---
export default function RecoveryApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [intelView, setIntelView] = useState('files');
  const [showPanic, setShowPanic] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [readingArticle, setReadingArticle] = useState(null);
  const [viewingTerm, setViewingTerm] = useState(null);

  // Data Persistence
  const [lastRelapse, setLastRelapse] = useLocalStorage('lastRelapse', new Date().toISOString());
  // eslint-disable-next-line no-unused-vars
  const [history, setHistory] = useLocalStorage('relapseHistory', []);
  const [journal, setJournal] = useLocalStorage('fieldNotes', []);
  const [noteInput, setNoteInput] = useState('');

  // Timer State
  const [now, setNow] = useState(Date.now());

  // Random Quote State
  const [quote, setQuote] = useState("THEY LIVE WE SLEEP");

  const cycleLocalQuote = () => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 100);
    cycleLocalQuote(); // Set initial quote
    return () => clearInterval(timer);
  }, []);

  // Safe Calculation of Streak
  const lastRelapseDate = new Date(lastRelapse);
  const isValidDate = !isNaN(lastRelapseDate.getTime());

  // Auto-correct bad state if needed
  useEffect(() => {
    if (!isValidDate) {
      setLastRelapse(new Date().toISOString());
    }
  }, [isValidDate, setLastRelapse]);

  const streakMs = isValidDate ? now - lastRelapseDate.getTime() : 0;
  const clearance = getClearanceLevel(streakMs);

  // === CALCULATE BIO METRICS DYNAMICALLY ===
  const metrics = useBioMetrics(journal, streakMs);

  const handleRelapse = () => {
    const timestamp = new Date().toISOString();
    setHistory(prev => [...prev, timestamp]);
    setLastRelapse(timestamp);
    setShowResetConfirm(false);
    setActiveTab('dashboard');
  };

  const saveNote = () => {
    if (!noteInput.trim()) return;
    const newNote = {
      id: Date.now(),
      content: noteInput,
      date: new Date().toLocaleString(),
      isSystem: false
    };
    setJournal([newNote, ...journal]);
    setNoteInput('');
  };

  const deleteNote = (id) => {
    setJournal(journal.filter(note => note.id !== id));
  };

  const time = formatDuration(streakMs);

  return (
    <div className="min-h-screen bg-[#050505] text-[#00ff00] font-mono selection:bg-[#00ff00] selection:text-black overflow-x-hidden relative">
      {/* GLOBAL SCANLINE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,rgba(0,50,0,0.1)_0%,rgba(0,0,0,1)_100%)]"></div>

      {/* VIGNETTE */}
      <div className="fixed inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"></div>

      {readingArticle && (
        <ArticleReader
          article={readingArticle}
          onBack={() => setReadingArticle(null)}
          onTermClick={setViewingTerm}
        />
      )}

      {viewingTerm && (
        <TermReader
          termData={viewingTerm}
          onBack={() => setViewingTerm(null)}
        />
      )}

      {showPanic && <PanicMode onClose={() => setShowPanic(false)} />}

      <div className="max-w-4xl mx-auto p-4 pb-24 relative z-10">

        {/* HEADER */}
        <header className="mb-8 border-b-2 border-[#00ff00] pb-4 flex justify-between items-end relative">
          <div>
            <div className="text-xs text-[#00ff00] animate-pulse mb-1">SECURE CONNECTION ESTABLISHED...</div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter glitch-text flex items-center gap-4">
              <Shield className="w-12 h-12 animate-[spin_10s_linear_infinite]" />
              TRUTH_SEEKER
            </h1>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-xs text-green-700">SYSTEM STATUS</div>
            <div className="text-xl font-bold animate-pulse">OPERATIONAL</div>
          </div>
        </header>

        {/* QUOTE BANNER */}
        <div className="mb-8 overflow-hidden border-y border-green-900 bg-black py-2 relative">
          <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] text-green-700 font-bold uppercase tracking-[0.5em] text-xs">
            {quote} {'///'} {quote} {'///'} {quote} {'///'} {quote} {'///'} {quote}
          </div>
        </div>

        {/* MAIN NAVIGATION TAB */}
        <nav className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'dashboard', icon: Activity, label: 'STATUS' },
            { id: 'intel', icon: Book, label: 'INTEL_DB' },
            { id: 'journal', icon: PenTool, label: 'FIELD_LOGS' },
            { id: 'settings', icon: Terminal, label: 'CONFIG' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-3 border-2 font-bold uppercase tracking-widest transition-all
                ${activeTab === tab.id
                  ? 'bg-[#00ff00] text-black border-[#00ff00] shadow-[0_0_15px_rgba(0,255,0,0.5)]'
                  : 'bg-black text-[#00ff00] border-green-900 hover:border-[#00ff00] hover:text-[#00ff00]'}
              `}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}

          <button
            onClick={() => setShowPanic(true)}
            className="ml-auto bg-red-600 text-black font-black px-6 py-3 uppercase tracking-widest hover:bg-red-500 animate-pulse border-2 border-red-600 shadow-[0_0_10px_red]"
          >
            ! PANIC !
          </button>
        </nav>

        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* ROW 1: SPLIT COLUMN */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* COLUMN 1: TIMER COMPONENT */}
              <ParanoidWindow title="RETENTION_TIMER" warningLevel={streakMs < 1000 * 60 * 60 ? "high" : "low"} className="h-full">
                <div className="flex flex-col items-center justify-center h-full py-4">
                  <div className="grid grid-cols-4 gap-4 text-center w-full mb-8">
                    {Object.entries(time).map(([label, value]) => (
                      <div key={label} className="bg-[#001100] border border-green-900 p-2 relative group hover:border-[#00ff00] transition-colors">
                        <span className="text-4xl md:text-5xl font-black">{value}</span>
                        <span className="block text-xs uppercase text-green-700 mt-1">{label}</span>
                        <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    ))}
                  </div>

                  <ProgressBar
                    value={streakMs}
                    max={1000 * 60 * 60 * 24 * 90}
                    size="lg"
                    striped
                    animated
                    colorClass="bg-[#00ff00]"
                    className="mb-4"
                  />

                  <div className="flex justify-between w-full text-xs font-bold uppercase">
                    <span className="text-green-700">CURRENT CLEARANCE:</span>
                    <span className={`${clearance.color} drop-shadow-[0_0_5px_rgba(0,0,0,1)]`}>{clearance.title} (LVL {clearance.level})</span>
                  </div>
                </div>
              </ParanoidWindow>

              {/* COLUMN 2: THREAT LEVEL & REPORTING (Stacked) */}
              <div className="space-y-6 flex flex-col justify-between">
                <ParanoidWindow title="THREAT_LEVEL" className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <AlertTriangle size={32} className={`animate-bounce ${metrics.threat.color}`} />
                    <div>
                      <div className={`text-2xl font-bold ${metrics.threat.color}`}>{metrics.threat.label}</div>
                      <div className="text-xs text-green-700">{metrics.threat.note}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-green-900 pb-1">
                      <span>D2 RECEPTORS:</span>
                      <span className={`${metrics.dopamine.color} font-bold`}>{metrics.dopamine.label} ({metrics.dopamine.percent}%)</span>
                    </div>
                    <div className="flex justify-between border-b border-green-900 pb-1">
                      <span>PINEAL GLAND:</span>
                      <span className={`${metrics.pineal.color} font-bold`}>{metrics.pineal.label} ({metrics.pineal.percent}%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VIBRATION FREQ:</span>
                      <span className={`font-bold ${metrics.frequency.isUnstable ? 'text-red-500 glitch-text' : 'text-[#00ff00]'}`}>
                        {metrics.frequency.value.toFixed(2)} Hz {metrics.frequency.isUnstable && '(!)'}
                      </span>
                    </div>
                  </div>
                </ParanoidWindow>

                <TruthButton
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full py-4 border-red-600 text-red-600 hover:bg-red-900 hover:text-white"
                >
                  REPORT COMPROMISED (RELAPSE)
                </TruthButton>
              </div>
            </div>

            {/* ROW 2: WEEKLY ACTIVITY (FULL WIDTH) */}
            <ParanoidWindow title="WEEKLY_ACTIVITY">
              <WeeklyStatus history={history} />
            </ParanoidWindow>

            {/* ROW 3: RECENT INTEL FEED */}
            <ParanoidWindow title="DECRYPTED_COMMUNIQUES">
              <ul className="space-y-4">
                {vocabularyList.slice(0, 3).map((term, i) => (
                  <li key={i} className="flex gap-4 items-start border-b border-green-900 pb-4 last:border-0 last:pb-0 group cursor-pointer hover:bg-[#001100] transition-colors p-2"
                    onClick={() => setViewingTerm(term)}>
                    <span className="text-green-700 font-mono text-xs mt-1">[{i + 13}]</span>
                    <div>
                      <div className="font-bold text-[#00ff00] group-hover:underline decoration-dashed underline-offset-4">{term.term}</div>
                      <p className="text-sm text-green-400/80 line-clamp-2">{term.def}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </ParanoidWindow>

          </div>
        )}

        {/* INTEL DATABASE */}
        {activeTab === 'intel' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex gap-4 mb-6">
              <button onClick={() => setIntelView('files')} className={`flex-1 py-2 border-b-2 font-bold ${intelView === 'files' ? 'border-[#00ff00] text-[#00ff00]' : 'border-green-900 text-green-900'}`}>DOCUMENTS</button>
              <button onClick={() => setIntelView('terms')} className={`flex-1 py-2 border-b-2 font-bold ${intelView === 'terms' ? 'border-[#00ff00] text-[#00ff00]' : 'border-green-900 text-green-900'}`}>GLOSSARY</button>
            </div>

            {intelView === 'files' ? (
              <div className="grid gap-4 md:grid-cols-2">
                {educationalContent.map(article => (
                  <div
                    key={article.id}
                    onClick={() => setReadingArticle(article)}
                    className="bg-black border border-green-800 p-4 hover:border-[#00ff00] hover:bg-[#001100] cursor-pointer transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-2 right-2 text-[10px] text-green-800 border border-green-900 px-1 group-hover:text-[#00ff00] group-hover:border-[#00ff00]">TOP SECRET</div>
                    <h3 className="text-lg font-bold text-[#00ff00] mb-2 group-hover:text-white">{article.title}</h3>
                    <p className="text-xs text-green-600 font-mono mb-2">CATEGORY: {article.category}</p>
                    <p className="text-sm text-green-400 line-clamp-3 opacity-60 group-hover:opacity-100">{article.content}</p>
                    <div className="mt-4 flex justify-end">
                      <span className="text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">READ_FILE <ChevronRight size={12} /></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-black border border-green-800 p-4">
                <div className="grid gap-2">
                  {vocabularyList.map((item, i) => (
                    <div key={i} onClick={() => setViewingTerm(item)} className="flex items-center justify-between p-3 hover:bg-[#001100] cursor-pointer border-b border-green-900/30 group">
                      <span className="font-bold text-green-400 group-hover:text-[#00ff00]">{item.term}</span>
                      <Search size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* JOURNAL TAB */}
        {activeTab === 'journal' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
            <ParanoidWindow title="FIELD_NOTES_LOG">
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && saveNote()}
                  placeholder="ENTER OBSERVATION..."
                  className="flex-1 bg-[#001100] border-2 border-green-900 p-2 text-[#00ff00] placeholder-green-900 focus:outline-none focus:border-[#00ff00] font-mono"
                />
                <TruthButton onClick={saveNote}><Save size={18} /></TruthButton>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-900">
                {journal.length === 0 && (
                  <div className="text-center text-green-900 py-12 italic">NO LOGS FOUND. BEGIN RECORDING.</div>
                )}
                {journal.map(note => (
                  <div key={note.id} className="border-l-2 border-green-900 pl-4 py-2 hover:border-[#00ff00] transition-colors group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] text-green-700 bg-[#001100] px-1">{note.date}</span>
                      <button onClick={() => deleteNote(note.id)} className="text-green-900 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                    </div>
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))}
              </div>
            </ParanoidWindow>
          </div>
        )}

        {/* CONFIG TAB */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ParanoidWindow title="SYSTEM_CONFIGURATION">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold border-b border-green-900 mb-4 pb-2">DATA_MANAGEMENT</h3>
                  <div className="flex items-center justify-between p-4 border border-green-900 bg-[#001100]">
                    <div>
                      <div className="font-bold text-red-500">PURGE ALL DATA</div>
                      <div className="text-xs text-green-700">DELETE HISTORY, LOGS, AND CACHE</div>
                    </div>
                    <TruthButton onClick={() => {
                      if (window.confirm('WARNING: THIS ACTION CANNOT BE UNDONE. ARE YOU SURE?')) {
                        setHistory([]);
                        setJournal([]);
                        setLastRelapse(new Date().toISOString());
                      }
                    }} className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">INITIATE PURGE</TruthButton>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold border-b border-green-900 mb-4 pb-2">CONNECTIVITY</h3>
                  <div className="grid gap-4 text-xs font-mono text-green-600">
                    <div className="flex justify-between">
                      <span>PROXY SERVER:</span>
                      <span className="text-[#00ff00]">CONNECTED (NODE_77)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ENCRYPTION:</span>
                      <span className="text-[#00ff00]">AES-256 (MILITARY GRADE)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LOCATION:</span>
                      <span className="text-[#00ff00] animate-pulse">UNKNOWN</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-900/20 p-4 text-center text-xs text-green-500">
                  VERSION 0.9.2 (BETA) <br />
                  BUILT BY THE RESISTANCE
                </div>
              </div>
            </ParanoidWindow>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer className="fixed bottom-0 w-full bg-black border-t border-green-900 text-center py-1 text-[10px] text-green-800 z-50">
        SECURE_CHANNEL_ID: {activeTab.toUpperCase()}_8829 | ENCRYPTION_KEY: ROTATING...
      </footer>

      {/* RESET CONFIRMATION MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4">
          <div className="bg-black border-4 border-red-600 p-8 max-w-md w-full text-center relative shadow-[0_0_50px_red]">
            <AlertTriangle size={64} className="mx-auto text-red-600 mb-6 animate-bounce" />
            <h2 className="text-3xl font-black text-red-600 mb-4 glitch-text">CONFIRM STATUS</h2>
            <p className="text-white mb-8">
              Are you admitting to a compromise? <br />
              This will reset your streak to ZERO.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setShowResetConfirm(false)} className="py-4 border-2 border-[#00ff00] text-[#00ff00] font-bold hover:bg-[#00ff00] hover:text-black">
                FALSE ALARM
              </button>
              <button onClick={handleRelapse} className="py-4 bg-red-600 text-black font-bold hover:bg-white border-2 border-red-600">
                CONFIRM RELAPSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
