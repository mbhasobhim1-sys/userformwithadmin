$names = @(
  'excavator-loader-fire-safety.png',
  'excavator-loader-operator-environment.png',
  'excavator-loader-fluids-filters.png',
  'excavator-loader-electrical.png',
  'excavator-loader-undercarriage-attachments.png',
  'excavator-loader-exhaust-instruments.png',
  'excavator-loader-brakes-steering.png',
  'excavator-loader-wheels-tyres.png',
  'excavator-loader-lubrication-leaks.png',
  'excavator-loader-loader-quick-hitch.png'
)

Write-Output "Fetching DocuWare page..."
$p = Invoke-WebRequest -UseBasicParsing 'https://dsp.docuware.cloud/docuware/formsweb/ringomode-excavator-loader-pre-shift-inspection'
$html = $p.Content
$matches = [regex]::Matches($html,'data:image/png;base64,([A-Za-z0-9+/=]+)')
Write-Output "Found $($matches.Count) base64 image matches on the DocuWare page"

for($i=0; $i -lt $names.Count; $i++){
  if($i -lt $matches.Count){
    $b64 = $matches[$i].Groups[1].Value
    $out = Join-Path $PSScriptRoot "..\public\images\$($names[$i])"
    [IO.File]::WriteAllBytes($out, [Convert]::FromBase64String($b64))
    Write-Output "Wrote $out"
  } else {
    Write-Output "No base64 match available for index $i ($($names[$i]))"
  }
}
