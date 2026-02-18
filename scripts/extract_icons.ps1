
$IconMap = @{
    "media__1771373049464.png" = "trailer-number-plate.png"
    "media__1771373056097.png" = "trailer-body.png"
    "media__1771373073985.png" = "trailer-doors.png"
    "media__1771373118307.png" = "trailer-u-bolts.png"
    "media__1771373217975.png" = "trailer-mud-flaps.png"
    "media__1771373238939.png" = "trailer-drawbar.png"
    "media__1771373243468.png" = "trailer-safety-chain.png"
    "media__1771373248013.png" = "trailer-jockey-wheel.png"
    "media__1771373252112.png" = "trailer-land-gear.png"
}

$ArtifactsDir = "C:\Users\mmanquele\.gemini\antigravity\brain\ad5e3634-a159-4105-9bf0-9fca4b2a59c7"
$TargetDir = "c:\Users\mmanquele\OneDrive - SANSA\DSP forms- PDF\userformwithadmin\public\images"

Add-Type -AssemblyName System.Drawing

if (-not (Test-Path -Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir | Out-Null
}

foreach ($key in $IconMap.Keys) {
    $sourcePath = Join-Path $ArtifactsDir $key
    $targetPath = Join-Path $TargetDir $IconMap[$key]

    if (Test-Path $sourcePath) {
        try {
            $image = [System.Drawing.Image]::FromFile($sourcePath)
            $width = $image.Width
            $height = $image.Height
            $cropWidth = 160
            
            $x = $width - $cropWidth
            if ($x -lt 0) { $x = 0 }
            
            $rect = New-Object System.Drawing.Rectangle $x, 0, $cropWidth, $height
            $croppedImage = New-Object System.Drawing.Bitmap $cropWidth, $height
            $graphics = [System.Drawing.Graphics]::FromImage($croppedImage)
            
            # Set high quality
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            
            $destRect = New-Object System.Drawing.Rectangle 0, 0, $cropWidth, $height
            $graphics.DrawImage($image, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
            
            $croppedImage.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
            
            Write-Host "Generated $targetPath"
            
            $graphics.Dispose()
            $croppedImage.Dispose()
            $image.Dispose()
        }
        catch {
            Write-Host "Error processing $key : $_"
        }
    }
    else {
        Write-Host "Source not found: $sourcePath"
    }
}
