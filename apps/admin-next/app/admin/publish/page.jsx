"use client";

import { useEffect, useState } from "react";
import ActionButton from "@/components/admin/ActionButton";
import LogPanel from "@/components/admin/LogPanel";
import StateTimeline from "@/components/publish/StateTimeline";

export default function PublishPage() {
  const [state, setState] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    refreshStatus();
  }, []);

  async function refreshStatus() {
    const response = await fetch("/api/publish/status", { cache: "no-store" });
    setState(await response.json());
  }

  async function triggerRelease() {
    await runAction("/api/publish/release");
  }

  async function triggerRollback() {
    await runAction("/api/publish/rollback");
  }

  async function triggerBuild() {
    await runAction("/api/publish/build");
  }

  async function runAction(url) {
    setBusy(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ dryRun: true }),
      });
      setState(await response.json());
    } finally {
      setBusy(false);
    }
  }

  const flow = state?.flow || [];
  const logs = (state?.steps || []).map((step) => `[${step.status}] ${step.name}：${step.message}`);

  return (
    <div className="page-stack">
      <header className="page-header">
        <h1>发布中心</h1>
        <p>Directus 管内容真相，Quartz 管静态构建，Dify 只负责触发和展示流程。</p>
      </header>

      <section className="card publish-status-card">
        <div className="metric-label">当前状态</div>
        <div className="metric-value">{state?.status || "loading"}</div>
        <p>{state?.message || "正在读取发布状态。"}</p>
      </section>

      <StateTimeline steps={flow} state={state?.status} />

      <section className="button-row">
        <ActionButton onClick={triggerBuild} disabled={busy}>检查构建</ActionButton>
        <ActionButton onClick={triggerRelease} disabled={busy}>发布 dry-run</ActionButton>
        <ActionButton tone="danger" onClick={triggerRollback} disabled={busy}>回滚 dry-run</ActionButton>
      </section>

      <LogPanel title="发布流水" lines={logs.join("\n") || "暂无发布流水。"} />
    </div>
  );
}
