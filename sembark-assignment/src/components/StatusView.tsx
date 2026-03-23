import React, { Component } from "react";
import { Link } from "react-router-dom";
import { theme } from "../theme";

interface StatusViewProps {
  eyebrow?: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  linkLabel?: string;
  linkTo?: string;
  tone?: "info" | "error";
}

class StatusView extends Component<StatusViewProps> {
  render() {
    const {
      actionLabel,
      eyebrow,
      linkLabel,
      linkTo,
      message,
      onAction,
      title,
      tone = "info",
    } = this.props;

    const accentColor =
      tone === "error" ? theme.colors.danger : theme.colors.accent;

    return (
      <section
        aria-live="polite"
        className="status-card surface-card"
        style={{
          borderColor:
            tone === "error"
              ? "rgba(176, 74, 59, 0.2)"
              : `rgba(15, 110, 140, 0.12)`,
          background:
            tone === "error"
              ? "linear-gradient(180deg, rgba(255, 250, 242, 0.96), rgba(255, 231, 227, 0.58))"
              : theme.colors.surface,
        }}
      >
        {eyebrow ? (
          <span
            className="pill-chip"
            style={{
              background: tone === "error" ? "#ffe7e3" : theme.colors.accentSoft,
              color: accentColor,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.3,
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </span>
        ) : null}

        <div style={{ display: "grid", gap: theme.spacing.sm }}>
          <h1
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: "clamp(1.9rem, 3vw, 2.6rem)",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              color: theme.colors.textMuted,
              lineHeight: 1.7,
              margin: 0,
              maxWidth: 560,
            }}
          >
            {message}
          </p>
        </div>

        <div className="status-card__actions">
          {actionLabel && onAction ? (
            <button
              className="primary-button"
              onClick={onAction}
              style={{
                background:
                  tone === "error"
                    ? "linear-gradient(135deg, #c56b58, #b04a3b)"
                    : undefined,
                color: tone === "error" ? "#ffffff" : undefined,
              }}
              type="button"
            >
              {actionLabel}
            </button>
          ) : null}

          {linkLabel && linkTo ? (
            <Link className="secondary-button" to={linkTo}>
              {linkLabel}
            </Link>
          ) : null}
        </div>
      </section>
    );
  }
}

export default StatusView;
