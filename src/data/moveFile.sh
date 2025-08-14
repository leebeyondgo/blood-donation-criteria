    1 $basePath = "D:\Files\Develop\Github Repository\blood-donation-criteria\src\data"
    2 $categories = @("disease", "medication", "vaccination", "procedure", "etc")
    3
    4 foreach ($category in $categories) {
    5     $sourceFile = $basePath + "\new_" + $category + ".json"
    6     $destinationFile = $basePath + "\new_data\" + $category + ".json"
    7
    8     # Ensure destination file exists and is a valid JSON array
    9     if (-not (Test-Path $destinationFile)) {
   10         Set-Content $destinationFile "[]"
   11     }
   12
   13     # Read content from source and destination
   14     $sourceContent = Get-Content $sourceFile | Out-String
   15     $destinationContent = Get-Content $destinationFile | Out-String
   16
   17     # Convert to JSON objects (handle empty files)
   18     if ($sourceContent -ne "" -and $sourceContent -ne "[]") {
   19         $sourceJson = $sourceContent | ConvertFrom-Json
   20     } else {
   21         $sourceJson = @()
   22     }
   23
   24     if ($destinationContent -ne "" -and $destinationContent -ne "[]") {
   25         $destinationJson = $destinationContent | ConvertFrom-Json
   26     } else {
   27         $destinationJson = @()
   28     }
   29
   30     # Concatenate arrays
   31     $combinedJson = $destinationJson + $sourceJson
   32
   33     # Convert back to JSON string and write to destination
   34     $combinedJson | ConvertTo-Json -Depth 100 | Set-Content $destinationFile
   35
   36     # Clear the source file
   37     Set-Content $sourceFile -Value "[]"
   38 }