---
title: "Micro-commits"
author: Monday Romelfanger
last_modified_at: 2024-04-12 02:04:25 -0700
categories: development-process
excerpt: "Micro-commits is a development process aimed at releaving your brain from holding onto so much information, with a ton of side benefits. At its core, it's easy to describe: make the absolute smallest decisions and commit to them (for now)."
toc: true
---

# What mistake are we solving?

As software engineers, we expect too much from our brains. We expect to be able to hold onto enough context to make new features, without breaking existing ones, rarely with enough test coverage to make sure we didn't break something. Our brains don't actually have as much [working capacity](https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two) as we'd like to believe.

# Description

Micro-commits is a development process aimed at releaving your brain from holding onto so much information, with a ton of side benefits. At its core, it's easy to describe: make the absolute smallest decisions and commit to them (for now).

## Process

So you've got work item, you log into your dev environment, and want to change some code. You may or may not know the code very well.

##

# Perks

# Binary search for mistakes

# Self Documenting decisions

# Lifelines

## Incremental review

### Commit Prefixes

Because you're committing frequently, it's a best to have a set of prefixes that you default to adding to the front of each commit. The prefixes are the most meaningful and important part of a micro-commit message. The prefix should tell you and your reviewers the level of scrutiny any individual change requires. The rest of the message can be helpful context, but can be kept very simple.

### Example Prefixes

This tagging scheme is what I gravitate too, but it's not

| Prefix   | Meaning                                                                                                                                                                  | Example                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| COMMENT: | I only changed comment/white space                                                                                                                                       | COMMENT: updated comment on MyClass                |
| TEST:    | I only changed or added a test                                                                                                                                           | TEST: added missing test for MyClass               |
| TOOL:    | I used a tool to do this task. This includes renames and file moves done with IDE tools, especially if a compiler will validate it. If appropriate, include the command. | TOOL: nx g library my-new-lib                      |
| MANUAL:  | I followed a [safe refactoring technique](https://refactoring.guru/refactoring/catalog) to make this change.                                                             | MANUAL: moved someMethod to new class              |
| RISKY:   | I did not follow a safe refactoring technique, but I believe this should have no behavior change                                                                         | RISKY: moved registration from ModuleA to Module B |
| OOPS:    | I made a mistake previously that I need to fix                                                                                                                           | OOPS: fix incorrect import                         |
| FEATURE: | I changed the behavior to do something new                                                                                                                               | FEATURE: implemented someNewBahavior               |
