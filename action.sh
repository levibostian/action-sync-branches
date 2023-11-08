#!/bin/sh

set -e

AHEAD="$1"
BEHIND="$2"

GREEN="\e[32m"
BLUE="\e[34m"
NO_COLOR="\e[0m"
RED="\e[31m"
YELLOW="\e[33m"

log() {
    echo -e "[action-sync-branches] $1"
}

start_log_group() {
    echo -e "\n"
    echo -e "::group::$1"
}

end_log_group() {
    echo "::endgroup::"
}

log_then_exit() {
    # end log group so error message shows up not in a group. 
    end_log_group

    log "$2"

    exit $1
}

checkout_and_pull() {
    log "${NO_COLOR}Checking out branch $1"

    # if git switch unsuccessful, it's because the branch does not exist. exit 0 indicating that the action will simply ignore request. 
    if git switch $1; then
        log "${GREEN}Successfully checked out $1"
    else 
        ERR_MESSAGE="${YELLOW}Branch $1 does not exist on remote. Looks like there is nothing for me to sync."
        
        log_then_exit 0 "$ERR_MESSAGE" 
    fi

    log "${GREEN}Successful checkout of branch $1. Pulling branch now."
    git pull 
}

assert_merge_successful() {
    # git log <branchX>..<branchY> gives you list of commits that are different between the two. If output empty, merge was successful 
    if [[ $( git log $BEHIND..$AHEAD ) ]]; then 
        log_then_exit 1 "${RED}There are commits that are in the $BEHIND branch that's not in $AHEAD after sync attempt. Automatically syncing the two branches has failed. You will need to manually fix the problem. Learn how: https://github.com/levibostian/action-sync-branches/blob/develop/docs/FIX_FAILURE.md"
    else 
        log "${GREEN}Merge successful"
    fi 
}


start_log_group "${BLUE}Checking out and pulling branches $AHEAD (ahead) and $BEHIND (behind) to prepare to sync"
checkout_and_pull $AHEAD 
checkout_and_pull $BEHIND
end_log_group

start_log_group "${BLUE}Merging $AHEAD commits into $BEHIND so the two branches contain the same commits as one another."
if git merge --ff "$AHEAD" --message "Merge branch '$AHEAD' into $BEHIND"; then
    log "${GREEN}Merge successful" 
else 
    log_then_exit 1 "${RED}Merge not successful. Maybe because of a merge conflict? Automatically syncing the two branches has failed. You will need to manually fix the problem. Learn how: https://github.com/levibostian/action-sync-branches/blob/develop/docs/FIX_FAILURE.md"
fi 
end_log_group

start_log_group "${BLUE}Checking if merge was successful..."
assert_merge_successful
end_log_group

start_log_group "${BLUE}Sync operation successful. Pushing the changes..."
git push 
end_log_group
