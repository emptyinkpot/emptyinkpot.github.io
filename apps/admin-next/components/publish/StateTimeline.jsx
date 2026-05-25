export default function StateTimeline({ steps, state }) {
  return (
    <section className="timeline-grid">
      {steps.map((step) => {
        const name = typeof step === "string" ? step : step.id || step.name;
        const status = typeof step === "string" ? "" : step.status || "";
        const active = name === state || status === "passed" || status === "skipped" || state === "succeeded";
        return (
          <div key={name} className={`timeline-step ${active ? "timeline-step-active" : ""}`}>
            {name}
          </div>
        );
      })}
    </section>
  );
}
