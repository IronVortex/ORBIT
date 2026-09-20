// Removed fake data generation and @uiw/react-heat-map because there's no actual API data for it.
// We display the empty state as requested by the premium redesign guidelines.

const HeatMapProfile = () => {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl) 0', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--spacing-md)', opacity: 0.5 }}>
        {/* Subtle geometric visual instead of giant illustration */}
        ⬚ ⬚ ⬚
      </div>
      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--spacing-xs)', color: 'var(--text-primary)' }}>
        No contribution activity yet
      </h3>
      <p style={{ fontSize: 'var(--text-sm)', maxWidth: '400px', margin: '0 auto' }}>
        Your activity will appear here as you build and collaborate in ORBIT.
      </p>
    </div>
  );
};

export default HeatMapProfile;
