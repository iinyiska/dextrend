from PIL import Image
import os

# Source logo
logo_path = r"C:\Users\ASUS\.gemini\antigravity\brain\a1628203-1466-4870-a1c9-c411c3e51ef3\gujin_calligraphy_logo_1769667452498.png"
base_dir = r"C:\Users\ASUS\.gemini\antigravity\scratch\dextrend\android\app\src\main\res"

# Android mipmap sizes
sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

# Load logo
img = Image.open(logo_path)

# Convert to RGBA if needed
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Resize and save for each density
for folder, size in sizes.items():
    resized = img.resize((size, size), Image.LANCZOS)
    
    # Save as ic_launcher.png
    output_path = os.path.join(base_dir, folder, "ic_launcher.png")
    resized.save(output_path, "PNG")
    print(f"Saved {folder}/ic_launcher.png ({size}x{size})")
    
    # Save as ic_launcher_round.png
    output_path_round = os.path.join(base_dir, folder, "ic_launcher_round.png")
    resized.save(output_path_round, "PNG")
    print(f"Saved {folder}/ic_launcher_round.png ({size}x{size})")
    
    # Save foreground for adaptive icons
    output_path_fg = os.path.join(base_dir, folder, "ic_launcher_foreground.png")
    resized.save(output_path_fg, "PNG")
    print(f"Saved {folder}/ic_launcher_foreground.png ({size}x{size})")

print("\nAll icons generated successfully!")
