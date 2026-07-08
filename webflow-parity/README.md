# webflow-parity/ — local parity foundation

Local-only snapshot of the developer's Webflow export, used to prototype new modules in his
**real** conventions before handing them back to Webflow. The rules live in
[`../webflow-parity.md`](../webflow-parity.md).

- `css/` — his exported CSS (normalize + webflow + vpvstaging). **Gitignored** (large
  generated blob; refresh from the latest export).
- `fonts/` — his Neue Haas + Victor Serif files. **Gitignored** — Victor Serif is a *trial*
  font and Neue Haas is licensed, so they must not be published in this public repo. Local only.
- `sandbox.html` — the prototyping surface. Links his foundation, replicates his fluid-root
  font-size, then defines **only the new module classes** inline (these become the new
  classes/combos in the Webflow handoff). Everything else comes from his CSS. Currently
  contains: **Numbered Sequence (#05)**.

**Refresh:** re-copy `css/` and `fonts/` from the newest `…/vpvstaging.webflow …/` export.
