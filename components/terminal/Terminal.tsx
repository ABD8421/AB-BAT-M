"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { experience } from "@/data/experience";
import { education } from "@/data/education";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { certificates } from "@/data/certificates";

interface Line {
  kind: "in" | "out" | "err";
  text: string;
}

const BANNER: Line[] = [
  { kind: "out", text: "BATCOMPUTER TACTICAL RECON v2.4 — Gotham Detective Interface" },
  { kind: "out", text: "Telemetry: 40.7128° N, 74.0060° W | Clearance: Level 4" },
  { kind: "out", text: "Type 'help' to query intelligence registers or clear to purge buffer." },
];

const COMMANDS: Record<string, () => string> = {
  help: () =>
    [
      "Available commands:",
      "  about           identity and focus",
      "  skills          technologies by category",
      "  projects        case files",
      "  experience      mission log",
      "  education       academic record",
      "  certifications  credentials and achievements",
      "  services        what I build",
      "  contact         direct channels",
      "  resume          developer dossier",
      "  github          repository profile",
      "  clear           wipe the screen",
    ].join("\n"),
  about: () => `${site.name}\n${site.role} — ${site.location}\nFocus: ${site.focus}\n${site.tagline}`,
  skills: () =>
    skills.map((skill) => `  ${skill.name.padEnd(16)} ${skill.level}`).join("\n"),
  projects: () =>
    projects.map((project) => `  #${project.caseNumber}  ${project.title}  [${project.category}]  /projects/${project.slug}`).join("\n"),
  experience: () =>
    experience.length === 0
      ? "No entries recorded."
      : experience.map((item) => `  ${item.start}–${item.end}  ${item.role} @ ${item.organization}`).join("\n"),
  education: () =>
    education.length === 0
      ? "No entries recorded."
      : education.map((item) => `  ${item.start}–${item.end}  ${item.degree}, ${item.institution}`).join("\n"),
  contact: () => `Email:    ${site.email}\nGitHub:   ${site.links.github}\nLinkedIn: ${site.links.linkedin}`,
  resume: () => `Open ${site.resumePath} or visit /resume`,
  github: () => (site.githubUsername ? `github.com/${site.githubUsername}` : "GitHub username is not configured."),
  services: () =>
  services.map((s) => `  [${s.title.toUpperCase()}]\n  ${s.description}\n  Deliverables: ${s.deliverables.join(", ")}`).join("\n\n"),
  certifications: () =>
  certificates.length === 0 || certificates.every((c) => c.placeholder)
    ? "No verified credentials recorded yet."
    : certificates.map((c) => `  ${c.name} — ${c.issuer} (${c.issued})`).join("\n"),
};

export function Terminal() {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight });
  }, [lines]);

  function run(rawInput: string) {
    const input = rawInput.trim();
    if (!input) return;

    setHistory((current) => [input, ...current].slice(0, 40));
    setCursor(-1);

    if (input.toLowerCase() === "clear") {
      setLines(BANNER);
      return;
    }

    const name = input.toLowerCase();
    const command = Object.hasOwn(COMMANDS, name) ? COMMANDS[name] : undefined;
    setLines((current) => [
      ...current,
      { kind: "in", text: `> ${input}` },
      command
        ? { kind: "out", text: command() }
        : { kind: "err", text: `Unknown command: ${input}. Type 'help'.` },
    ]);
  }

  return (
    <div className="terminal panel--hud panel--casefile" onClick={() => inputRef.current?.focus()}>
      <div className="casefile__header" style={{ padding: "0.6rem 0.8rem", borderBottom: "1px solid var(--edge)", background: "var(--void)" }}>
        <span className="casefile__stamp">
          <span className="casefile__stamp-dot" />
          BATCOMPUTER TACTICAL RECON SHELL // PORT 443
        </span>
        <span className="casefile__status" data-status="verified">
          FEED SECURE
        </span>
      </div>

      <div className="terminal__out" ref={outputRef} role="log" aria-live="polite" aria-label="Terminal output">
        {lines.map((line, index) => (
          <pre key={index} className="terminal__line" data-kind={line.kind}>{line.text}</pre>
        ))}
      </div>

      <form
        className="terminal__form"
        onSubmit={(event) => {
          event.preventDefault();
          run(value);
          setValue("");
        }}
      >
        <span className="terminal__prompt" aria-hidden="true">&gt;</span>
        <label htmlFor="terminal-input" className="sr-only">Terminal command</label>
        <input
          id="terminal-input"
          ref={inputRef}
          className="terminal__input"
          value={value}
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp" && history.length > 0) {
              event.preventDefault();
              const next = Math.min(cursor + 1, history.length - 1);
              setCursor(next);
              setValue(history[next] ?? "");
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              const next = Math.max(cursor - 1, -1);
              setCursor(next);
              setValue(next === -1 ? "" : (history[next] ?? ""));
            }
          }}
        />
      </form>
    </div>
  );
}
