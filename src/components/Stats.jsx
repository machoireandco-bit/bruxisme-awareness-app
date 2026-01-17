const formatDate = (value) => {
  const date = new Date(value);
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const groupByActivity = (entries) => {
  return entries.reduce((acc, entry) => {
    acc[entry.activity] = (acc[entry.activity] || 0) + 1;
    return acc;
  }, {});
};

export default function Stats({ entries, stats }) {
  const activityCounts = groupByActivity(entries);
  const painRatio = stats.total
    ? Math.round((stats.painCount / stats.total) * 100)
    : 0;
  const jawRestRatio = stats.total
    ? Math.round((stats.jawRestCount / stats.total) * 100)
    : 0;

  return (
    <section className="card">
      <h2>Statistiques locales</h2>
      <p className="muted">
        Données sauvegardées uniquement sur cet appareil.
      </p>

      <div className="stats-grid">
        <div>
          <p className="label">Observations totales</p>
          <p className="value">{stats.total}</p>
        </div>
        <div>
          <p className="label">Observations (7 jours)</p>
          <p className="value">{stats.lastWeekCount}</p>
        </div>
        <div>
          <p className="label">Tension / douleur</p>
          <p className="value">{painRatio}%</p>
        </div>
        <div>
          <p className="label">Mâchoire relâchée</p>
          <p className="value">{jawRestRatio}%</p>
        </div>
      </div>

      <div className="panel">
        <h3>Répartition par activité</h3>
        {Object.keys(activityCounts).length === 0 ? (
          <p className="muted">Aucune donnée encore.</p>
        ) : (
          <ul className="list">
            {Object.entries(activityCounts).map(([activity, count]) => (
              <li key={activity}>
                <span>{activity}</span>
                <strong>{count}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="panel">
        <h3>Dernières observations</h3>
        {entries.length === 0 ? (
          <p className="muted">Enregistrez votre première observation.</p>
        ) : (
          <ul className="timeline">
            {entries.slice(0, 5).map((entry) => (
              <li key={entry.timestamp}>
                <div>
                  <p className="timestamp">{formatDate(entry.timestamp)}</p>
                  <p>
                    Mâchoire : {entry.jawRest} · Douleur : {entry.painLevel} ·
                    Activité : {entry.activity}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
