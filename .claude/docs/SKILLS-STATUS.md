# Estado de Skills Comunitarios — Cuidados en Red

Registro de skills comunitarios buscados, para no repetir búsquedas fallidas.

**Última actualización:** 2026-03-13

---

## 5.1 Accesibilidad

| Repo | Skill | Estado | Notas |
|---|---|---|---|
| charlesjones-dev/claude-code-plugins-dev | `accessibility-audit` | ✅ Encontrado | 788 líneas, WCAG 2.1/2.2, niveles A/AA/AAA, soporte Playwright MCP, template de reporte detallado |

## 5.2 Científicos

| Repo | Skill | Estado | Notas |
|---|---|---|---|
| K-Dense-AI/claude-scientific-skills | `literature-review` | ✅ Encontrado | Metodología PRISMA, 7 fases, multi-base (PubMed, bioRxiv, arXiv) |
| K-Dense-AI/claude-scientific-skills | `citation-management` | ✅ Encontrado | Búsqueda PubMed, DOI, BibTeX, 5 fases con scripts Python |
| K-Dense-AI/claude-scientific-skills | (170+ skills totales) | ✅ Encontrado | Formato AgentSkills.io, incluye clinical-decision-support, treatment-plans, 37+ database skills |
| K-Dense-AI/claude-scientific-writer | (27 skills) | ✅ Encontrado | Generación PDF/DOCX/PPTX, clinical-reports, workflow científico completo |

## 5.3 Verificación

| Repo | Skill | Estado | Notas |
|---|---|---|---|
| liangdabiao/fact-checker | — | ❌ No encontrado | Repo no existe o es privado (auth error en git ls-remote) |
| liangdabiao/citation-validator | — | ❌ No encontrado | Repo no existe o es privado (auth error en git ls-remote) |
| K-Dense-AI/claude-scientific-skills | `citation-management` | ✅ Alternativa viable | Puede servir como verificador de citas científicas |

## 5.4 Workflow

| Repo | Skill | Estado | Notas |
|---|---|---|---|
| coreyja/coreyja.com | `global-conventions` | ✅ Encontrado | Referencia estándares en agent-os/standards/global/conventions.md; 15 skills totales |
| 2389-research/ourocodus | `documentation-audit` | ✅ Encontrado | 190+ líneas, sistema multi-pass (Pass 0-4), requiere Serena/Zen MCPs |

## 5.5 Diseño

| Repo | Skill | Estado | Notas |
|---|---|---|---|
| drMcDean/claude-design-skills | — | ❌ No encontrado | Repo no existe bajo ese nombre |
| Owl-Listener/designer-skills | (63 skills en 8 plugins) | ✅ Encontrado | Repo real de Marie-Claire Dean. Incluye design-systems (8), ux-strategy (8), designer-toolkit (6), ui-design (9), design-research (10), interaction-design (7), prototyping-testing (8), design-ops (7) |
| Owl-Listener/designer-skills | `design-token` | ✅ Relevante | Gestión de design tokens |
| Owl-Listener/designer-skills | `design-principles` | ✅ Relevante | Principios de diseño |
| Owl-Listener/designer-skills | `design-token-audit` | ✅ Relevante | Auditoría de design tokens |

---

## Skills instalados en este proyecto

| Skill | Origen | Ubicación local | Notas |
|---|---|---|---|
| `accessibility-audit` | charlesjones-dev/claude-code-plugins-dev | `.claude/skills/accessibility-audit/` | Adaptado para WCAG AAA y contexto del proyecto |

## Skills NO instalados (razón)

| Skill | Razón |
|---|---|
| K-Dense-AI literature-review | No relevante para sitio web estático |
| K-Dense-AI citation-management | No relevante para sitio web estático |
| K-Dense-AI scientific-writer | No relevante para sitio web estático |
| coreyja global-conventions | Demasiado genérico; proyecto ya tiene CLAUDE.md con convenciones propias |
| 2389-research documentation-audit | Requiere Serena/Zen MCPs no disponibles |
| Owl-Listener design-token | Proyecto no usa design tokens formales (CSS vanilla) |
| Owl-Listener design-principles | Proyecto ya tiene gcba-2032-identity con principios propios |
