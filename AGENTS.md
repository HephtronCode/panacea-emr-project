# AI & MCP System Development

## 1. The Workflow: "Architectural Pairing"

This project was built using an AI-assisted workflow simulating a Senior Architect (AI) and Lead Developer (Human) pair programming dynamic.

**The Tools:**

- **Core AI:** Gemini 3 pro acting as "Riddick" (Persona).
- **Prompt Engineering:** Utilizing a persistent "System Architect" persona defined to enforce SOLID principles, Layered Architecture, and Security-first mindset.

**Role Definition:**

- The **AI Architect** defined the folder structures, schema relationships, and API contracts.
- The **AI Auditor** reviewed code for security flaws (e.g., advising generic error messages for auth failures).
- The **Human Developer** executed the implementation, resolved environmental conflicts (npm versions), and guided the business logic requirements.

## 2. MCP (Model Context Protocol) Usage

MCP servers were used to keep tooling consistent, fetch authoritative docs, and streamline repository tasks inside VS Code.

### 2.1 MCP Servers Used

- **Library Docs MCP (Context7 GitHub UPS):** Pulled up-to-date documentation and API references for libraries used in the stack (e.g., Express 5, Mongoose 9, Vite 7, TanStack Query 5, React Router 7). This reduced drift vs. web searches and ensured correct versions during implementation of `middleware`, `controllers`, and frontend API clients.

  - Purpose: Authoritative docs and code examples
  - Typical topics: routing, validation, query caching, axios interceptors

- **GitHub MCP (Repository & Gist Operations):** Assisted with lightweight content operations (creating/updating gists for code snippets, referencing releases/artifacts, and keeping issue/PR notes synchronized). Used during documentation iterations and review cycles.
  - Purpose: Repo content access and dev-notes sharing
  - Typical actions: create gist of example payloads; fetch release info; update issue descriptions

### 2.2 How MCPs Supported This Project

- Ensured the backend’s Express 5 route patterns and async error handling matched current guidance.
- Verified Mongoose connection options and schema patterns for unique indexes (e.g., `patients.phone`).
- Confirmed frontend Vite 7 configuration and dev server behavior for concurrent runs with the backend.
- Streamlined doc updates (PRD/TECHNICAL_DOCS/README) by linking to stable references and examples.

### 2.3 Setup Notes

- MCP servers run inside VS Code and expose capabilities to the coding agent.
- No project runtime dependency on MCP; they were used for development assistance only.
- If enabling additional MCP integrations, keep credentials/tokens out of the repository and use local environment settings.

## 3. Automated Code Generation Strategy

Code was not simply generated; it was _iteratively refined_.

1.  **Draft:** AI proposes the `PatientController`.
2.  **Audit:** Human notes missing "Soft Delete" requirements.
3.  **Refactor:** AI generates the Schema Middleware implementation to handle soft deletes transparently.
