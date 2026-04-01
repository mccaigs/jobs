# Product Design Requirements (PDR)

## AI Job Intelligence System — Public Interface

---

## 1. Product Overview

### Product Name

AI Job Intelligence System

### Purpose

To present a live, autonomous AI system that discovers, filters, and ranks AI jobs across the UK market, transforming raw markdown outputs into a premium, editorial-grade interface.

### Core Objective

Convert a raw GitHub-based reporting system into a **calm, high-signal, recruiter-facing product experience** that demonstrates:

* real system execution
* applied AI thinking
* production-quality outputs

---

## 2. Problem Statement

Current state:

* Job reports exist as markdown files in a GitHub repo
* Valuable insights are buried in raw text
* Presentation lacks clarity and narrative
* Recruiters must interpret structure manually

This creates friction and reduces perceived value.

---

## 3. Product Vision

### North Star

A **career intelligence operating system**, not a dashboard.

### Design Philosophy

“The Digital Curator”

* calm
* structured
* editorial
* intentional
* quietly authoritative

The interface should feel like:

* a high-end architectural journal
* not a SaaS tool
* not a file browser

---

## 4. Target Users

### Primary

* Recruiters evaluating candidates
* Hiring managers in AI / ML roles

### Secondary

* AI engineers / contractors
* Product builders / founders

---

## 5. Core User Journey

1. User lands on the site

2. Immediately understands:

   * what the system is
   * that it runs daily
   * that outputs are real

3. Sees latest report (auto-loaded)

4. Navigates historical reports via left rail

5. Reads structured insights

6. Gains confidence in system + creator

---

## 6. Functional Requirements

### 6.1 Content Loading

* Load markdown reports from local repository
* Use `import.meta.glob()` for discovery
* Support multiple naming formats
* Parse:

  * date
  * report type (daily / UK-wide)

---

### 6.2 Report Navigation (Left Rail)

* Display list of reports
* Group:

  * Daily Targeted
  * UK-wide
* Highlight active report
* Sort newest first
* Scrollable list

---

### 6.3 Report Viewer (Main Column)

* Render markdown content with MDX or parser

* Support:

  * headings
  * lists
  * tables
  * links
  * blockquotes

* Display header:

  * title
  * date
  * report type
  * GitHub source link

---

### 6.4 System Context (Right Rail)

#### About Me

* Name
* Role
* Short profile

#### About System

* Description
* Execution model (twice daily)

#### Live Stats

* number of reports
* latest update
* repo link

#### Purpose

* explanation of value

---

### 6.5 Routing

* `/` → latest report
* `/report/:slug` → specific report

---

### 6.6 Responsive Behaviour

* Left rail collapses on mobile
* Right rail stacks below content
* Tables scroll horizontally if needed

---

## 7. Non-Functional Requirements

### Performance

* Fast load time (<1s for initial render)
* Static build preferred

### Reliability

* No external dependencies for content
* Fully local markdown loading

### Maintainability

* Clean component structure
* Minimal abstraction
* Easy to extend

---

## 8. Design Requirements

### 8.1 Layout

Three-column structure:

* Left: Report navigation
* Middle: Report content
* Right: System context

---

### 8.2 Visual System

#### Colour Palette

* Surface: #161311
* Container: #221f1d
* Cards: #2d2927
* Active: #383431
* Accent: #ffb86c → #c8863a
* Text: #e9e1dd

---

### 8.3 The “No-Line Rule”

* No visible borders
* Use tonal layering instead

---

### 8.4 Typography

* Headlines: Newsreader
* Body/UI: Manrope

---

### 8.5 Depth & Elevation

* Use layering, not shadows
* Minimal soft ambient shadows only if required

---

### 8.6 Components

#### Cards

* rounded
* layered surfaces
* no borders

#### Lists

* spacing-based separation
* no dividers

#### Buttons

* gradient accent
* uppercase labels

---

### 8.7 Animation

* 300ms ease-out
* no bounce
* minimal motion

---

## 9. Data Model

### Report Object

* id (slug)
* title
* date
* type (daily / UK)
* content (markdown)
* isLatest (boolean)

---

## 10. Architecture

### Stack

* Vite
* React
* TypeScript
* Tailwind
* MDX / Markdown renderer

### Data Source

* Local markdown files
* Loaded at build time

---

## 11. Success Criteria

### Functional

* Reports load correctly
* Navigation works
* Markdown renders cleanly

### UX

* User understands system within 5 seconds
* Interface feels calm and premium
* No visual clutter

### Perception

* Feels like a product, not a repo
* Signals strong AI systems thinking
* Differentiates from typical candidates

---

## 12. Future Enhancements (Out of Scope for V1)

* CV tailoring integration
* “Apply” actions
* role highlighting (Top 3)
* filtering and tagging
* live GitHub sync
* analytics dashboard

---

## 13. Constraints

* No backend
* No database
* No authentication
* Static-first architecture

---

## 14. Key Principle

This is not a UI.

This is a **window into a working system**.

Clarity, calmness, and intent matter more than features.
