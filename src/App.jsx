import { useEffect, useMemo, useState } from 'react';
import Questions from './components/Questions.jsx';
import Stats from './components/Stats.jsx';
import Settings from './components/Settings.jsx';
import {
  loadEntries,
  saveEntry,
  loadSettings,
  saveSettings,
  resetSchedule
} from './data/storage';
import { ensureTodaySchedule, popDueNotifications } from './data/notifications';

const TABS = {
  questions: 'Questions',
  stats: 'Statistiques',
  settings: 'Paramètres'
};

const NOTIFICATION_TEXT = {
  title: 'Auto-check bruxisme',
  body: 'Relâchez la mâchoire et répondez au mini-questionnaire.'
};

const requestNotificationPermission = async () => {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  return Notification.requestPermission();
};

export default function App() {
  const [activeTab, setActiveTab] = useState('questions');
  const [entries, setEntries] = useState(() => loadEntries());
  const [settings, setSettings] = useState(() => loadSettings());
  const [toast, setToast] = useState(null);
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    saveSettings(settings);
    resetSchedule();
    if (settings.notificationsEnabled) {
      ensureTodaySchedule(settings);
    }
  }, [settings]);

  useEffect(() => {
    if (!settings.notificationsEnabled) return undefined;

    ensureTodaySchedule(settings);
    const interval = window.setInterval(() => {
      const { due } = popDueNotifications(Date.now());
      if (due.length === 0) return;

      due.forEach(() => {
        if (permission === 'granted') {
          new Notification(NOTIFICATION_TEXT.title, {
            body: NOTIFICATION_TEXT.body,
            icon: '/icons/icon-192.svg'
          });
        } else {
          setToast('Notification programmée : répondez au questionnaire.');
        }
      });
    }, 30000);

    return () => window.clearInterval(interval);
  }, [permission, settings]);

  const stats = useMemo(() => {
    const total = entries.length;
    const painCount = entries.filter((entry) => entry.painLevel !== 'Aucune')
      .length;
    const jawRestCount = entries.filter((entry) => entry.jawRest === 'Oui')
      .length;
    const lastWeek = entries.filter((entry) => {
      const date = new Date(entry.timestamp);
      const diff = Date.now() - date.getTime();
      return diff <= 7 * 24 * 60 * 60 * 1000;
    });

    return {
      total,
      painCount,
      jawRestCount,
      lastWeekCount: lastWeek.length
    };
  }, [entries]);

  const handleSaveEntry = (entry) => {
    const nextEntry = { ...entry, timestamp: new Date().toISOString() };
    saveEntry(nextEntry);
    setEntries((prev) => [nextEntry, ...prev]);
    setToast('Observation enregistrée localement.');
  };

  const handlePermission = async () => {
    const nextPermission = await requestNotificationPermission();
    setPermission(nextPermission);
    if (nextPermission === 'granted') {
      setSettings((prev) => ({ ...prev, notificationsEnabled: true }));
      setToast('Notifications activées.');
    } else {
      setToast('Autorisation refusée ou non disponible.');
    }
  };

  const dismissToast = () => setToast(null);

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <p className="app__eyebrow">Bruxisme — PWA locale</p>
          <h1>Auto-prise de conscience</h1>
        </div>
        <span className={`status ${isOnline ? 'status--online' : 'status--offline'}`}>
          {isOnline ? 'En ligne' : 'Hors ligne'}
        </span>
      </header>

      <nav className="tabs">
        {Object.entries(TABS).map(([key, label]) => (
          <button
            key={key}
            className={`tabs__button ${activeTab === key ? 'is-active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="app__content">
        {activeTab === 'questions' && (
          <Questions onSave={handleSaveEntry} />
        )}
        {activeTab === 'stats' && (
          <Stats entries={entries} stats={stats} />
        )}
        {activeTab === 'settings' && (
          <Settings
            settings={settings}
            permission={permission}
            onPermissionRequest={handlePermission}
            onUpdate={setSettings}
          />
        )}
      </main>

      {toast && (
        <div className="toast" role="status">
          <span>{toast}</span>
          <button className="link" onClick={dismissToast}>
            Fermer
          </button>
        </div>
      )}
    </div>
  );
}
