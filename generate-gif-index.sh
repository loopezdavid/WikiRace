#!/bin/bash
# Run this from the wikirace/ folder after adding GIFs
for folder in gifs/winner gifs/loser; do
    files=$(ls "$folder"/*.gif 2>/dev/null | xargs -I{} basename {} | sort | python3 -c "import sys,json; print(json.dumps([l.strip() for l in sys.stdin]))")
    echo "$files" > "$folder/index.json"
    count=$(echo "$files" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))")
    echo "Created $folder/index.json with $count GIFs"
done
echo "Done! Reload the game."
