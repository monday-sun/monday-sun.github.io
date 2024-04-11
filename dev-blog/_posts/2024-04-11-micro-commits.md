---
layout: post
title:  "Micro-commits"
date:   2024-04-11 16:19:00 -0700
categories: development process
---

| Prefix | Meaning | Example |
|--------|---------|---------|
| COMMENT: | I only changed comment/white space | COMMENT: updated comment on MyClass |
| TEST: | I only changed or added a test | TEST: added missing test for MyClass |
| TOOL:  | I used a tool to do this task. This includes renames and file moves done with IDE tools, especially if a compiler will validate it. If appropriate, include the command. | TOOL: nx g library my-new-lib |
| MANUAL: | I followed a [safe refactoring technique](https://refactoring.guru/refactoring/catalog) to make this change. | MANUAL: moved someMethod to new class |
| RISKY: | I did not follow a safe refactoring technique, but I believe this should have no behavior change | RISKY: moved registration from ModuleA to Module B |
| FEATURE: | I changed the behavior to do something new | FEATURE: implemented someNewBahavior