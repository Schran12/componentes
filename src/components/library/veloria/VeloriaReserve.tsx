'use client'

import * as React from 'react'
import {
  EMAIL_ADDRESS,
  PHONE_NUMBER,
  RESPONSE_TIME,
  VL_DESTINATION_OPTIONS,
  VL_GUEST_OPTIONS,
  VL_YACHT_OPTIONS,
} from './veloriaData'
import { IconStarMark } from './VeloriaIcons'
import { VeloriaRoot } from './VeloriaStyles'

export type VeloriaReserveProps = {
  className?: string
  onQuoteSubmit?: (form: HTMLFormElement) => void
}

export function VeloriaReserve({ className, onQuoteSubmit }: VeloriaReserveProps) {
  const [sent, setSent] = React.useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onQuoteSubmit?.(e.currentTarget)
    setSent(true)
  }

  return (
    <VeloriaRoot className={className}>
      <section id="reserve" className="vl-reserve" aria-label="Reserve">
        <div className="vl-reserve-grid">
          <div className="vl-reserve-copy">
            <div className="vl-badge">
              <i aria-hidden="true" />
              Now booking the season
            </div>
            <blockquote className="vl-serif">
              You don&apos;t rent a yacht. You borrow the <em>horizon</em>.
            </blockquote>
            <p>
              Tell us where, when and who. A charter manager replies within {RESPONSE_TIME} with
              yacht options, a route and an all-in quote.
            </p>
          </div>
          <form
            className={['vl-qf', sent ? 'vl-sent' : ''].filter(Boolean).join(' ')}
            aria-label="Request a charter quote"
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="vl-ttl">Request a charter quote</div>
            <div className="vl-g2">
              <div>
                <label htmlFor="vl-q-dest">Destination</label>
                <select id="vl-q-dest" name="destination" defaultValue={VL_DESTINATION_OPTIONS[0]}>
                  {VL_DESTINATION_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="vl-q-yacht">Yacht</label>
                <select id="vl-q-yacht" name="yacht" defaultValue={VL_YACHT_OPTIONS[0]}>
                  {VL_YACHT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="vl-q-dates">Dates</label>
                <input id="vl-q-dates" name="dates" type="text" placeholder="e.g. 12–19 June" />
              </div>
              <div>
                <label htmlFor="vl-q-guests">Guests</label>
                <select id="vl-q-guests" name="guests" defaultValue="2">
                  {VL_GUEST_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="vl-send">
              <div>
                <label htmlFor="vl-q-email">Email</label>
                <input
                  id="vl-q-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                />
              </div>
              <button type="submit" className="vl-btn">
                Get my quote
              </button>
            </div>
            <div className="vl-legal">
              By requesting a quote you agree to our <a href="#reserve">Privacy Policy</a>.
            </div>
            <div className="vl-ok" role="status">
              Thank you. A charter manager will be in touch. (Demo: not connected to a backend yet.)
            </div>
          </form>
        </div>

        <footer className="vl-footer">
          <div>
            <div className="vl-brand">
              <IconStarMark />
              <span className="vl-serif">VELORIA</span>
            </div>
            <p className="vl-about">
              Private crewed yacht charters across the Mediterranean and the Indian Ocean.
            </p>
          </div>
          <nav aria-label="Charter">
            <h4>Charter</h4>
            <div className="vl-col">
              <a href="#onboard">Onboard</a>
              <a href="#voyage">The voyage</a>
              <a href="#destinations">Destinations</a>
              <a href="#reserve">Request a quote</a>
            </div>
          </nav>
          <nav aria-label="Company">
            <h4>Company</h4>
            <div className="vl-col">
              <a href="#hero">About</a>
              <a href="#hero">Journal</a>
              <a href="#hero">Careers</a>
              <a href="#reserve">Contact</a>
            </div>
          </nav>
          <div>
            <h4>Contact</h4>
            <div className="vl-col">
              <span>{EMAIL_ADDRESS}</span>
              <span>{PHONE_NUMBER}</span>
              <a href="#hero">Instagram</a>
              <a href="#hero">YouTube</a>
            </div>
          </div>
        </footer>
        <div className="vl-wordmark vl-serif" aria-hidden="true">
          VELORIA
        </div>
        <div className="vl-legalbar">
          <span>© 2026 Veloria Yacht Charters</span>
          <span>
            <a href="#reserve">Privacy</a>
            <a href="#reserve">Terms</a>
          </span>
        </div>
      </section>
    </VeloriaRoot>
  )
}
