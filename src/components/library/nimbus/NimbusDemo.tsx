import * as React from 'react'
import { NM_CHAT_MESSAGES } from './nimbusData'
import { NimbusRoot } from './NimbusStyles'

export type NimbusDemoProps = {
  className?: string
}

export function NimbusDemo({ className }: NimbusDemoProps) {
  return (
    <NimbusRoot className={className}>
      <section id="demo" className="nm-section" aria-labelledby="nm-demo-title">
        <div className="nm-container">
          <p className="nm-eyebrow">Live product feel</p>
          <h2 id="nm-demo-title" className="nm-h2">
            Ask the document — get a grounded answer
          </h2>
          <p className="nm-lead">
            Drop a PDF, ask in plain language, and receive a reply tied to the exact clause or page.
          </p>
          <div className="nm-demo-card nm-glass" style={{ marginTop: 36 }}>
            <div className="nm-demo-bar">
              <span className="nm-demo-dot" />
              <span className="nm-demo-dot" />
              <span className="nm-demo-dot" />
              <span className="nm-demo-file">Acme_MSA_2024.pdf</span>
            </div>
            <div className="nm-chat" role="log" aria-live="polite">
              {NM_CHAT_MESSAGES.map((msg) => (
                <div
                  key={msg.id}
                  className={[
                    'nm-msg',
                    msg.role === 'user' ? 'nm-msg--user' : 'nm-msg--assistant',
                  ].join(' ')}
                >
                  <p style={{ margin: 0 }}>{msg.content}</p>
                  {msg.meta ? <div className="nm-msg-meta">{msg.meta}</div> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </NimbusRoot>
  )
}
