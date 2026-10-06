import os

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace("SDQA", "SDQu").replace("sdqa", "sdqu")
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def main():
    src_dir = 'src'
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                replace_in_file(os.path.join(root, file))

    # Rename the directory if it exists
    old_dir = os.path.join(src_dir, 'app', 'admin', 'pendaftar-sdqa')
    new_dir = os.path.join(src_dir, 'app', 'admin', 'pendaftar-sdqu')
    if os.path.exists(old_dir):
        os.rename(old_dir, new_dir)
        print(f"Renamed {old_dir} to {new_dir}")

if __name__ == '__main__':
    main()
