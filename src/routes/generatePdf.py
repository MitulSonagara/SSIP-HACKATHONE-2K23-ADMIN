import sys
import os
from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


# Check if the correct number of command-line arguments are provided
if len(sys.argv) != 3:
    print("Usage: generate_pdf.py <district> <police_station>")
    sys.exit(1)

# Retrieve the district and police station names from command-line arguments
district = sys.argv[1]
police_station = sys.argv[2]

# Create a folder if it doesn't exist
if not os.path.exists("public/posters"):
    os.makedirs("public/posters")

# Create a PDf
pdf_name = f"public/posters/{district}_{police_station}.pdf"
pdf = canvas.Canvas(pdf_name, pagesize=letter)

# Set the font and size for the text
# font1 = ImageFont.truetype("C:Users/Harsh Solanki/Desktop/LuthierFF/Luthier-Bold.ttf", 75)
# font2 = ImageFont.truetype("C:Users/Harsh Solanki/Desktop/LuthierFF/Luthier-Bold.ttf", 60)

font_path = "C:/Users/mitul/Desktop/Luthier-Bold.ttf"  # Provide the correct font path
font1 = ImageFont.truetype(font_path, 85)
font2 = ImageFont.truetype(font_path, 65)

# Open the template image
template_img = Image.open("posters/Dark Blue Teal Dynamic Photocentric Tech and Gaming Poster.png")
draw = ImageDraw.Draw(template_img)

# Position for district name
district_position = (400, 150)
# Position for police station name
police_station_position = (400, 280)

# Paste the district and police station name on the image
draw.text(district_position, f"{district} POLICE", fill="#03095A", font=font1)
draw.text(police_station_position, f"{police_station} POLICE STATION", fill="#03095A", font=font2)

# Open and resize the QR code
qr_code = Image.open("public/images/qr-code.png")
qr_code = qr_code.resize((500, 500))  # Adjust the size as needed
qr_code_position = (70, 1490)
template_img.paste(qr_code, qr_code_position)

# Save the edited image
output_image_name = f"public/posters/{district}_{police_station}_image.jpg"
template_img = template_img.convert('RGB')  # Convert the image to RGB mode
template_img.save(output_image_name)

# Draw the image on the PDF
pdf.drawInlineImage(output_image_name, 0, 0, width=letter[0], height=letter[1])

# Save the PDF
pdf.save()
