import json
import re

STEM_MAP = {
    'Jia': 'Giáp', 'Yi': 'Ất', 'Bing': 'Bính', 'Ding': 'Đinh', 'Wu': 'Mậu',
    'Ji': 'Kỷ', 'Geng': 'Canh', 'Xin': 'Tân', 'Ren': 'Nhâm', 'Gui': 'Quý'
}

DOOR_MAP = {
    'Rest': 'Hưu', 'Life': 'Sinh', 'Harm': 'Thương', 'Delusion': 'Đỗ',
    'Scenery': 'Cảnh', 'Death': 'Tử', 'Fear': 'Kinh', 'Open': 'Khai'
}

def parse_formations(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    combinations = re.split(r'Heavenly Stem.*?Earthly Stem', content, flags=re.DOTALL | re.IGNORECASE)
    
    results = {}

    for combo in combinations[1:]:
        head = combo[:200]
        stems_found = []
        for en in STEM_MAP.keys():
            if re.search(rf'\b{en}\b', head):
                matches = re.finditer(rf'\b{en}\b', head)
                for m in matches:
                    stems_found.append((m.start(), en))
        
        stems_found.sort()
        
        if len(stems_found) < 2:
            CH_STEMS = {'甲': 'Jia', '乙': 'Yi', '丙': 'Bing', '丁': 'Ding', '戊': 'Wu', 
                        '己': 'Ji', '庚': 'Geng', '辛': 'Xin', '壬': 'Ren', '癸': 'Gui'}
            for ch, en in CH_STEMS.items():
                if ch in head:
                    matches = re.finditer(ch, head)
                    for m in matches:
                        stems_found.append((m.start(), en))
            stems_found.sort()

        if len(stems_found) < 2: continue
        
        tian_gan_en = stems_found[0][1]
        di_pan_en = stems_found[1][1]
        
        tian_gan = STEM_MAP[tian_gan_en]
        di_pan = STEM_MAP[di_pan_en]
        
        key = f"{tian_gan}_{di_pan}"
        
        struct_match = re.search(r'Structure 格局\s+(.*?)\s+(Rating|$)', combo)
        struct_name = struct_match.group(1).strip() if struct_match else ""
        
        doors_analysis = {}
        doors_section = re.split(r'The 8 Doors Analysis:', combo)
        if len(doors_section) > 1:
            door_content = doors_section[1]
            door_blocks = re.split(r'(休Xiu|生Sheng|傷Shang|杜Du|景Jing|死Si|驚Jing|開Kai)\s*\n\s*(Rest|Life|Harm|Delusion|Scenery|Death|Fear|Open)', door_content)
            
            for i in range(1, len(door_blocks), 3):
                if i+2 >= len(door_blocks): break
                en_name = door_blocks[i+1].strip()
                vi_name = DOOR_MAP.get(en_name, en_name)
                
                raw_text = door_blocks[i+2].strip()
                clean_text = re.sub(r'-- \d+ of \d+ --', '', raw_text)
                clean_text = re.sub(r'\d+ Qi Men Dun Jia.*?\n', '', clean_text)
                clean_text = re.sub(r'奇\n門\n遁\n甲\n十\n干\n格\n局\n篇', '', clean_text)
                clean_text = re.sub(r'^[A-Z]+\s*\n[A-Z]+', '', clean_text, flags=re.MULTILINE)

                doors_analysis[vi_name] = " ".join(clean_text.split())

        results[key] = {
            'tianGan': tian_gan,
            'diPan': di_pan,
            'structure': struct_name,
            'doors': doors_analysis
        }

    return results

if __name__ == "__main__":
    data = parse_formations('dongiap-cn1.txt')
    # Save English version
    with open('src/data/formation_details_en.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Parsed {len(data)} combinations.")
