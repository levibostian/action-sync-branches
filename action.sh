AHEAD="$1"
BEHIND="$2"

# if git switch unsuccessful, it's because the branch does not exist. exit 0 indicating that the action will simply ignore request. 
if [ $(git switch $AHEAD) -ne 0 ]; then
    echo "Branch $AHEAD does not exist on remote. Looks like there is nothing for me to sync."
    exit 0 
fi
git pull 

if [ $(git switch $BEHIND) -ne 0 ]; then
    echo "Branch $BEHIND does not exist on remote. Looks like there is nothing for me to sync."
    exit 0 
fi
git pull 

git rebase $AHEAD

# git log <branchX>..<branchY> gives you list of commits that are different between the two. If output empty, rebase was successful 
if [[ $( git log $BEHIND..$AHEAD ) ]]; then 
    echo "Rebase not successful. There are commits that are in one of the branches that does not exist on the other."
    echo "You will need to fix this problem manually yourself by running git commands on your local computer and pushing your changes to the git repository."
    echo "I tried to run 'git rebase' commands for you without success. Perhaps you need to run 'git merge' commands?"
    exit 1
else 
    echo "Rebase successful"
fi 

git push 