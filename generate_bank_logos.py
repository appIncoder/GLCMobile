#!/usr/bin/env python3
"""Generate banking app logos"""
from PIL import Image, ImageDraw, ImageFont
import os

# Create logos directory
logos_dir = "src/assets/logos"
os.makedirs(logos_dir, exist_ok=True)

# Define banks with their colors
banks = [
    {"name": "Bancontact", "bg_color": "#003DA5", "text_color": "#FFFFFF", "filename": "bancontact.png"},
    {"name": "Easy Banking", "bg_color": "#0066CC", "text_color": "#FFFFFF", "filename": "easybanking.png"},
    {"name": "Crelan Mobile", "bg_color": "#1E90FF", "text_color": "#FFFFFF", "filename": "crelan.png"},
    {"name": "Payconiq", "bg_color": "#FF6B35", "text_color": "#FFFFFF", "filename": "payconiq.png"},
]

# Create logo for each bank
for bank in banks:
    # Create image (200x200 for better quality)
    img = Image.new('RGB', (200, 200), color=bank["bg_color"])
    draw = ImageDraw.Draw(img)
    
    # Try to use a nice font, fall back to default
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 32)
    except:
        font = ImageFont.load_default()
    
    # Get the initials or short name
    text = bank["name"].split()[0][:2].upper()
    
    # Calculate text position for center
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (200 - text_width) / 2
    y = (200 - text_height) / 2
    
    # Draw text
    draw.text((x, y), text, fill=bank["text_color"], font=font)
    
    # Save image
    file_path = os.path.join(logos_dir, bank["filename"])
    img.save(file_path)
    print(f"✓ Created {file_path}")

print("\n✓ All banking app logos generated successfully!")
