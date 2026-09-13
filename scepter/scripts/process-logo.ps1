
Add-Type -AssemblyName System.Drawing

$srcPath = Resolve-Path "public/brand/logo-original.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# Find bounding box of non-white pixels (where R < 240 or G < 240 or B < 240)
$minX = $bmp.Width
$maxX = 0
$minY = $bmp.Height
$maxY = 0

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $pixel = $bmp.GetPixel($x, $y)
        if ($pixel.R -lt 240 -or $pixel.G -lt 240 -or $pixel.B -lt 240) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Output "BBox: X=[$minX, $maxX], Y=[$minY, $maxY]"

# Add small padding around cropped logo
$pad = 12
$cropX = [Math]::Max(0, $minX - $pad)
$cropY = [Math]::Max(0, $minY - $pad)
$cropW = [Math]::Min($bmp.Width - $cropX, ($maxX - $minX) + ($pad * 2))
$cropH = [Math]::Min($bmp.Height - $cropY, ($maxY - $minY) + ($pad * 2))

# 1. Output cropped light logo (transparent background)
$outLight = New-Object System.Drawing.Bitmap $cropW, $cropH
$outDark = New-Object System.Drawing.Bitmap $cropW, $cropH

for ($y = 0; $y -lt $cropH; $y++) {
    for ($x = 0; $x -lt $cropW; $x++) {
        $origX = $cropX + $x
        $origY = $cropY + $y
        $pixel = $bmp.GetPixel($origX, $origY)
        
        # Calculate brightness / whiteness
        # If nearly white (R > 240 and G > 240 and B > 240) -> transparent
        if ($pixel.R -gt 240 -and $pixel.G -gt 240 -and $pixel.B -gt 240) {
            $outLight.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            $outDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
            # Check if this pixel belongs to the orange trident / accent line
            # Orange has high R, moderate G, low B (e.g. R > 180, B < 100, R > G + 40)
            $isOrange = ($pixel.R -gt 150 -and $pixel.B -lt 110 -and ($pixel.R - $pixel.B) -gt 60)
            
            # For light background: keep original colors
            $outLight.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $pixel.R, $pixel.G, $pixel.B))
            
            # For dark background: if orange, keep orange; if navy/dark, turn white (255, 255, 255)
            if ($isOrange) {
                $outDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $pixel.R, $pixel.G, $pixel.B))
            } else {
                # Smooth alpha based on how dark it was
                $outDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, 255, 255, 255))
            }
        }
    }
}

$outLight.Save("public/brand/logo-light.png", [System.Drawing.Imaging.ImageFormat]::Png)
$outDark.Save("public/brand/logo-dark.png", [System.Drawing.Imaging.ImageFormat]::Png)
Write-Output "Saved logo-light.png and logo-dark.png"

# 2. Extract mark / trident for favicon
# Mark is on the left side: from minX up to where the 'S' begins
# Let's find where 'S' starts: 'S' is navy (R < 50, G < 50, B < 70)
$markMaxX = $minX + 80
for ($x = $minX; $x -lt ($minX + 160); $x++) {
    for ($y = $minY; $y -lt $maxY; $y++) {
        $p = $bmp.GetPixel($x, $y)
        # Scepter text starts with dark navy 'S'
        if ($p.R -lt 60 -and $p.G -lt 60 -and $p.B -gt 20 -and $p.B -lt 80) {
            $markMaxX = $x - 5
            break
        }
    }
    if ($markMaxX -lt ($x - 4)) { break }
}

$markW = ($markMaxX - $minX) + ($pad * 2)
$markH = ($maxY - $minY) + ($pad * 2)
$markBmp = New-Object System.Drawing.Bitmap $markW, $markH

for ($y = 0; $y -lt $markH; $y++) {
    for ($x = 0; $x -lt $markW; $x++) {
        $origX = $cropX + $x
        $origY = $cropY + $y
        if ($origX -lt $bmp.Width -and $origY -lt $bmp.Height) {
            $pixel = $bmp.GetPixel($origX, $origY)
            if ($pixel.R -gt 240 -and $pixel.G -gt 240 -and $pixel.B -gt 240) {
                $markBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } else {
                $markBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $pixel.R, $pixel.G, $pixel.B))
            }
        }
    }
}

# Square icon for favicon / app icon
$size = [Math]::Max($markW, $markH)
$sqFavicon = New-Object System.Drawing.Bitmap $size, $size
$g = [System.Drawing.Graphics]::FromImage($sqFavicon)
$g.Clear([System.Drawing.Color]::Transparent)
$offsetX = ($size - $markW) / 2
$offsetY = ($size - $markH) / 2
$g.DrawImage($markBmp, $offsetX, $offsetY, $markW, $markH)
$g.Dispose()

$sqFavicon.Save("public/brand/mark.png", [System.Drawing.Imaging.ImageFormat]::Png)
$sqFavicon.Save("app/icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$sqFavicon.Save("app/favicon.ico", [System.Drawing.Imaging.ImageFormat]::Icon)
Write-Output "Saved mark.png, app/icon.png, app/favicon.ico"

$bmp.Dispose()
$outLight.Dispose()
$outDark.Dispose()
$markBmp.Dispose()
$sqFavicon.Dispose()
