# tapstagram
Tapstagram Project 

Deploy on git pages: https://tapstagram.github.io/tapstagram/

git init
git add .
git branch -M main
git commit -m "Initial clean Tapstagram repository"
git remote add origin
git push 

## git useful commands
git rm -r --cached 
git rm -r --cached node_modules
git rm -r --cached dist
git rm -r --cached .DS_Store
git rm -r --cached .env
git rm -r --cached .idea

git add -A
git commit -m "remove node_modules and dist and .DS_Store and .env and .idea"
git push -u origin main --force

git remote add origin https://github.com/MiqayaMahmood/tapstagram.git
git push -u origin main --force

git remote add origin https://github.com/MiqayaMahmood/tapstagram.git
git push -u origin main --force

buid the back end (api)
PS E:\Miqaya\tapstagram\apps\api> npm run build


