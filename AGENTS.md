# AGENTS

## Purpose

This document defines how AI agents and developers should contribute to the PHYLO project.

Its purpose is to ensure consistent technical decisions, maintainable code, and a development process aligned with the project's educational goals.

When conflicts arise between implementation convenience and project principles, the documented principles should always take precedence.

---

# About PHYLO

Before making significant changes, review the following documentation:

* `documentation/product/ProjectCharter.md`
* `documentation/product/DesignPrinciples.md`
* `documentation/technical/TechStack.md`

These documents define the project's objectives, design philosophy, and approved technologies.

Do not make assumptions that contradict them.

---

# Development Philosophy

When contributing to PHYLO:

* Prioritize clarity over cleverness.
* Prefer simple solutions.
* Build only what is necessary for the current version.
* Avoid unnecessary dependencies.
* Keep the project modular.
* Design for future growth without implementing future features prematurely.

PHYLO values long-term maintainability over short-term speed.

---

# Development Workflow

For every significant task:

1. Understand the objective before writing code.
2. Reuse existing components whenever possible.
3. Keep implementations small and focused.
4. Test the affected functionality.
5. Update documentation if the implemented change modifies documented behavior.

Do not introduce architectural changes without explicit approval.

---

# Technical Guidelines

Follow the technologies defined in:

`documentation/technical/TechStack.md`

Unless explicitly requested:

* Do not introduce additional frameworks.
* Do not replace approved technologies.
* Do not increase project complexity without clear justification.

When several valid implementations exist, choose the simplest one.

---

# Decision Boundaries

AI agents may independently:

* Refactor existing code.
* Improve readability.
* Reduce duplication.
* Optimize performance without changing behavior.
* Improve accessibility.
* Fix bugs.

AI agents must request approval before:

* Introducing new technologies.
* Changing project architecture.
* Modifying navigation structure.
* Removing existing functionality.
* Making significant visual redesigns.
* Changing documented project principles.

---

# Communication Style

Explain important technical decisions briefly.

When introducing a new Astro concept, provide a concise explanation of:

* what it is;
* why it is used;
* how it relates to standard HTML, CSS, and JavaScript.

Avoid lengthy tutorials unless requested.

The goal is to help the project owner understand the code while maintaining development momentum.

---

# Ask Before Expanding Scope

AI agents should not significantly expand the scope of a task without explicit approval.

If a better solution requires additional features, architectural changes, or substantial redesigns beyond the original request, propose the improvement first instead of implementing it directly.

PHYLO follows an incremental development approach: build a solid version first, then iterate.

---

# Definition of Done

A task is considered complete only if:

* The requested functionality works.
* The implementation follows project documentation.
* The code is readable.
* The solution remains modular.
* No unnecessary dependencies were introduced.
* Existing functionality was not broken.
* Documentation has been updated if required.
