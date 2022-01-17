# if git switch unsuccessful, it's because the branch does not exist. exit 0 indicating that the action will simply ignore request. 
git switch ${{ inputs.ahead }} || exit 0
git pull 
git switch ${{ inputs.behind }} || exit 0
git pull 

git rebase ${{ inputs.ahead }}

# git log <branchX>..<branchY> gives you list of commits that are different between the two. If output empty, rebase was successful 
if [[ $( git log ${{ inputs.behind }}..${{ inputs.ahead }} ) ]]; then 
    echo "Rebase not successful. Commits not the same between the two branches"
    exit 1
else 
    echo "Rebase successful"
fi 

git push 