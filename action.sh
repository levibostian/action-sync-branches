AHEAD="$1"
BEHIND="$2"

checkout_and_pull() {
    # if git switch unsuccessful, it's because the branch does not exist. exit 0 indicating that the action will simply ignore request. 
    if git switch $1; then
        echo "Successfully checked out $1"
    else 
        echo "Branch $1 does not exist on remote. Looks like there is nothing for me to sync."
        exit 0 
    fi
    git pull 
}

assert_rebase_successful() {
    # git log <branchX>..<branchY> gives you list of commits that are different between the two. If output empty, rebase was successful 
    if [[ $( git log $BEHIND..$AHEAD ) ]]; then 
        echo "Rebase not successful. There are commits that are in one of the branches that does not exist on the other."
        echo "You will need to fix this problem manually yourself by running git commands on your local computer and pushing your changes to the git repository."
        echo "I tried to run 'git rebase' commands for you without success. Perhaps you need to run 'git merge' commands?"
        exit 1
    else 
        echo "Rebase successful"
    fi 
}

checkout_and_pull $AHEAD 
checkout_and_pull $BEHIND

git rebase $AHEAD

assert_rebase_successful

git push 