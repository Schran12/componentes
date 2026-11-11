'use client'

import * as React from 'react'
import { NM_CODE_SAMPLES, type NmCodeTab } from './nimbusData'
import { NimbusRoot } from './NimbusStyles'

export type NimbusDeveloperProps = {
  className?: string
}

export function NimbusDeveloper({ className }: NimbusDeveloperProps) {
  const [tab, setTab] = React.useState<NmCodeTab['id']>('curl')
  const [copied, setCopied] = React.useState(false)
  const active = NM_CODE_SAMPLES.find((s) => s.id === tab) ?? NM_CODE_SAMPLES[0]

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(active.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <NimbusRoot className={className}>
      <section id="docs" className="nm-section" aria-labelledby="nm-dev-title">
        <div className="nm-container">
          <div className="nm-dev-grid">
            <div>
              <p className="nm-eyebrow">Developers</p>
              <h2 id="nm-dev-title" className="nm-h2">
                One POST. Cited JSON back.
              </h2>
              <p className="nm-lead">
                Authenticate with a bearer key, send a document id and question, and receive an
                answer plus source spans. Streaming and webhooks are available on Growth and Scale.
              </p>
              <p className="nm-lead" style={{ marginTop: 12 }}>
                SDKs for Python and Node mirror the REST surface — no new concepts to learn.
              </p>
            </div>
            <div className="nm-code-panel">
              <div className="nm-code-tabs" role="tablist" aria-label="Code language">
                {NM_CODE_SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    role="tab"
                    aria-selected={tab === sample.id}
                    className={['nm-code-tab', tab === sample.id ? 'is-active' : '']
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => setTab(sample.id)}
                  >
                    {sample.label}
                  </button>
                ))}
                <button type="button" className="nm-code-copy" onClick={onCopy}>
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="nm-code-body" role="tabpanel">
                <code>{active.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>
    </NimbusRoot>
  )
}
