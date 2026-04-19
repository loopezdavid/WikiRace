# Run this script from the wikirace/ folder after adding GIFs
# It creates index.json in each gifs subfolder for instant loading

foreach ($folder in @("gifs/winner", "gifs/loser")) {
    $files = Get-ChildItem -Path $folder -Filter "*.gif" | Sort-Object Name | Select-Object -ExpandProperty Name
    $json = $files | ConvertTo-Json -Compress
    if ($files.Count -eq 1) { $json = '["' + $files[0] + '"]' }
    if ($files.Count -eq 0) { $json = '[]' }
    Set-Content -Path "$folder/index.json" -Value $json -Encoding UTF8
    Write-Host "Created $folder/index.json with $($files.Count) GIFs"
}
Write-Host "Done! Reload the game."
