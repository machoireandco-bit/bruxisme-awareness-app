import { useMemo } from 'react';
import { ensureTodaySchedule, getSchedulePreview } from '../data/notifications';

const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function Settings({
  settings,
  permission,
  onPermissionRequest,
  onUpdate
}) {
  const handleToggle = () => {
    onUpdate({
      ...settings,
      notificationsEnabled: !settings.notificationsEnabled
    });
  };

  const updateNumber = (field) => (event) => {
    const value = Number(event.target.value);
    onUpdate({
      ...settings,
      [field]: clampValue(value, 0, 60)
    });
  };

  const preview = useMemo(() => {
    if (!settings.notificationsEnabled) return [];
    ensureTodaySchedule(settings);
    return getSchedulePreview();
  }, [settings]);

  return (
    <section className="card">
      <h2>Paramètres</h2>
      <p className="muted">Réglez le rythme des rappels journaliers.</p>

      <div className="panel stack">
        <div className="row between">
          <div>
            <p className="label">Notifications</p>
            <p className="muted">Entre 10 et 50 rappels aléatoires par jour.</p>
          </div>
          <button className="toggle" onClick={handleToggle}>
            {settings.notificationsEnabled ? 'Activées' : 'Désactivées'}
          </button>
        </div>

        <div className="grid-2">
          <label className="field">
            <span>Nombre / jour</span>
            <input
              type="number"
              min="10"
              max="50"
              value={settings.notificationsPerDay}
              onChange={(event) => {
                const nextValue = clampValue(
                  Number(event.target.value),
                  10,
                  50
                );
                onUpdate({ ...settings, notificationsPerDay: nextValue });
              }}
            />
          </label>
          <label className="field">
            <span>Début (heure)</span>
            <input
              type="number"
              min="6"
              max="12"
              value={settings.startHour}
              onChange={updateNumber('startHour')}
            />
          </label>
          <label className="field">
            <span>Fin (heure)</span>
            <input
              type="number"
              min="18"
              max="24"
              value={settings.endHour}
              onChange={updateNumber('endHour')}
            />
          </label>
        </div>

        <div className="row between">
          <div>
            <p className="label">Autorisation navigateur</p>
            <p className="muted">
              Statut actuel : {permission === 'default'
                ? 'Non demandée'
                : permission}
            </p>
          </div>
          <button className="secondary" onClick={onPermissionRequest}>
            Demander l’autorisation
          </button>
        </div>
      </div>

      {preview.length > 0 && (
        <div className="panel">
          <h3>Prochaines notifications (aperçu)</h3>
          <div className="pill-row">
            {preview.map((timestamp) => (
              <span key={timestamp} className="pill">
                {formatTime(timestamp)}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
