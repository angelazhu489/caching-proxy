#!/bin/zsh
# caching-proxy --port <number> --origin <url>
# caching-proxy --clear-cache

# echo $1 $2 $3 $4
echo 1: $1 2: $2 3: $3 4: $4 5: $5

# for X in 1 2 3 4 5
# do
if [[ $1 = "--port" ]]; then
  npm run start $2 $4
elif [[ $1 = "--clear-cache" ]]; then
  npm run start

else
  echo "caching-proxy --port <number> --origin <url>"
  echo "caching-proxy --clear-cache"
fi
# done

# echo $?
# ls sdkjfnejlnfdlkn
# echo $?