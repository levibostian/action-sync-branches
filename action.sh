AHEAD="$1"
BEHIND="$2"

GREEN="\e[31m"
BLUE="\e[34m"
NO_COLOR="\e[0m"
RED="\e[31m"
YELLOW="\e[33m"

log() {
    echo -e "[action-sync-branches] $1"
}

end_log_group() {
    echo "::endgroup::"
}

checkout_and_pull() {
    log "${NO_COLOR}Checking out branch $1"

    # if git switch unsuccessful, it's because the branch does not exist. exit 0 indicating that the action will simply ignore request. 
    if git switch $1; then
        log "${GREEN}Successfully checked out $1"
    else 
        log "${YELLOW}Branch $1 does not exist on remote. Looks like there is nothing for me to sync."
        exit 0 
    fi

    log "${GREEN}Successful checkout of branch $1. Pulling branch now."
    git pull 
}

assert_rebase_successful() {
    # git log <branchX>..<branchY> gives you list of commits that are different between the two. If output empty, rebase was successful 
    if [[ $( git log $BEHIND..$AHEAD ) ]]; then 
        log "${RED}Rebase not successful. There are commits that are in one of the branches that does not exist on the other."
        log "${RED}You will need to fix this problem manually yourself by running git commands on your local computer and pushing your changes to the git repository."
        log "${RED}I tried to run 'git rebase' commands for you without success. Perhaps you need to run 'git merge' commands?"
        exit 1
    else 
        log "${GREEN}Rebase successful"
    fi 
}


log "::group::${BLUE}Checking out and pulling branches $AHEAD and $BEHIND to prepare to sync"
checkout_and_pull $AHEAD 
checkout_and_pull $BEHIND
end_log_group

echo -e "\n"
log "::group::${BLUE}Rebasing $AHEAD commits into $BEHIND so the two branches contain the same commits as one another."
git rebase $AHEAD
end_log_group

echo -e "\n"
log "::group::${BLUE}Checking if rebase was successful..."
assert_rebase_successful
end_log_group

echo -e "\n"
log "::group::${BLUE}Sync operation successful. Pushing the changes..."
git push 
end_log_group
