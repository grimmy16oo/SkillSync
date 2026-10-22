function SettingsPage({ preferences, setPreferences }) {
  return (
    <main className="settings-page">
      <p className="learner-eyebrow">YOUR ACCOUNT</p>
      <h1>Settings</h1>
      <section className="settings-panel">
        <h2>Notifications</h2>
        <p>Choose which classroom updates you want to receive.</p>
        {[
          ["Requests", "Join requests"],
          ["Meetings", "Meetings"],
          ["Courses", "New course materials"],
        ].map(([key, label]) => (
          <label key={key}>
            {label}
            <input
              type="checkbox"
              checked={preferences[key]}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  [key]: event.target.checked,
                }))
              }
            />
          </label>
        ))}
      </section>
    </main>
  );
}

export default SettingsPage;
