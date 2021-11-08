#!/usr/bin/env bash
echo "level-one.sh parameters"
echo $@

./chaining/first-child.sh $@
./chaining/second-child.sh $@
