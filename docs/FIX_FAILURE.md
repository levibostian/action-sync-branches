# Fix failure of the action

Did you try running this action and you got an error `You will need to fix this problem manually yourself...`? Did you try running this action and for some reason it encountered an error? This document is for you. When this action fails to succeed, you will need to manually run `git` commands on your computer to manually fix the problem. 

Before you get into fixing the problem, it's recommended that you [read the documentation on how this action works](/README.md#how-does-this-action-work). This will help you understand better the context of your project and what this action attempted to do. 

Ok, now let's get into it. 

# How to fix failures 

Let's say that you have a branch `beta` and contains commits that you want to copy over to `develop`:

[![diagram showing a git branch beta 3 commits ahead of a branch develop](https://mermaid.ink/img/eyJjb2RlIjoiZmxvd2NoYXJ0IFREXG5cbkFbZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgdG8gZWRpdCBwcm9maWxlXSAtLT58Z2l0IGJyYW5jaDogYmV0YXwgQihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4xKVxuXG5BIC0tPnxnaXQgYnJhbmNoOiBkZXZlbG9wfCBDKGdpdCBjb21taXQ6IENyZWF0ZSBmZWF0dXJlIGVkaXQgZW1haWwgYWRkcmVzcylcbkMgLS0-IEQoZ2l0IGNvbW1pdDogRWRpdCBkb2NzIHRvIGV4cGxhaW4gZWRpdGluZyBlbWFpbCBhZGRyZXNzKVxuXG5CIC0tPnxXZSBmb3VuZCBhIGJ1ZyF8IEUoZ2l0IGNvbW1pdDogQnVnIGZpeCBmb3IgZWRpdGluZyBwcm9maWxlKVxuRSAtLT4gRihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4yKSIsIm1lcm1haWQiOnsidGhlbWUiOiJkYXJrIn0sInVwZGF0ZUVkaXRvciI6ZmFsc2UsImF1dG9TeW5jIjp0cnVlLCJ1cGRhdGVEaWFncmFtIjpmYWxzZX0)](https://mermaid-js.github.io/mermaid-live-editor/edit/#eyJjb2RlIjoiZmxvd2NoYXJ0IFREXG5cbkFbZ2l0IGNvbW1pdDogQ3JlYXRlIGZlYXR1cmUgdG8gZWRpdCBwcm9maWxlXSAtLT58Z2l0IGJyYW5jaDogYmV0YXwgQihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4xKVxuXG5BIC0tPnxnaXQgYnJhbmNoOiBkZXZlbG9wfCBDKGdpdCBjb21taXQ6IENyZWF0ZSBmZWF0dXJlIGVkaXQgZW1haWwgYWRkcmVzcylcbkMgLS0-IEQoZ2l0IGNvbW1pdDogRWRpdCBkb2NzIHRvIGV4cGxhaW4gZWRpdGluZyBlbWFpbCBhZGRyZXNzKVxuXG5CIC0tPnxXZSBmb3VuZCBhIGJ1ZyF8IEUoZ2l0IGNvbW1pdDogQnVnIGZpeCBmb3IgZWRpdGluZyBwcm9maWxlKVxuRSAtLT4gRihEZXZlbG9wbWVudCBjb21taXQ6IDxicj4gMS4wLjAtYmV0YS4yKSIsIm1lcm1haWQiOiJ7XG4gIFwidGhlbWVcIjogXCJkYXJrXCJcbn0iLCJ1cGRhdGVFZGl0b3IiOmZhbHNlLCJhdXRvU3luYyI6dHJ1ZSwidXBkYXRlRGlhZ3JhbSI6ZmFsc2V9)

Notice how branch `beta` is now 3 commits ahead of `develop`. The 3 unique commits in `beta` all need to be in the `develop` branch. However, the 2 commits that `develop` has that `beta` does not have should not be copied over. Adding the ability to edit an email address will be deployed in a future release of our software.

In this example, the branch `beta` is *ahead* in your project while `develop` is behind since we want to copy commits from `beta` into `develop`. Branch `beta` is the *ahead branch* and `develop` is the *behind branch*. 

For all commands below in this document, replace `<behind>` with the branch that is behind and replace `<ahead>` with the branch that is ahead. If you are unsure what branch names to use, read the output from the GitHub Action when it failed. This action tries to be helpful by printing output such as `Checking out and pulling branches beta (ahead) and develop (behind) to prepare to sync` which tells you what branch is configured to be ahead and behind. 

On your computer, run these commands:

```
git fetch
git switch <ahead>
git pull
git switch <behind>
git pull
```

Make sure to replace `beta` with the branch that is *ahead* in your project and replace `develop` with the branch that is *behind* in your project. If you are unsure what branch names to use, read the output from the GitHub Action. This action tries to be helpful by printing output such as `Checking out and pulling branches beta (ahead) and develop (behind) to prepare to sync` which tells you what branch is configured to be ahead and behind. 

Now, run: 

```
git merge <ahead>
```

Now run:

```
git log <ahead>..<behind>
```

You should see only 1 commit in the output. It will be a merge commit and the git commit message should look something like this:
```
commit ea95a65ec1c6fa005ca1750b3e2fca0cfebbf620 (HEAD -> develop)
Merge: 1d0847f 6423cfa
Date:   Sat Jan 22 14:05:20 2022 -0600

    Merge branch 'beta'
```

Lastly, push the behind branch:
```
git push
```

Done! 

Now, the next time that this action runs again, it should be successful because you manually fixed the issue here. 
