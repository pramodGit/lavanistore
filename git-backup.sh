#!/bin/bash

cd /root/LavaniDATA/Development

git add .

if ! git diff --cached --quiet; then
    git commit -m "Auto backup $(date)"
    git push origin main
fi
