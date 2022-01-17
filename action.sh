AHEAD="$1"
BEHIND="$2"

# if git switch unsuccessful, it's because the branch does not exist. exit 0 indicating that the action will simply ignore request. 
git switch $AHEAD || exit 0
git pull 
git switch $BEHIND || exit 0
git pull 

git rebase $AHEAD

# git log <branchX>..<branchY> gives you list of commits that are different between the two. If output empty, rebase was successful 
if [[ $( git log $BEHIND..$AHEAD ) ]]; then 
    echo "Rebase not successful. Commits not the same between the two branches"
    exit 1
else 
    echo "Rebase successful"
fi 

git push 