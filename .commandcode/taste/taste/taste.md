# Taste
- Prefers the agent to make edits and perform tasks directly rather than giving the user manual instructions to follow. Confidence: 0.8
- Wants existing `.md` documentation files kept in sync with the project's actual current state when changes are made. Confidence: 0.7
- Uses the `gcb` shell alias to switch git branches and expects `gcb <branch>` to work for any branch. Confidence: 0.7
- Prefers a wider main content section across pages on larger/responsive screens, but not necessarily on mobile. Confidence: 0.7
- Prefers text centered/middle in content areas. Confidence: 0.6
- Communicates by pasting a screenshot or raw output plus a terse message — for bug reports (e.g. "whats wrong there?", "why this not starting?") and for visual/change requests (e.g. a screenshot with "create a image and use its banner image, give update code") — expecting the agent to inspect the context and act autonomously rather than being given step-by-step instructions. Confidence: 0.7
- Prefers the agent to reuse the user's existing authenticated sessions (e.g., a logged-in browser profile) to fetch configuration/secrets from external services directly, rather than asking the user to re-authenticate or paste values. Confidence: 0.6
- Prefers environment variables/secrets needed for local builds to be stored in the project (e.g., `.env.local`). Confidence: 0.6
