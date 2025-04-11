import zipfile
import os
import json
import xml.etree.ElementTree as ET

def extract_sketch(sketch_file, extract_path):
    """Extracts the Sketch file contents."""
    with zipfile.ZipFile(sketch_file, 'r') as zip_ref:
        zip_ref.extractall(extract_path)

def parse_sketch_json(json_file):
    """Reads and parses a Sketch JSON file."""
    with open(json_file, 'r', encoding='utf-8') as f:
        return json.load(f)

def create_svg(shapes, output_svg):
    """Creates an SVG file from extracted Sketch vector shapes."""
    svg = ET.Element("svg", xmlns="http://www.w3.org/2000/svg", version="1.1")
    
    for shape in shapes:
        if shape.get("_class") == "rectangle":
            x, y = shape["frame"]["x"], shape["frame"]["y"]
            width, height = shape["frame"]["width"], shape["frame"]["height"]
            rect = ET.SubElement(svg, "rect", x=str(x), y=str(y), width=str(width), height=str(height), fill="black")
    
    tree = ET.ElementTree(svg)
    tree.write(output_svg)

def sketch_to_svg(sketch_file, output_svg):
    """Main function to convert Sketch to SVG."""
    extract_path = "sketch_extracted"
    os.makedirs(extract_path, exist_ok=True)
    
    extract_sketch(sketch_file, extract_path)

    # Read JSON data
    document_json = parse_sketch_json(os.path.join(extract_path, "document.json"))
    pages_dir = os.path.join(extract_path, "pages")
    shapes = []

    # Extract vector data
    for page_file in os.listdir(pages_dir):
        page_data = parse_sketch_json(os.path.join(pages_dir, page_file))
        if "layers" in page_data:
            shapes.extend(page_data["layers"])

    create_svg(shapes, output_svg)
    print(f"SVG saved as {output_svg}")

# Example usage
sketch_to_svg(".\ios-15-notifications.sketch", "output.svg")
