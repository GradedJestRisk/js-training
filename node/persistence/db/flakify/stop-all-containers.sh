#!/usr/bin/env bash
(if [[ $(docker ps -q | wc -l) != 0 ]]; then echo "stopping running containers"; docker kill $(docker ps --quiet); else echo "no running containers"; fi;) && echo "removing stopped containers (if any)" && docker container prune --force
