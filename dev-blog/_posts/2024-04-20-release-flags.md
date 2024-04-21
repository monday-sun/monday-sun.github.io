---
title: Release Flags
description: More freedom and fast recovery
author: Monday Romelfanger
categories: release-flags
tags:
  - development-process
  - release-flags
  - feature-flags
last_modified_at: '2024-04-20T18:04:30-07:00'
---
## Problem

People make mistakes, and AI tools are built on the mistakes we make. No matter how much test validation we add pre-release, something will fall through the cracks eventually. If we shift our focus from preventing mistakes to detection and recovery, we can reduce the anxiety of changing existing code, reduce test overhead, and provide our customers with a better failure recovery.

## Pre-requisites

None.

## Description

Release flags are a primary tool for **recovering** from mistakes. They are temporary feature flags that allow you to deploy multiple code branches to production and change between them independently from that deployment.

### Characteristics of Release Flags

#### Context

When rolling out a release flag, you'll want to be able to enable/disable the flag for different subsets of users at different phases. Ideally, each user will have a unique ID, and then additional context, like email, environment, organization, etc. can be added. This allows you to enable it for progressively larger groups. For more complex rollouts like percentage-based rollouts, the unique ID helps maintain a consistent experience for a single user.

#### Context + Key -> Value Map

Release flags will take the user context and a string key and determine the user's current flag value. The key should be a string that represents what the feature is, including a reference to its related work item. The value can be anything; the most common is a boolean, but a number or string can be useful in a multi-stage rollout. They should be easy to access anywhere in your application, and single-user environments, like a browser, typically request flags during application startup to cache them.

#### Independently, Quickly Changeable

The release flag settings must be able to be changed independent of the deployment of the service they are supporting, and quickly. There as some companies that sell feature-flags-as-a-service, such as LaunchDarkly, but these could also be served in other ways, such as from a database, or an independently deployed file. Changes to flag values should be quick and easy to make by developers, product managers, and release managers.

## Process

### 1. Create a Release Flag

First, add your release flag. Set the default value to the 'off' value (usually false).

> For release flags, LaunchDarkly has both _On_/_Off_ and _Available (true)_/_Unavailable (false)_. When creating a release flag you should set _On_ -> _Unavailable_. 
>
> By default, they create these flags with _On_ -> _Available_ and _Off_ -> _Unavailable_. It is common for people to get tripped up when turning a LaunchDarkly flag on for the first time because you rarely want to make it _Available_ to all users as soon as you turn the flag _On_, and adding additional context does not automatically change the _On_ default to _Unavailable_. This means you might accidentally turn it on for all users when you only meant to do it for yourself. You can change the default in the project settings to _On_ -> _Unavailable_.
{: .prompt-warning }

### 2. Create a Code Branch

Branch your code using an if/else statement. As a best practice, release flags should be used primarily in [factories](https://refactoring.guru/design-patterns/factory-method) to create a useful scope for feature development. I'll expand on creating a [useful scope](#scope-of-safety) later.

```
if(myFeatureIsEnabled) {
    // do new code
}
else {
    // do old code
}
```

### 3. Write your feature

Within your code branch, you can now refactor and add any new behavior. All PRs should reference the release flag that creates the code branch, and reviewers should validate that you haven't strayed outside the scope of safety you created.

### 4. Prepare for Deletion

Sometimes in the process of adding a new feature, we will make other code obsolete. If you notice code that should be deleted after the feature is complete, consider wrapping it in a release flag too. This will make it clearer to whoever is deleting the flag that the code should be deleted and helps ensure it actually can be deleted.

### 5. Rollout

During your planning process, you'll want to create your rollout plan. The context you provide to your release flags will create more or less flexibility at this stage. A typical rollout might look like:

1. Enable for yourself
2. Enable for your team
3. Enable for E2E testing and staging
4. Enable internal users on production
5. Enable external users on production
6. Delete the flag from the code

Once all of your changes are in production and ready to release, you can start executing your rollout plan. You may choose to do steps 1-4 all in one day, do step 5 the next day, and step 6 anywhere from 1 to 7 days later depending on the associated risk and your observability confidence.

#### Rollback

If something goes wrong at any stage of rollout, you can revert to the most recent release flag change to the previous settings. Fix the issue, then move forward in your rollout plan.

### 6. Clean up

It's **very important** to clean up release flags as soon as you can. Once you start rollout, create a PR to remove the flag and all related obsolete code. If you created a good scope, this should be straightforward. When you feel confident that a rollback won't be necessary, merge the PR. **If you don't clean up, you will be sad.** Create a work item during your planning process if needed to ensure you will remove it.

## Key Naming Convention

You'll want a naming convention to give you hints about how a release flag is being used. Exactly what information is useful will depend on your other development processes.

An example convention might be: `{temp|perm}-{year}.{month}-{work item id}-{description}`

- `temp`/`perm` -- Your release flags may come from the same source as feature flags. Mark release flags as temporary since they should be removed soon, and mark long-lived feature flags as permanent.
- year.month -- It's helpful to know the age of a flag. If it's temporary and older than a few months, it's worth trying to remove it as soon as possible.
- work item id -- Help other engineers find the work item this feature flag was associated with. This is helpful if a flag is lingering and needs to be cleaned up later.
- description -- A human-friendly description of what you are trying to accomplish.

This would look like `temp-2024.04-jira-ABC-123-cool-new-feature`

## Scope of Safety

One of the most common mistakes in using both release flags and feature flags is creating the code branch inside the classes or functions you intend to change. Don't do this; it's a code smell for poor factoring and will make you hate release flags.

Instead, move one level up in your code and use the release flags to create a zone of safety where you can freely refactor and make any changes necessary.

### Example

I'm going to use Angular in this example, but this applies across frameworks and languages.

Let's consider a dialog component, called `FeatureDialogComponent`. We need to add a new field and include that field in the dialog submission.

```typescript
@Component({
  template: `<div>
    <!-- existing fields -->
  </div>`,
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

```typescript
@Component({
  template: `<div>
    <div [ngIf]="addNewField"></div>
    <!-- existing fields -->
  </div>`
})
export class FeatureDialogComponent {
    let addNewField = false;

    constructor(featureFlags: FeatureFlagService) {
        // some setup
        this.addNewField = featureFlags.get(`temp-2024.04-jira-abc-123-cool-new-feature`);
    }

    onSubmit() {
        if(this.addNewField) {
          // new submit
        }
        else {
          // existing submit
        }
    }
}
```

As you can see, even with this simple task, we're adding multiple `if` statements, and have no room to make quality-of-life improvements to this dialog without adding more. Additionally, this creates more opportunities for mistakes to creep in while removing a release flag. Instead, we should move the release flag handling up to the call stack to a more useful location.

```typescript
abstract class FeatureDialog {
  abstract open();
}

@NgModule({
  providers: [
    {
      provide: FeatureDialog,
      useFactory: (featureFlagService: FeatureFlagService) =>
        featureFlagService.get(`temp-2024.04-jira-abc-123-cool-new-feature`)
          ? new FeatureDialogService()
          : new OldFeatureDialogService(),
      deps: [FeatureFlagService],
    },
  ],
})
export class FeatureDialogModule {}

@Component({
  template: `...`,
})
// Copied from FeatureDialogComponent
export class OldFeatureDialogComponent {}

@Injectable()
// Copied from FeatureDialogService
class OldFeatureDialogService implements FeatureDialog {
  open() {
    // Open OldFeatureDialogComponent
  }
}

@Component({
  template: `...`,
})
export class FeatureDialogComponent {}

@Injectable()
class FeatureDialogService implements FeatureDialog {
  open() {
    // Open FeatureDialogComponent
  }
}
```

In this setup, we're free to completely change `FeatureDialogComponent` and its supporting `FeatureDialogService` however we see fit. As long as it's safe to do so, you want the new code to have the preferred name, and the old code to have a worse name. This keeps us from leaving `NewFeatureDialogComponent` in the codebase forever. Creating a code branch should create a level of safety for exploration and refactoring and leave your code in the best possible final state.

Conversely, you can also make a release flag scope too large and too long-lived and make it difficult to merge other ongoing feature development. Keep your releases focused and remove old code branches.

## FAQ

### How do I test all combinations of release and feature Flags?

You don't. Most flag states should be covered in unit testing, and for end-to-end testing, only the combinations in use are necessary to test. E2E tests should be checked when any flag changes, you should have good observability in place to warn about new errors, and you should have a way for customers to inform you of any issues they're facing. If there's any thought that a recent flag change could be the cause, you can roll back to a previous state and check if the issue is resolved.

### Why don't you just call these feature flags?

There's often a customer use case for feature flags, which includes customers being able to enable and disable features based on their preferences. These kinds of flags are permanent and have different expectations. I find it useful to differentiate the two because they're solving different problems. I would release feature flags as customer features, and use release flags to do it.

### What about this code that's hard to add a release flag to?

There are a few common categories of changes that are hard to flag. You should have a deployment rollback plan to handle mistakes here.

#### 1. Application or service container

If you need to change the core application or service container, you may be able to move the release flag upstream to another service and provide both versions in parallel. This is similar to the recommendation for creating a code branch but applies across service boundaries. However, this may be more costly than the time associated with rollbacks.

#### 2. Refactoring to create a good release flag scope

Often the code is not factored in a way that helps create a useful scope for making changes. You can use [micro-commits](/posts/micro-commits/) and [safe-refactoring techniques](https://refactoring.guru/refactoring/techniques) to create a better scope while keeping risk low. In the [example](#example), the `abstract class FeatureDialog` and the services that implement it may not have existed, but adding them would be low risk if done carefully.

You should always make this kind of change as a separate PR and ask your reviewers for a high level of scrutiny. This is a judgment call for you and your code reviewers. If adding the scope you want feels too risky to do outside of a release flag, add a release flag further up the stack, refactor to create a place for a release flag, and add the release flag where you want it. You can always back up one step and choose a different problem to make your overall solution easier.

#### 3. Dev Tools

Most dev tool changes you won't be able to flag. You can use [micro-commits](/posts/micro-commits/) to help manage risk instead.

### Why should I take on this much overhead?

This is necessary for continuous deployment or it can provide a path to more frequent deployments. Deployment rollbacks tend to take a longer time to complete and involve many more people in the decision-making and execution. Rollbacks and reverting code are more time-consuming and stressful than developing a comfortable practice using release flags.

This process also helps create an environment where developers will feel safer to take the risks associated with refactoring or rewriting, so they can do those tasks when they're immediately helpful, rather than delaying them until they become a huge burden. At the same time, this provides boundaries to where these fixes are appropriate. It helps keep us focused on what matters right now, while also creating space for creativity and quality.