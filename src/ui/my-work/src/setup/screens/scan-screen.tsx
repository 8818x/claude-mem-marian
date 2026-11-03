import { useState } from 'react'
import { CheckIcon } from 'lucide-react'
import { AgentMark } from '@/components/brand'
import { DottedGlowBackground } from '@/components/aceternity/dotted-glow-background'
import { agentToolFor, type SetupScanPhase, type SetupScanView } from '../setup-data'
import { scanAgentStatus } from '../setup-scan-status'
import { useMatchesMedia } from '@/lib/use-media'
import { PageHeading } from './shared'

// Modified by the claude-mem-marian fork: Decision 15 hosted-extraction disclosure and authorization actions.

/** PROTO savings.js status phrases, one per scan phase. */
const STATUS: Record<SetupScanPhase, string> = {
  idle: 'Looking for usage history.',
  reading: 'Looking for usage history.',
  checking: 'Checking repeated context.',
  saving: 'Preparing your usage summary.',
  uploading: 'Finding your goals, work and rules.',
  done: 'Preparing your usage summary.',
  failed: 'Setup stopped. Try again when you are ready.',
}

/** Decision 15 disclosure: what hosted extraction sends, where, with which credentials, and that it is not
 * anonymous. Product improvement is a separate preference and never an alias for this choice. */
function HostedAuthorization({ scan, onImproveProductChange, onGrantHostedUpload, onChooseLocalOnly, hostedError }: {
  scan: SetupScanView
  onImproveProductChange: (improveProduct: boolean) => void
  onGrantHostedUpload: () => void
  onChooseLocalOnly: () => void
  hostedError: string | null
}) {
  return (
    <div className="scan-hosted-authorization">
      {scan.hostedSkipped && scan.done && (
        <p className="scan-hosted-skip" role="status">
          Hosted extraction was skipped, so these results stay local. Your prompts were only read on this
          computer; setup can continue without them leaving it.
        </p>
      )}
      <p className="scan-hosted-disclosure">
        Optional: to find your goals, work and rules, hosted extraction sends the text you typed to your AI
        coding tools in the last 30 days — including prompts found stored on this computer — to claude-mem's
        hosted service at cmem.ai, together with each prompt's session identifier, timestamp and project
        folder, plus your timezone offset. It runs with your CMEM account when you are signed in, or with this
        installation's own hosted setup credentials otherwise. Prompt text may contain identifying or
        sensitive information: this upload is not anonymous, and it happens only if you choose it here.
      </p>
      <div className="scan-hosted-actions">
        <button type="button" className="scan-hosted-upload" onClick={onGrantHostedUpload} disabled={scan.phase === 'uploading'}>
          Send prompts for hosted extraction
        </button>
        <button type="button" className="scan-hosted-local" onClick={onChooseLocalOnly}>
          Continue without uploading
        </button>
      </div>
      <label className="scan-improve-product">
        <input type="checkbox" checked={scan.improveProduct} disabled={scan.phase === 'uploading'} onChange={(event) => onImproveProductChange(event.target.checked)} />
        <span>Help improve claude-mem: let this hosted run also be used for product improvement. Turning this off does not stop an authorized upload of your prompts.</span>
      </label>
      {hostedError && <p className="scan-error" role="alert">{hostedError}</p>}
    </div>
  )
}

/** Step 1: each detected agent ticks in and its prompt count climbs while the worker reads the last 30 days. */
export function ScanScreen({ scan, onImproveProductChange, onGrantHostedUpload, hostedError, preferenceError, onRetry, retrying, retryError }: {
  scan: SetupScanView
  onImproveProductChange: (improveProduct: boolean) => void
  onGrantHostedUpload: () => void
  hostedError: string | null
  preferenceError: string | null
  onRetry: () => void
  retrying: boolean
  retryError: string | null
}) {
  const [localOnly, setLocalOnly] = useState(false)
  const detected = scan.agents.filter((agent) => agent.detected)
  const reducedMotion = useMatchesMedia('(prefers-reduced-motion: reduce)')
  // The authorization question exists from scan start until the extraction decision settles: it hides while
  // the authorized upload runs, and after a hosted outcome (done without a skip). SSE, polling and preference
  // changes never reopen it: the local-only dismissal holds for the page's lifetime until a full reload.
  const settled = scan.phase === 'uploading' || (scan.phase === 'done' && !scan.hostedSkipped)
  const showAuthorization = !settled && !localOnly
  return (
    <section aria-labelledby="scan-title">
      <PageHeading id="scan-title" title="Checking your AI usage." lead={detected.map((agent) => agent.label).join(' · ') || undefined} />
      <div className="panel is-memory scan-panel">
        {/* Texture behind the panel's content; reduced motion holds the dots still (speedScale 0). */}
        <DottedGlowBackground className="scan-dots" gap={16} radius={1.5} color="rgba(75, 70, 200, 0.5)" glowColor="rgba(91, 87, 230, 0.9)" opacity={0.5} speedScale={reducedMotion ? 0 : 1} />
        <ul className="scan-agents" aria-label="Agents found on this computer">
          {detected.map((agent) => {
            const status = scanAgentStatus(agent)
            return (
              <li key={agent.id} className={status.note ? 'cannot-run' : undefined}>
                <span className="check" aria-hidden="true"><CheckIcon strokeWidth={3} /></span>
                <AgentMark tool={agentToolFor(agent.id)} className="mark" />
                <span>{agent.label} <span className="detected">({status.label})</span></span>
                <span className="count">{agent.prompts.toLocaleString('en-US')} prompts</span>
                {status.note && <span className="scan-agent-note">{status.note}</span>}
              </li>
            )
          })}
        </ul>
        <div className="scan-meter">
          <progress max={100} value={scan.percent} aria-label="Scan progress">{scan.percent}%</progress>
          <span className="scan-percent" aria-hidden="true">{scan.percent}%</span>
        </div>
        {showAuthorization && (
          <HostedAuthorization
            scan={scan}
            onImproveProductChange={onImproveProductChange}
            onGrantHostedUpload={onGrantHostedUpload}
            onChooseLocalOnly={() => setLocalOnly(true)}
            hostedError={hostedError}
          />
        )}
        {localOnly && !settled && (
          <div className="scan-hosted-authorization is-local-only">
            <p className="scan-hosted-skip" role="status">Hosted extraction stays off for this scan; results are local only.</p>
            <div className="scan-hosted-actions">
              <button type="button" className="scan-hosted-upload" onClick={onGrantHostedUpload} disabled={scan.phase === 'uploading'}>
                Send prompts for hosted extraction
              </button>
            </div>
          </div>
        )}
        <p className="scan-status" role="status" aria-live="polite">{STATUS[scan.phase]}</p>
        {preferenceError && <p className="scan-error" role="alert">{preferenceError}</p>}
        {scan.error && <p className="scan-error" role="alert">{scan.error}</p>}
        {retryError && <p className="scan-error" role="alert">{retryError}</p>}
        {scan.phase === 'failed' && <button type="button" className="scan-retry" onClick={onRetry} disabled={retrying}>{retrying ? 'Starting again…' : 'Try again'}</button>}
      </div>
    </section>
  )
}
