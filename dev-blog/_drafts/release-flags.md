---
title: "Release Flags"
description: "Separating Deployments from Code Changes"
author: Monday Romelfanger
categories: release-flags
tags: [development-process, release-flags, feature-flags]
---

# Problem

People make mistakes, and AI tools are built on the mistakes we make. No matter how much test validation we add pre-release, something will fall through the cracks eventually. If we shift our focus from preventing mistakes to detection and recovery, we can reduce the anxiety of changing existing code, reduce test overhead, and provide our customers with a better failure recovery.

# Description

Release flags are a primary tool for **recovering** from mistakes. They are temporary feature flags that allow you to deploy multiple code branches to production and change between them independently from that deployment.

## Characteristics of Release Flags

### Context

When rolling out a release flag, you'll want to be able to enable/disable the flag for different subsets of users at different phases. Ideally, each user will have a unique ID, and then additional context, like email, environment, organization, etc. can be added. This allows you to enable it for progressively larger groups, such as yourself, then internal users, then external users. For more complex rollouts like percentage-based rollouts, the unique ID helps maintain a consistent experience for a single user.

### Context + Key -> Value Map

Release flags will take the user context and a string key and determine the user's current flag value. The key should be a string that represents what the feature is, including a reference to its related work item. The value can be anything; the most common is a boolean, but a number or string can be useful in a multi-stage rollout. They should be easy to access anywhere in your application, and single-user environments, like a browser, typically request flags during application startup to cache them.

### Independently, Quickly Changeable

The release flag values must be able to be changed independent of the deployment of the service they are supporting, and quickly. There as some companies that sell feature-flags-as-a-service, such as LaunchDarkly, but these could also be served in other ways, such as from a database, or an independently deployed file. Changes to flag values should be quick and easy to make by developers, product managers, and release managers.

# Process

## Create a Release Flag

First, add your release flag. Set the default value to the 'off' value (usually false).

### On/Off vs. true/false

For Release Flags, LaunchDarkly has both On/Off and Available (true) / Unavailable (false). By default, they create these flags with `On` -> `Available` and `Off` -> `Unavailable`. It is common for people to get tripped up when turning a LaunchDarkly flag on for the first time because you rarely want to turn it on for all users at once, and adding additional context does not automatically change the `On` default to `Unavabile`. When creating a flag you should set `On` -> `Unavailable` (and you can change the default in the project settings to `Unavailable`).

### Naming

You'll want a naming convention to give you hints about how a release flag is being used. Exactly what information is useful will depend on your other development processes.

An example convention might be: {temp|perm}-{year}.{month}-{work item id}-{description}

- temp|perm -- Your release flags may come from the same source as feature flags. Mark release flags as temporary since they should be removed soon, and mark long-lived feature flags as permanent.
- year.month -- It's helpful to know the age of a flag. If it's temporary and older than a few months, it's worth trying to remove it as soon as possible.
- work item id -- Help other engineers find the work item this feature flag was associated with. This is helpful if a flag is lingering and needs to be cleaned up later.
- description -- A human-friendly description of what you are trying to accomplish.

This would look like `temp-2024.04-jira-abc-123-cool-new-feature`

## Create a Code Branch

Branch your code using an if/else statement. As a best practice, release flags should be used primarily in [factories](https://refactoring.guru/design-patterns/factory-method).

```
if(myFeatureIsEnabled) {
    // do new code
}
else {
    // do old code
}
```

### Scope of Safety

One of the most common mistakes in using both release flags and feature flags is creating this code branch inside the classes or functions you intend to change. Do not do this, it's a code smell for poor factoring and will make you hate release flags.

Instead, move one level up in your code and use the release flags to create a zone of safety where you can freely refactor and make any changes necessary.

#### Example

I'm going to use Angular 2 + RxJs in this example, but this is just intended to demonstrate a common bad practice across frameworks and languages.

Let's consider a dialog component, called `FeatureDialogComponent`. We need to add a new field and include that field in the dialog submission.

```
@Component({
  template: `
  <div>
    <!-- existing fields -->
  </div>`
})
export class FeatureDialogComponent {
    constructor() {
        // some setup
    }

    onSubmit() {
        // existing submit
    }
}
```

Many developers will go straight to the `Component` they want to change. 

```
@Component({
  template: `
  <div>
    <div [ngIf]="addNewField$ | async"></div>
    <!-- existing fields -->
  </div>`
})
export class FeatureDialogComponent {
    let addNewField$ = of(false);

    constructor(featureFlags: FeatureFlagService) {
        // some setup
        this.addNewField$ = featureFlags.get(`temp-2024.04-jira-abc-123-cool-new-feature`)
    }

    onSubmit() {
        // existing submit
    }
}
```