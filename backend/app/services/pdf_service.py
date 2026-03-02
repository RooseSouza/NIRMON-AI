import pypdf

def extract_text_from_pdf(file_storage):
    """
    Reads a Flask FileStorage object (PDF) and returns the raw text.
    """
    try:
        # Read file stream directly
        pdf_reader = pypdf.PdfReader(file_storage)
        text = ""
        
        for page in pdf_reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
            
        return text
    except Exception as e:
        print(f"PDF Extraction Error: {e}")
        return None