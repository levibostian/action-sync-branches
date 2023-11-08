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
    runs-on: ubuntu-latest
    permissions:
      content: write # needed to push commits to git repository
    steps:
      - name: Copy commits in beta to develop branch
        uses: levibostian/action-sync-branches@v1
        with:
          behind: develop
          ahead: beta
```

The action comes with the following inputs:
* `behind` (required) - this is the branch that you want to copy commits *into*. This branch is missing commits that are in *ahead* branch. 
* `ahead` (required) - the branch that has commits in it that are not in the `behind` branch that you want to copy over. 
* `githubToken` (optional, defaults to `github.token`) - a [GitHub personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) for a GitHub account that has `push` access to the repository. 

> Note: If either `behind` or `ahead` branches do not exist in the repo when the action runs, the action will simply stop running and ignore the request to sync. 
> Note: This action copies over commits in one direction. Copies commits from the `ahead` branch into the `behind` branch. If you have commits in `behind` that need to be copied into `ahead`, then you need to run this action twice where you set `behind: X, ahead: Y` and `behind: Y, ahead: X`. 

**Tip: If you run this action and the action failed to sync the branches, it might require you to manually fix the issue. See [the fix failure doc](docs/FIX_FAILURE.md) to learn how to manually fix failures when this action fails to succeed.**

# How does this action work? 

TL;DR `git merge --ff "$AHEAD" --message "Merge branch '$AHEAD' into $BEHIND"`

Let's say that you have a branch `beta` and `develop`. `beta` is a branch you use for the latest beta deployment of your project. `develop` is the default branch where all new features and fixes go into. 

If we look at the git history of the 2 branches, it might look like this:

[![diagram showing a git branch beta 3 commits ahead of a branch develop. Develop has no commits in it that beta does not have.](https://mermaid.ink/img/eyJjb2RlIjoiZmxvd2NoYXJ0IFREXG5cbkFbZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgdG8gZWRpdCBwcm9maWxlXSAtLT58Z2l0IGJyYW5jaDogYmV0YXwgQihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4xKVxuXG5BIC0tPnxnaXQgYnJhbmNoOiBkZXZlbG9wfCBDKG5vIG5ldyBjb21taXRzIGluIHRoaXMgYnJhbmNoKVxuXG5CIC0tPnxXZSBmb3VuZCBhIGJ1ZyF8IEUoZ2l0IGNvbW1pdDogQnVnIGZpeCBmb3IgZWRpdGluZyBwcm9maWxlKVxuRSAtLT4gRihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4yKSIsIm1lcm1haWQiOnsidGhlbWUiOiJkYXJrIn0sInVwZGF0ZUVkaXRvciI6ZmFsc2UsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjpmYWxzZX0)](https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZmxvd2NoYXJ0IFREXG5cbkFbZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgdG8gZWRpdCBwcm9maWxlXSAtLT58Z2l0IGJyYW5jaDogYmV0YXwgQihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4xKVxuXG5BIC0tPnxnaXQgYnJhbmNoOiBkZXZlbG9wfCBDKG5vIG5ldyBjb21taXRzIGluIHRoaXMgYnJhbmNoKVxuXG5CIC0tPnxXZSBmb3VuZCBhIGJ1ZyF8IEUoZ2l0IGNvbW1pdDogQnVnIGZpeCBmb3IgZWRpdGluZyBwcm9maWxlKVxuRSAtLT4gRihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4yKSIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkYXJrXCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9)

Notice how branch `beta` is now 3 commits ahead of `develop`. `develop` does not have any commits in it that are not in `beta`. 

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
commit 11111

    create feature to edit profile
```

Notice how all of the git commit hashes in the 2 logs are all different *except* for the hash `11111`. This hash is the same since both of these branches originate from 1 commit where a feature was added to edit a profile. 

When you run `git merge`, sometimes a *merge commit* is made. A merge commit is a new commit that is made when a merge takes place. This action tries to avoid making merge commits because it can make your git commit history a little less clean. 

In this scenario between the `develop` and `beta` branch, a merge commit will not be made. After merge, the branches will look like this:

[![diagram showing that the develop and beta branch have identical git commit history with no merge commit made](https://mermaid.ink/img/eyJjb2RlIjoiZmxvd2NoYXJ0IFREXG5cbkFbZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgdG8gZWRpdCBwcm9maWxlXSAtLT58Z2l0IGJyYW5jaDogZGV2ZWxvcCBhbmQgYmV0YXwgQihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4xKVxuXG5CIC0tPiBDKGdpdCBjb21taXQ6IEJ1ZyBmaXggZm9yIGVkaXRpbmcgcHJvZmlsZSlcbkMgLS0-IEQoRGV2ZWxvcG1lbnQgY29tbWl0OiA8YnI-IDEuMC4wLWJldGEuMilcblxuIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRhcmsifSwidXBkYXRlRWRpdG9yIjpmYWxzZSwiYXV0b1N5bmMiOnRydWUsInVwZGF0ZURpYWdyYW0iOmZhbHNlfQ)](https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZmxvd2NoYXJ0IFREXG5cbkFbZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgdG8gZWRpdCBwcm9maWxlXSAtLT58Z2l0IGJyYW5jaDogZGV2ZWxvcCBhbmQgYmV0YXwgQihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4xKVxuXG5CIC0tPiBDKGdpdCBjb21taXQ6IEJ1ZyBmaXggZm9yIGVkaXRpbmcgcHJvZmlsZSlcbkMgLS0-IEQoRGV2ZWxvcG1lbnQgY29tbWl0OiA8YnI-IDEuMC4wLWJldGEuMilcblxuIiwibWVybWFpZCI6IntcbiAgXCJ0aGVtZVwiOiBcImRhcmtcIlxufSIsInVwZGF0ZUVkaXRvciI6ZmFsc2UsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjpmYWxzZX0)

They are identical in their git commit history! 

Now, let's take this scenario where the branch `develop` does have commits that `beta` does not:

[![diagram showing a git branch beta 3 commits ahead of a branch develop and develop has 2 commits that beta does not](https://mermaid.ink/img/eyJjb2RlIjoiZmxvd2NoYXJ0IFREXG5cbkFbZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgdG8gZWRpdCBwcm9maWxlXSAtLT58Z2l0IGJyYW5jaDogYmV0YXwgQihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4xKVxuXG5BIC0tPnxnaXQgYnJhbmNoOiBkZXZlbG9wfCBDKGdpdCBjb21taXQ6IENyZWF0ZSBmZWF0dXJlIGVkaXQgZW1haWwgYWRkcmVzcylcbkMgLS0-IEQoZ2l0IGNvbW1pdDogRWRpdCBkb2NzIHRvIGV4cGxhaW4gZWRpdGluZyBlbWFpbCBhZGRyZXNzKVxuXG5CIC0tPnxXZSBmb3VuZCBhIGJ1ZyF8IEUoZ2l0IGNvbW1pdDogQnVnIGZpeCBmb3IgZWRpdGluZyBwcm9maWxlKVxuRSAtLT4gRihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4yKSIsIm1lcm1haWQiOnsidGhlbWUiOiJkYXJrIn0sInVwZGF0ZUVkaXRvciI6ZmFsc2UsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjpmYWxzZX0)](https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZmxvd2NoYXJ0IFREXG5cbkFbZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgdG8gZWRpdCBwcm9maWxlXSAtLT58Z2l0IGJyYW5jaDogYmV0YXwgQihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4xKVxuXG5BIC0tPnxnaXQgYnJhbmNoOiBkZXZlbG9wfCBDKGdpdCBjb21taXQ6IENyZWF0ZSBmZWF0dXJlIGVkaXQgZW1haWwgYWRkcmVzcylcbkMgLS0-IEQoZ2l0IGNvbW1pdDogRWRpdCBkb2NzIHRvIGV4cGxhaW4gZWRpdGluZyBlbWFpbCBhZGRyZXNzKVxuXG5CIC0tPnxXZSBmb3VuZCBhIGJ1ZyF8IEUoZ2l0IGNvbW1pdDogQnVnIGZpeCBmb3IgZWRpdGluZyBwcm9maWxlKVxuRSAtLT4gRihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4yKSIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkYXJrXCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9)

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
commit 77777

    Merge branch 'beta' into develop

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

[![diagram showing branch develop have all of the commits from beta including a merge commit](https://mermaid.ink/img/eyJjb2RlIjoiZmxvd2NoYXJ0IFREXG5cbkFbZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgdG8gZWRpdCBwcm9maWxlXSAtLT58Z2l0IGJyYW5jaDogZGV2ZWxvcCBhbmQgYmV0YXwgQihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4xKVxuXG5CIC0tPiBDKGdpdCBjb21taXQ6IEJ1ZyBmaXggZm9yIGVkaXRpbmcgcHJvZmlsZSlcbkMgLS0-IEQoRGV2ZWxvcG1lbnQgY29tbWl0OiA8YnI-IDEuMC4wLWJldGEuMilcbkQgLS0-fGdpdCBicmFuY2g6IGRldmVsb3B8IEUoZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgZWRpdCBlbWFpbCBhZGRyZXNzKVxuRSAtLT4gSChnaXQgY29tbWl0OiBFZGl0IGRvY3MgdG8gZXhwbGFpbiBlZGl0aW5nIGVtYWlsIGFkZHJlc3MpXG5IIC0tPiBJKGdpdCBjb21taXQ6IE1lcmdlIGJyYW5jaCAnYmV0YScgaW50byBkZXZlbG9wKSIsIm1lcm1haWQiOnsidGhlbWUiOiJkYXJrIn0sInVwZGF0ZUVkaXRvciI6ZmFsc2UsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjpmYWxzZX0)](https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZmxvd2NoYXJ0IFREXG5cbkFbZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgdG8gZWRpdCBwcm9maWxlXSAtLT58Z2l0IGJyYW5jaDogZGV2ZWxvcCBhbmQgYmV0YXwgQihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4xKVxuXG5CIC0tPiBDKGdpdCBjb21taXQ6IEJ1ZyBmaXggZm9yIGVkaXRpbmcgcHJvZmlsZSlcbkMgLS0-IEQoRGV2ZWxvcG1lbnQgY29tbWl0OiA8YnI-IDEuMC4wLWJldGEuMilcbkQgLS0-fGdpdCBicmFuY2g6IGRldmVsb3B8IEUoZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgZWRpdCBlbWFpbCBhZGRyZXNzKVxuRSAtLT4gSChnaXQgY29tbWl0OiBFZGl0IGRvY3MgdG8gZXhwbGFpbiBlZGl0aW5nIGVtYWlsIGFkZHJlc3MpXG5IIC0tPiBJKGdpdCBjb21taXQ6IE1lcmdlIGJyYW5jaCAnYmV0YScgaW50byBkZXZlbG9wKSIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkYXJrXCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9)

The branch `develop` is still ahead of branch `beta`, but now all of the git commits from `beta` have been copied into `develop` as well as a merge commit being made. That's the intended behavior of this action! 

# Development 

This action is a [composite GitHub Action](https://docs.github.com/en/actions/creating-actions/creating-a-composite-action) mostly relying on bash scripts to run commands. This means there is nothing for you to install to create a development environment on your computer. However, this also means that testing the action is more difficult. To test this action, we rely on running the action on GitHub Actions. See `.github/workflows/test-action.yml` for an example of how we test this action. 

All changes made to the code require making a pull request into `develop` branch with the title conforming to the [conventional commit format](https://www.conventionalcommits.org/).

# Deployment

Tags/releases are made automatically using [semantic-release](https://github.com/semantic-release/semantic-release) as long as our git commit messages are written in the [conventional commit format](https://www.conventionalcommits.org/). Just `git rebase ...` or `git merge` commits from `develop` into `alpha`, `beta`, or `main` to make a new deployment of the action. 


