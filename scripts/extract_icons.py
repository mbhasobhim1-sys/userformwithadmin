import os
from PIL import Image

# Map source filename to target filename
ICON_MAP = {
    "media__1771373049464.png": "trailer-number-plate.png",
    "media__1771373056097.png": "trailer-body.png",
    "media__1771373073985.png": "trailer-doors.png",
    "media__1771373118307.png": "trailer-u-bolts.png",
    "media__1771373217975.png": "trailer-mud-flaps.png",
    "media__1771373238939.png": "trailer-drawbar.png",
    "media__1771373243468.png": "trailer-safety-chain.png",
    "media__1771373248013.png": "trailer-jockey-wheel.png",
    "media__1771373252112.png": "trailer-land-gear.png" # Should include "Wooden Stands Not Permitted" text if part of icon or just the gear?
}

ARTIFACTS_DIR = r"C:\Users\mmanquele\.gemini\antigravity\brain\ad5e3634-a159-4105-9bf0-9fca4b2a59c7"
TARGET_DIR = r"c:\Users\mmanquele\OneDrive - SANSA\DSP forms- PDF\userformwithadmin\public\images"

def extract_icons():
    if not os.path.exists(TARGET_DIR):
        os.makedirs(TARGET_DIR)
        
    for source_file, target_file in ICON_MAP.items():
        source_path = os.path.join(ARTIFACTS_DIR, source_file)
        target_path = os.path.join(TARGET_DIR, target_file)
        
        if not os.path.exists(source_path):
            print(f"Skipping {source_file}: Not found")
            continue
            
        try:
            img = Image.open(source_path)
            width, height = img.size
            
            # Crop logic: The icon is on the far right. 
            # We'll estimate the crop box. 
            # Looking at the screenshots, the icon is roughly the last 150px.
            # But the "Land Gear" text might be wider. 
            # A safe bet is to verify what's on the right. 
            # For now, let's take the right-most 160 pixels.
            
            CROP_WIDTH = 160
            left = width - CROP_WIDTH
            if left < 0: left = 0
            
            # Crop: (left, top, right, bottom)
            cropped_img = img.crop((left, 0, width, height))
            
            # Optional: Trim whitespace?
            # simple bbox trim
            # bg = Image.new(img.mode, img.size, img.getpixel((0,0)))
            # diff = ImageChops.difference(img, bg)
            # diff = ImageChops.add(diff, diff, 2.0, -100)
            # bbox = diff.getbbox()
            # if bbox:
            #    cropped_img = img.crop(bbox)
            
            cropped_img.save(target_path)
            print(f"Generated {target_file}")
            
        except Exception as e:
            print(f"Error processing {source_file}: {e}")

if __name__ == "__main__":
    extract_icons()
