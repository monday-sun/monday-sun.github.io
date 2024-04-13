---
title: "Micro-commits"
author: Monday Romelfanger
last_modified_at: 2024-04-13 15:51:20 -0700
categories: micro-commits
tags: [development-process]
excerpt: "Commit and forget"
toc: true
---

# Problem

As software engineers, we expect too much from our brains. We expect to be able to hold onto enough context to make new features, without breaking existing ones, rarely with enough test coverage to make sure we didn't break something. Our brains don't actually have as much [working capacity](https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two) as we'd like to believe.

# Pre-requisutes

This assumes you're using git, but you could use any other tool that allows for lots of branching, frequent commits, and preferably, squash merging.

# Description

Micro-commits is a development process aimed at releaving your brain from holding onto so much information, with a ton of side benefits. At its core, it's easy to describe: make the absolute smallest decisions and commit to them. This process is especially great for working with any code you didn't write yourself, because it captures your learnings into the code itself.

## Process

### 1. Find a file you want to change, and make a new branch

This doesn't have to be exact, just start somewhere reasonable for your task. You may also want to start a build and tests in watch mode, if you have one available.

### 2. Write one insight into your code

Add one test, rename one variable or method, extract one method, or make one small feature change. This should be the smallest decision you can make. _Build should succeed; tests should still pass_ (unless you intentionally added a failing one). Initially it will feel awkward to break up changes this small, but you'll get a better sense of what's reasonable as you practice. Stick to one thing per commit to start.

### 3. Add your changed files and commit

Use a standard commit prefix a pattern to indicate the risk associated with the change.

### 4. Repeat steps 2 & 3 up to 14 times

Follow your ideas, and keep writing down one thing at a time. Each commit is one step forward, and we always want to capture as much progress as we can even if we go down the wrong path. If you need to backtrack, do `git reset --hard` until you get back to your last good change. Repeat until your item is complete, you have a sensible set of changes. Don't do more than about 15 commits, our your change will become hard to review. This is another thing you can use your judgement on, but stick to 15 to start.

### 5. Review your full set of changes

- Does the build and tests pass? If not, you need to fix any issues or backup to the last working change.
- Use `git diff main` or push your branch to it's remote host (Github, GitLab, etc.) and take a look at the full set of changes.
- Is it explainable? If it is move to step 6. If not, you can either reset back to the last explainable set, or create a new branch and start over at step 1.
- You want a change that can be reviewed in < 5 minutes, while still providing forward movement on any work item, no matter the complexity of the code.

### 6. Do your standard code review or merge process

## Commit Prefixes

Because you're committing frequently, it's a best to have a set of prefixes that you default to adding to the front of each commit. The prefixes are the most meaningful and important part of a micro-commit message. They should tell you and your reviewers the level of scrutiny any individual change requires. The rest of the message can be helpful context, but can be kept very simple.

### Example Prefixes

| Prefix   | Meaning                                                                                                                                                                  | Example                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| COMMENT: | I only changed comment/white space                                                                                                                                       | COMMENT: updated comment on MyClass                |
| TEST:    | I only changed or added a test                                                                                                                                           | TEST: added missing test for MyClass               |
| TOOL:    | I used a tool to do this task. This includes renames and file moves done with IDE tools, especially if a compiler will validate it. If appropriate, include the command. | TOOL: nx g library my-new-lib                      |
| MANUAL:  | I followed a [safe refactoring technique](https://refactoring.guru/refactoring/catalog) to make this change.                                                             | MANUAL: moved someMethod to new class              |
| RISKY:   | I did not follow a safe refactoring technique, but I believe this should have no behavior change                                                                         | RISKY: moved registration from ModuleA to Module B |
| OOPS:    | I made a mistake previously that I need to fix                                                                                                                           | OOPS: fix incorrect import                         |
| FEATURE: | I changed the behavior to do something new                                                                                                                               | FEATURE: implemented someNewBahavior               |

# Credit

This process was taught to me originally as part of Arlo Belshee's [Read-by-Refactoring](https://arlobelshee.com/the-core-6-refactorings/) class at Tableau Software

# Related
