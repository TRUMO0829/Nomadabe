from PIL import Image

# Load the image
img = Image.open(r'c:\Users\Gateway\OneDrive\nomadabe_website\Nomadabe\public\oyu-intelligence-logo.jpg')

# Convert to RGBA if not already
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Get image data
data = img.getdata()

# Create a list for new data
new_data = []

# Make white and light gray background transparent
for item in data:
    # If pixel is white or very light (R, G, B close to 255)
    if item[0] > 240 and item[1] > 240 and item[2] > 240:
        new_data.append((item[0], item[1], item[2], 0))  # Make transparent
    else:
        new_data.append(item)

# Update image data
img.putdata(new_data)

# Save as PNG with transparency
img.save(r'c:\Users\Gateway\OneDrive\nomadabe_website\Nomadabe\public\oyu-intelligence-logo.png')
print('Background removed and saved as PNG')
