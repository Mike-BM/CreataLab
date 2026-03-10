Add-Type -AssemblyName System.Drawing
$img = new-object System.Drawing.Bitmap "c:\Users\brian\Desktop\CreataLab\public\Logo.png"
$colors = @{}
for($x=0; $x -lt $img.Width; $x+=50){
    for($y=0; $y -lt $img.Height; $y+=50){
        $p = $img.GetPixel($x,$y)
        if($p.A -gt 50 -and -not ($p.R -gt 240 -and $p.G -gt 240 -and $p.B -gt 240) -and -not ($p.R -lt 15 -and $p.G -lt 15 -and $p.B -lt 15)){
            $rgb = "$($p.R),$($p.G),$($p.B)"
            if($colors.ContainsKey($rgb)){ $colors[$rgb]++ }
            else { $colors[$rgb] = 1 }
        }
    }
}
$colors.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 5
