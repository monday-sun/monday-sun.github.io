---
title: Write Tests for Code Quality (and use AI to do it)
description: The only real quality is automated quality
author: Monday Romelfanger
categories: release-flags
tags:
  - development-process
  - quality-automation
  - testing
last_modified_at: ''
---
Developing software requires remembering many tiny details that are easy to forget, deprioritize, or miss in the deluge of information we face daily. Given all these details, we generally agree that the way to prevent quality issues for our customers is to write automated tests to reduce the likelihood of forgetting details and alleviate manual testing. We also consider code quality as a factor in how likely we are to introduce customer defects. However, we often overlook that we can also prevent code-quality issues by writing tests.

When we automate code quality, we remove the burden of remembering quality details from developers, reduce onboarding costs, and maintain more consistent quality across a code base.

## Description

Through years of experience repairing low-quality code, I've ended up with two axioms:

- The only truth of a codebase is the code
- Make doing the wrong thing hard and the right thing easy

Looking at quality through that lens, we can see that real quality is automatically enforced and provides automatic or straightforward solutions. Quality automation is not just feature testing but also includes static code testing.

Linters and code generators have become increasingly common. These tools come with recommended defaults, but they also provide powerful ways to write custom tests to ensure we follow codebase-specific best practices.

## Process

### 1. Identify a quality issue

You may be doing this already without realizing it. Did you migrate code off a deprecated implementation? Find a performance issue due to an improperly implemented integration? Implement a new version and want to mark an old one as deprecated? These are all quality issues you noticed, but the code base didn't tell you they were there.

### 2. Create a recipe for fixing the issue

A recipe has a few essential parts:

- How do you identify the issue? Why is the desired outcome important? (What are we cooking?)
- What are the prerequisites for fixing the problem? What assumptions are you making when offering a solution? (What are the ingredients?)
- What are the steps to resolve the issue? (What's the recipe?)

Recipes should have clear, repeatable instructions. Clear steps will help when considering automating testing for and fixing the issue or help less experienced developers make sense of manual steps. This recipe structure is how I've designed this guide (Maybe one day I'll figure out how to automate teaching it 😅)

Providing reasoning for the recipe is essential. Developers need some reason to follow the recommendation rather than disable it, and it's a good way for curious engineers to think more broadly about design, architecture, and quality.

### 3. Write a quality test

You should be able to automate identifying the issue. A custom lint rule, pre-commit hook, or CI step should locate places where we missed a quality concern.

We often don't think of linters as testing, but their primary role is ensuring we meet specific code quality bars, just as tests ensure we meet specific feature quality bars. Typically, they also provide hooks to automate fixing the issue and can link directly to documentation for the recipe. They're a great fit for testing quality, but writing your first is as challenging as the first time you write a unit test.

Writing custom lint rules is where using AI tools can be very effective. You can give the tool your recipe and ask it to generate both the lint rule and tests for those rules. Just remember that, at least today, AI tools can write code but don't understand your intent. Double-check that the test cases provide good coverage, refactor until the code makes sense, and fix defects.

### 4. Automate a fix, if possible

For some recipes, the fix might also be automatable. Linters provide hooks for modifying code directly to fix an issue.

Some issues may be better solved using code generation. Tools like Nx and Angular CLI enable adding custom code generators, but you can also create tool scripts. You can reference these tools in the test documentation. If you can't automate fixing code, automating code generation is a great alternative.

### 5. Make a user-friendly guide for resolving a failing quality test

If the recipe to fix the quality issue is too high-level to offer an automated fix, make sure the test links to a step-by-step guide on resolving it. This guide should use a portion of the recipe but may need to be adjusted based on what you could automate. If you find writing documentation challenging, AI tools can help you here, too.

### 6. Roll out

You can roll out your automation in a few phases:

1. Add the test and warn if it's not followed.
2. Assess the scale of warnings.
   - If the scale is small, you can fix all cases.
   - If it's medium, fix some cases and explicitly turn off the test for specific instances of the issue, usually with a comment, and notify code owners.
   - If it's large, fix some libraries, explicitly set the remaining libraries to warn, and notify code owners.
3. Change the test default to error to prevent new instances.
4. Depending on the severity of the concern, you could put fixing any remaining warning cases on the teams' roadmap.

## Examples

Here are some things I've either automated or wish I had automated in the past:

- Using Angular `ChangeDetectionStrategy.OnPush` for all components in an app with many components and performance concerns.
- Using contracts to prevent code coupling and test runtime explosion.
- Ensuring `NgRx` Facades couldn't be provided at runtime without their matching `Store` or `Effects`.
- Enforcing usage of a new interface instead of a concrete implementation.
- Checking or generating a complex platform object to ensure it was correctly constructed for the use case.

## FAQ

### What if other developers disagree with my quality test?

A few things to consider:

1. Is your quality test _actually_ testing for your quality concern or something adjacent that's less important? Sometimes, we get too focused on one idea and don't address the core issue.
2. How clear is your reasoning for this particular test? If you can't convince others of its value, they will disable it instead of following it.
3. How clear are your steps to resolving the issue? If you raise an issue without an easy fix, you're making it hard to do both the right and wrong things.
4. What kind of ownership do you have over this area? If your team owns a commonly used platform and the tests are related, you have more leeway to implement tests that evaluate more code as part of your ownership. If you're trying to enforce a test beyond your scope, consider implementing it for a smaller scope and demonstrating the value to other teams.
5. Tests are not meant to be forever. It's often worth trying something; if it doesn't prove helpful, change it or remove it.