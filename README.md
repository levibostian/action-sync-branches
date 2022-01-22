![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/levibostian/action-sync-branches?label=latest%20stable%20release)
![GitHub release (latest SemVer including pre-releases)](https://img.shields.io/github/v/release/levibostian/action-sync-branches?include_prereleases&label=latest%20pre-release%20version)

# action-sync-branches

GitHub Action to copy and push commits from one branch to another.

> Note: It's recommended to before you use this action, you feel comfortable with git, git branches, git merging, and git commit histories. Any automated tool that runs git commands for you should always be used with caution. 

# Why use this action? 

* If you have, for example, a `beta` branch that you make beta deployments with. If there are bug fix commits pushed to this branch and you want to copy those bug fix commits over to your default branch of your repository (`main`, `develop`, `next`). 
* If your CI server makes commits on your repository and you want to then copy those commits to another branch. 

# Getting started 

For the examples below, we are assuming that your git repository has it's default branch set to `develop` and you want to sync commits from the `beta` branch into `develop`.

```yml
name: Sync branch beta with develop

on: [push] # make sure that action will run on `push`

jobs:
  sync-branches:
    name: Sync branches 
    runs-on: ubuntu-latest # Action is tested with Linux and it's recommended to use Linux. 
    steps:
      - name: Copy commits in beta to develop branch
        uses: levibostian/action-sync-branches@v1
        with:
          behind: develop
          ahead: beta
          githubToken: ${{ secrets.BOT_PUSH_TOKEN }}
```

The action comes with the following inputs:
* `behind` (required) - this is the branch that you want to copy commits *into*. This branch is missing commits that are in *ahead* branch. 
* `ahead` (required) - the branch that has commits in it that are not in the `behind` branch that you want to copy over. 
* `githubToken` (required) - a [GitHub personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for a GitHub account that has push access to the repository. 
* `skipUnlessPush` (optional, default `"true"`) - Skip running this action unless this action is triggered by a push to the `ahead` branch. Prevents this action from running when not necessary. 

> Note: If either `behind` or `ahead` branches do not exist in the repo when the action runs, the action will simply stop running and ignore the request to sync. 
> Note: This action copies over commits in one direction. Copies commits from the `ahead` branch into the `behind` branch. If you have commits in `behind` that need to be copied into `ahead`, then you need to run this action twice where you set `behind: X, ahead: Y` and `behind: Y, ahead: X`. 

**Tip: If you run this action and the action failed to sync the branches, it might require you to manually fix the issue. See [the fix failure doc](docs/FIX_FAILURE.md) to learn how to manually fix failures when this action fails to succeed.**

# How does this action work? 

Let's say that you have a branch `beta` and `develop`. `beta` is a branch you use for the latest beta deployment of your project. `develop` is the default branch where all new features and fixes go into. 

If we look at the git history of the 2 branches, it might look like this:

[![diagram showing a git branch beta 3 commits ahead of a branch develop](https://mermaid.ink/img/eyJjb2RlIjoiZmxvd2NoYXJ0IFREXG5cbkFbZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgdG8gZWRpdCBwcm9maWxlXSAtLT58Z2l0IGJyYW5jaDogYmV0YXwgQihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4xKVxuXG5BIC0tPnxnaXQgYnJhbmNoOiBkZXZlbG9wfCBDKGdpdCBjb21taXQ6IENyZWF0ZSBmZWF0dXJlIGVkaXQgZW1haWwgYWRkcmVzcylcbkMgLS0-IEQoZ2l0IGNvbW1pdDogRWRpdCBkb2NzIHRvIGV4cGxhaW4gZWRpdGluZyBlbWFpbCBhZGRyZXNzKVxuXG5CIC0tPnxXZSBmb3VuZCBhIGJ1ZyF8IEUoZ2l0IGNvbW1pdDogQnVnIGZpeCBmb3IgZWRpdGluZyBwcm9maWxlKVxuRSAtLT4gRihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4yKSIsIm1lcm1haWQiOnsidGhlbWUiOiJkYXJrIn0sInVwZGF0ZUVkaXRvciI6ZmFsc2UsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjpmYWxzZX0)](https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZmxvd2NoYXJ0IFREXG5cbkFbZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgdG8gZWRpdCBwcm9maWxlXSAtLT58Z2l0IGJyYW5jaDogYmV0YXwgQihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4xKVxuXG5BIC0tPnxnaXQgYnJhbmNoOiBkZXZlbG9wfCBDKGdpdCBjb21taXQ6IENyZWF0ZSBmZWF0dXJlIGVkaXQgZW1haWwgYWRkcmVzcylcbkMgLS0-IEQoZ2l0IGNvbW1pdDogRWRpdCBkb2NzIHRvIGV4cGxhaW4gZWRpdGluZyBlbWFpbCBhZGRyZXNzKVxuXG5CIC0tPnxXZSBmb3VuZCBhIGJ1ZyF8IEUoZ2l0IGNvbW1pdDogQnVnIGZpeCBmb3IgZWRpdGluZyBwcm9maWxlKVxuRSAtLT4gRihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4yKSIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkYXJrXCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9)

Notice how branch `beta` is now 3 commits ahead of `develop`. The 3 unique commits in `beta` all need to be in the `develop` branch. However, the 2 commits that `develop` has that `beta` does not have should not be copied over. Adding the ability to edit an email address will be deployed in a future release of our software.

If we look at the git history of each branch, we will see something like this:

```bash
> git log beta
commit 66666

    deploy 1.0.0-beta.2

commit 555555

    fix bug with editing profile

commit 44444

    deploy 1.0.0-beta.1

commit 11111

    create feature to edit profile
```

```bash
> git log develop
commit 33333

    create feature edit email address

commit 22222

    edit docs to explain editing email address

commit 11111

    create feature to edit profile
```

Notice how all of the git commit hashes in the 2 logs are all different *except* for the hash `11111`. This hash is the same since both of these branches originate from 1 commit where a feature was added to edit a profile. 

This action's job is to take all of the commits that are in the behind branch (in our exmple: `develop`) into the ahead branch (in our example: `beta`). There are a couple of ways for this action to accomplish this goal. It can run: `git checkout develop && git merge beta`. But there is a drawback to the command `git merge`. `merge` generates a new commit. This would mean that after `git merge` runs, the branch `develop` will contain *all* of the commits in the `beta` branch but *will also contain 1 commit that `beta` does not* have. This would mean that instead of `develop` and `beta` being synced together, `develop` is now 1 commit ahead. 

To make the git commit history as identical as possible, this action instead runs the `git rebase` command. `git rebase` is different from `git merge` in that `rebase` does not create the 1 merge commit like `merge` does. 

> Note: `git rebase` is a dangerous command that can make destructive changes to your git repository. That's why it's recommended to run `git merge` instead as it's safe and will not make these destructive changes. This action runs commands as safely as possible and if any command does not run as intended, it will fail to avoid making destructive changes to your repository. If you're going to use `git rebase` yourself manually, do so only if you know what you are doing!

After the actions runs, when you look at the git commit history of each branch, you will see:

```bash
> git log beta
commit 66666

    deploy 1.0.0-beta.2

commit 555555

    fix bug with editing profile

commit 44444

    deploy 1.0.0-beta.1

commit 11111

    create feature to edit profile
```

```bash
> git log develop
commit 33333

    create feature edit email address

commit 22222

    edit docs to explain editing email address

commit 66666

    deploy 1.0.0-beta.2

commit 555555

    fix bug with editing profile

commit 44444

    deploy 1.0.0-beta.1

commit 11111

    create feature to edit profile
```

[![](https://mermaid.ink/img/eyJjb2RlIjoiZmxvd2NoYXJ0IFREXG5cbkFbZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgdG8gZWRpdCBwcm9maWxlXSAtLT58Z2l0IGJyYW5jaDogZGV2ZWxvcCBhbmQgYmV0YXwgQihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4xKVxuXG5CIC0tPiBDKGdpdCBjb21taXQ6IEJ1ZyBmaXggZm9yIGVkaXRpbmcgcHJvZmlsZSlcbkMgLS0-IEQoRGV2ZWxvcG1lbnQgY29tbWl0OiA8YnI-IDEuMC4wLWJldGEuMilcbkQgLS0-fGdpdCBicmFuY2g6IGRldmVsb3B8IEUoZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgZWRpdCBlbWFpbCBhZGRyZXNzKVxuRSAtLT4gSChnaXQgY29tbWl0OiBFZGl0IGRvY3MgdG8gZXhwbGFpbiBlZGl0aW5nIGVtYWlsIGFkZHJlc3MpXG4iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGFyayJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9)](https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZmxvd2NoYXJ0IFREXG5cbkFbZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgdG8gZWRpdCBwcm9maWxlXSAtLT58Z2l0IGJyYW5jaDogZGV2ZWxvcCBhbmQgYmV0YXwgQihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4xKVxuXG5CIC0tPiBDKGdpdCBjb21taXQ6IEJ1ZyBmaXggZm9yIGVkaXRpbmcgcHJvZmlsZSlcbkMgLS0-IEQoRGV2ZWxvcG1lbnQgY29tbWl0OiA8YnI-IDEuMC4wLWJldGEuMilcbkQgLS0-fGdpdCBicmFuY2g6IGRldmVsb3B8IEUoZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgZWRpdCBlbWFpbCBhZGRyZXNzKVxuRSAtLT4gSChnaXQgY29tbWl0OiBFZGl0IGRvY3MgdG8gZXhwbGFpbiBlZGl0aW5nIGVtYWlsIGFkZHJlc3MpXG4iLCJtZXJtYWlkIjoie1xuICBcInRoZW1lXCI6IFwiZGFya1wiXG59IiwidXBkYXRlRWRpdG9yIjpmYWxzZSwiYXV0b1N5bmMiOnRydWUsInVwZGF0ZURpYWdyYW0iOmZhbHNlfQ)

The branch `develop` is still ahead of branch `beta`, but now all of the git commits from `beta` have been copied into `develop`. That's the intended behavior of this action! 

# Development 

This action is a [composite GitHub Action](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action) mostly relying on bash scripts to run commands. This means there is nothing for you to install to create a development environment on your computer. However, this also means that testing the action is more difficult. To test this action, we rely on running the action on GitHub Actions. See `.github/workflows/test-action.yml` for an example of how we test this action. 

All changes made to the code require making a pull request into `develop` branch with the title conforming to the [conventional commit format](https://www.conventionalcommits.org/).

# Deployment

Tags/releases are made automatically using [semantic-release](https://github.com/semantic-release/semantic-release) as long as our git commit messages are written in the [conventional commit format](https://www.conventionalcommits.org/). Just `git rebase ...` commits from `develop` into `alpha`, `beta`, or `main` to make a new deployment of the action. 


