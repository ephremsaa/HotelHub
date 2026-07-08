export FILTER_BRANCH_SQUELCH_WARNING=1
git filter-branch -f --env-filter '
if [ "$GIT_AUTHOR_NAME" = "Your Name" ]; then
    export GIT_AUTHOR_NAME="ephremsaa"
    export GIT_AUTHOR_EMAIL="ephremsahle7@gmail.com"
fi
if [ "$GIT_COMMITTER_NAME" = "Your Name" ]; then
    export GIT_COMMITTER_NAME="ephremsaa"
    export GIT_COMMITTER_EMAIL="ephremsahle7@gmail.com"
fi
' -- --all
