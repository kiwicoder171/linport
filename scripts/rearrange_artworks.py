import os
import json
from PIL import Image

full_dir = "./public/art/full"
art_dir = "./public/art"
os.makedirs(art_dir, exist_ok=True)

artworks_data = [
    # Room 1: Sep 2020 - Mar 2022
    {
        "id": "art-01",
        "catalogIndex": "Work #01",
        "title": "Date Night",
        "room": "room-1",
        "roomName": "Room I · Sep 2020 – Mar 2022",
        "period": "Sep 2020 – Mar 2022",
        "category": "Portrait Art",
        "style": "Semi-Realism",
        "software": "Paint Tool SAI",
        "hardware": "Wacom Pen Tablet",
        "medium": "Digital Painting · Paint Tool SAI",
        "file": "Date night.JPG",
        "notes": "Portrait rendering practice."
    },
    {
        "id": "art-02",
        "catalogIndex": "Work #02",
        "title": "Dorothy",
        "room": "room-1",
        "roomName": "Room I · Sep 2020 – Mar 2022",
        "period": "Sep 2020 – Mar 2022",
        "category": "Portrait Art",
        "style": "Semi-Realism",
        "software": "Clip Studio Paint",
        "hardware": "Wacom Pen Tablet",
        "medium": "Digital Painting · Clip Studio Paint",
        "file": "Dorothy.JPG",
        "notes": "A vintage-style portrait study of my original character, Dorothy."
    },
    {
        "id": "art-03",
        "catalogIndex": "Work #03",
        "title": "Haunted",
        "room": "room-1",
        "roomName": "Room I · Sep 2020 – Mar 2022",
        "period": "Sep 2020 – Mar 2022",
        "category": "Emotional Concept Art",
        "style": "Semi-Realism",
        "software": "Clip Studio Paint",
        "hardware": "Wacom Pen Tablet",
        "medium": "Concept Art · Clip Studio Paint",
        "file": "Haunted.JPG",
        "notes": "A naked woman holding another woman by the neck, who is facing away from her. The woman facing away is appearing stressed."
    },
    {
        "id": "art-04",
        "catalogIndex": "Work #04",
        "title": "The Last Goodbye Kiss",
        "room": "room-1",
        "roomName": "Room I · Sep 2020 – Mar 2022",
        "period": "Sep 2020 – Mar 2022",
        "category": "Emotional Concept Art",
        "style": "Semi-Realism",
        "software": "Clip Studio Paint",
        "hardware": "Wacom Pen Tablet",
        "medium": "Concept Art · Clip Studio Paint",
        "file": "The last goodbye kiss.JPG",
        "notes": "A crying woman kisses an unconscious man gently on his forehead."
    },
    {
        "id": "art-05",
        "catalogIndex": "Work #05",
        "title": "Late Night In The City",
        "room": "room-1",
        "roomName": "Room I · Sep 2020 – Mar 2022",
        "period": "Sep 2020 – Mar 2022",
        "category": "Moody Portrait",
        "style": "Stylized Semi-Realism",
        "software": "Clip Studio Paint",
        "hardware": "Wacom Pen Tablet",
        "medium": "Digital Painting · Clip Studio Paint",
        "file": "Late night in the city.JPG",
        "notes": "A roughly rendered artwork, candid-looking night scene of a woman looking at the camera, with a small town visible in the distance across the way."
    },

    # Room 2: April 2022 - Sep 2022
    {
        "id": "art-06",
        "catalogIndex": "Work #06",
        "title": "The Witch",
        "room": "room-2",
        "roomName": "Room II · Apr 2022 – Sep 2022",
        "period": "Apr 2022 – Sep 2022",
        "category": "Character Concept Art",
        "style": "Stylized Semi-Realism",
        "software": "Clip Studio Paint",
        "hardware": "Wacom Pen Tablet",
        "medium": "Concept Art · Clip Studio Paint",
        "file": "The witch.JPG",
        "notes": "An original fantasy witch character designed by me."
    },
    {
        "id": "art-07",
        "catalogIndex": "Work #07",
        "title": "Crying Girl",
        "room": "room-2",
        "roomName": "Room II · Apr 2022 – Sep 2022",
        "period": "Apr 2022 – Sep 2022",
        "category": "Moody Portrait",
        "style": "Stylized Semi-Realism",
        "software": "Clip Studio Paint",
        "hardware": "Wacom Pen Tablet",
        "medium": "Lighting Study · Clip Studio Paint",
        "file": "Crying girl.JPG",
        "notes": "Duel lighting practice."
    },
    {
        "id": "art-08",
        "catalogIndex": "Work #08",
        "title": "The Demon Sister",
        "room": "room-2",
        "roomName": "Room II · Apr 2022 – Sep 2022",
        "period": "Apr 2022 – Sep 2022",
        "category": "Splash Art",
        "style": "Stylized Semi-Realism",
        "software": "Clip Studio Paint",
        "hardware": "Wacom Pen Tablet",
        "medium": "Splash Illustration · Clip Studio Paint",
        "file": "The Demon Sister.JPG",
        "notes": "A collaboration with my artist friend, Ken Kuro Neko. I drew her original character, one of the demon twins who craves sin and rebellion beyond the standards of demons."
    },
    {
        "id": "art-09",
        "catalogIndex": "Work #09",
        "title": "Last Stop",
        "room": "room-2",
        "roomName": "Room II · Apr 2022 – Sep 2022",
        "period": "Apr 2022 – Sep 2022",
        "category": "Emotional Narrative Scene Art",
        "style": "Stylized Semi-Realism",
        "software": "Clip Studio Paint",
        "hardware": "Wacom Pen Tablet",
        "medium": "Narrative Scene · Clip Studio Paint",
        "file": "Last stop.JPG",
        "notes": "A woman standing next to a bus stop, crying about something."
    },
    {
        "id": "art-10",
        "catalogIndex": "Work #10",
        "title": "After Midnight",
        "room": "room-2",
        "roomName": "Room II · Apr 2022 – Sep 2022",
        "period": "Apr 2022 – Sep 2022",
        "category": "Portrait Art",
        "style": "Stylized Semi-Realism",
        "software": "Clip Studio Paint",
        "hardware": "Wacom Pen Tablet",
        "medium": "Digital Painting · Clip Studio Paint",
        "file": "After midnight.JPG",
        "notes": "A portrait of a woman looking directly at the viewer, with the wind blowing through her hair and her green eyes shining brightly in the night."
    },

    # Room 3: May 2023 - Oct 2024
    {
        "id": "art-11",
        "catalogIndex": "Work #11",
        "title": "Crying Fairy",
        "room": "room-3",
        "roomName": "Room III · May 2023 – Oct 2024",
        "period": "May 2023 – Oct 2024",
        "category": "Aesthetic Portrait Art",
        "style": "Stylized Semi-Realism",
        "software": "Clip Studio Paint",
        "hardware": "Wacom Pen Tablet",
        "medium": "Lighting Study · Clip Studio Paint",
        "file": "Crying fairy.JPG",
        "notes": "Color harmony and lighting practice."
    },
    {
        "id": "art-12",
        "catalogIndex": "Work #12",
        "title": "Fringe & Shadow (Cinema Crop)",
        "room": "room-3",
        "roomName": "Room III · May 2023 – Oct 2024",
        "period": "May 2023 – Oct 2024",
        "category": "Moody Portrait Art",
        "style": "Anime Semi-Realism",
        "software": "Procreate",
        "hardware": "iPad and Apple Pencil",
        "medium": "Digital Painting · Procreate",
        "file": "IMG_0889.JPG",
        "notes": "Experimenting with tools in Procreate."
    },
    {
        "id": "art-13",
        "catalogIndex": "Work #13",
        "title": "Heated Call",
        "room": "room-3",
        "roomName": "Room III · May 2023 – Oct 2024",
        "period": "May 2023 – Oct 2024",
        "category": "Manga Illustration, Narrative Sketch",
        "style": "Manga Style Sketch",
        "software": "Clip Studio Paint",
        "hardware": "Wacom Pen Tablet",
        "medium": "Manga Linework · Clip Studio Paint",
        "file": "Heated call.JPG",
        "notes": "A cute sketch showing a funny dynamic between the two characters."
    },
    {
        "id": "art-14",
        "catalogIndex": "Work #14",
        "title": "Junetta Origin",
        "room": "room-3",
        "roomName": "Room III · May 2023 – Oct 2024",
        "period": "May 2023 – Oct 2024",
        "category": "Character Art",
        "style": "Dark Semi-realistic Sketch",
        "software": "Clip Studio Paint",
        "hardware": "Wacom Pen Tablet",
        "medium": "Character Sketch · Clip Studio Paint",
        "file": "Junetta origin.JPG",
        "notes": "The first artwork of my favorite original character, Junetta Delaney."
    },
    {
        "id": "art-15",
        "catalogIndex": "Work #15",
        "title": "Junetta The Wood Elf",
        "room": "room-3",
        "roomName": "Room III · May 2023 – Oct 2024",
        "period": "May 2023 – Oct 2024",
        "category": "Character Art",
        "style": "Anime Semi-Realism",
        "software": "Clip Studio Paint",
        "hardware": "Wacom Pen Tablet",
        "medium": "Character Illustration · Clip Studio Paint",
        "file": "Junetta the wood elf.JPG",
        "notes": "Junetta in a wood elf form."
    },

    # Room 4: Mar 2026 - Jun 2026
    {
        "id": "art-16",
        "catalogIndex": "Work #16",
        "title": "The Traveler",
        "room": "room-4",
        "roomName": "Room IV · Mar 2026 – Jun 2026",
        "period": "Mar 2026 – Jun 2026",
        "category": "Fan Art",
        "style": "Anime Semi-Realism",
        "software": "Procreate",
        "hardware": "iPad and Apple Pencil",
        "medium": "Digital Painting · Procreate",
        "file": "The traveler.PNG",
        "notes": "Fan art of Lumine from Genshin Impact."
    },
    {
        "id": "art-17",
        "catalogIndex": "Work #17",
        "title": "Maki and Billy",
        "room": "room-4",
        "roomName": "Room IV · Mar 2026 – Jun 2026",
        "period": "Mar 2026 – Jun 2026",
        "category": "Fan Art",
        "style": "Stylized Semi-Realism",
        "software": "Procreate",
        "hardware": "iPad and Apple Pencil",
        "medium": "Digital Illustration · Procreate",
        "file": "Maki and Billy.PNG",
        "notes": "Fan art of Maki and Billy from Tales Runner."
    },
    {
        "id": "art-18",
        "catalogIndex": "Work #18",
        "title": "Dappled Amber Gaze",
        "room": "room-4",
        "roomName": "Room IV · Mar 2026 – Jun 2026",
        "period": "Mar 2026 – Jun 2026",
        "category": "Portrait Art",
        "style": "Stylized Semi-Realism",
        "software": "Procreate",
        "hardware": "iPad and Apple Pencil",
        "medium": "Digital Portrait · Procreate",
        "file": "IMG_0328.PNG",
        "notes": "A beautiful girl with sunlight reflecting one of her hazel eyes."
    },
    {
        "id": "art-19",
        "catalogIndex": "Work #19",
        "title": "Chole",
        "room": "room-4",
        "roomName": "Room IV · Mar 2026 – Jun 2026",
        "period": "Mar 2026 – Jun 2026",
        "category": "Pet Art",
        "style": "Realism",
        "software": "Procreate",
        "hardware": "iPad and Apple Pencil",
        "medium": "Digital Impasto · Procreate",
        "file": "Chole.PNG",
        "notes": "My own cat, Chole."
    },
    {
        "id": "art-20",
        "catalogIndex": "Work #20",
        "title": "Maquia and Ariel",
        "room": "room-4",
        "roomName": "Room IV · Mar 2026 – Jun 2026",
        "period": "Mar 2026 – Jun 2026",
        "category": "Fan Art",
        "style": "Anime Stylized",
        "software": "Procreate",
        "hardware": "iPad and Apple Pencil",
        "medium": "Digital Illustration · Procreate",
        "file": "Maquia and Ariel.PNG",
        "notes": "Fan art of Maquia and Ariel from Maquia: When the Promised Flower Blooms, created while experimenting with a different art style."
    },
    {
        "id": "art-21",
        "catalogIndex": "Work #21",
        "title": "Long-tailed Tits",
        "room": "room-4",
        "roomName": "Room IV · Mar 2026 – Jun 2026",
        "period": "Mar 2026 – Jun 2026",
        "category": "Animal Art",
        "style": "Cartoon Stylized",
        "software": "Procreate",
        "hardware": "iPad and Apple Pencil",
        "medium": "Gouache Study · Procreate",
        "file": "Long-tailed tits.PNG",
        "notes": "A group of long-tailed tits huddling together."
    },
    {
        "id": "art-22",
        "catalogIndex": "Work #22",
        "title": "I Am Here For You",
        "room": "room-4",
        "roomName": "Room IV · Mar 2026 – Jun 2026",
        "period": "Mar 2026 – Jun 2026",
        "category": "Character Art",
        "style": "Stylized Rough Rendered Sketch",
        "software": "Procreate",
        "hardware": "iPad and Apple Pencil",
        "medium": "Digital Ink & Wash · Procreate",
        "file": "I am here for you.PNG",
        "notes": "Quick emotional body language and expression practice, sketched roughly in my style."
    },
    {
        "id": "art-23",
        "catalogIndex": "Work #23",
        "title": "Expression Sketch",
        "room": "room-4",
        "roomName": "Room IV · Mar 2026 – Jun 2026",
        "period": "Mar 2026 – Jun 2026",
        "category": "Sketchbook Art, Expressive Sketch",
        "style": "Pencil Sketch",
        "software": "Traditional Media",
        "hardware": "Sketchbook & Graphite",
        "medium": "Pencil and Sketchbook",
        "file": "Expression sketch.JPG",
        "notes": "One of my facial expression studies."
    },

    # Room 5: Aug 2026 - Sep 2026
    {
        "id": "art-24",
        "catalogIndex": "Work #24",
        "title": "The Nerdy Brawl",
        "room": "room-5",
        "roomName": "Room V · Aug 2026 – Sep 2026",
        "period": "Aug 2026 – Sep 2026",
        "category": "Comic Fan Art",
        "style": "Comic Action Style",
        "software": "Procreate",
        "hardware": "iPad and Apple Pencil",
        "medium": "Sequential Art · Procreate",
        "file": "The nerdy brawl.PNG",
        "notes": "Fan art of the characters from The Eltingville Club by Evan Dorkin."
    },
    {
        "id": "art-25",
        "catalogIndex": "Work #25",
        "title": "Rotten Girl",
        "room": "room-5",
        "roomName": "Room V · Aug 2026 – Sep 2026",
        "period": "Aug 2026 – Sep 2026",
        "category": "Character Art",
        "style": "Rough Stylized Semi-realism",
        "software": "Procreate",
        "hardware": "iPad and Apple Pencil",
        "medium": "Character Illustration · Procreate",
        "file": "Rotten girl.PNG",
        "notes": "A humanized version of my Roblox avatar."
    },
    {
        "id": "art-26",
        "catalogIndex": "Work #26",
        "title": "Anxious Girl Sketch",
        "room": "room-5",
        "roomName": "Room V · Aug 2026 – Sep 2026",
        "period": "Aug 2026 – Sep 2026",
        "category": "Character Art",
        "style": "Rough Stylized Semi-realism",
        "software": "Procreate",
        "hardware": "iPad and Apple Pencil",
        "medium": "Crosshatched Ink & Wash · Procreate",
        "file": "Anxious girl sketch.PNG",
        "notes": "My style exploration sketch."
    },
    {
        "id": "art-27",
        "catalogIndex": "Work #27",
        "title": "Red Hoodie Girl with Her Cat",
        "room": "room-5",
        "roomName": "Room V · Aug 2026 – Sep 2026",
        "period": "Aug 2026 – Sep 2026",
        "category": "Character Art, Lifestyle Art",
        "style": "Stylized Semi-realism",
        "software": "Procreate",
        "hardware": "iPad and Apple Pencil",
        "medium": "Contemporary Illustration · Procreate",
        "file": "Red hoodie girl with her cat.PNG",
        "notes": "A girl in a red hoodie is chilling with her cat in the sun."
    },
    {
        "id": "art-28",
        "catalogIndex": "Work #28",
        "title": "American Teenager",
        "room": "room-5",
        "roomName": "Room V · Aug 2026 – Sep 2026",
        "period": "Aug 2026 – Sep 2026",
        "category": "Fan Art",
        "style": "Semi-realism",
        "software": "Procreate",
        "hardware": "iPad and Apple Pencil",
        "medium": "Environmental Illustration · Procreate",
        "file": "American teenager.PNG",
        "notes": "Fan art of Ethel Cain, inspired by a scene from the music video for “American Teenager”."
    },
    {
        "id": "art-29",
        "catalogIndex": "Work #29",
        "title": "Crush",
        "room": "room-5",
        "roomName": "Room V · Aug 2026 – Sep 2026",
        "period": "Aug 2026 – Sep 2026",
        "category": "Narrative Scene Art, Fan Art",
        "style": "Semi-realism",
        "software": "Procreate",
        "hardware": "iPad and Apple Pencil",
        "medium": "Narrative Scene · Procreate",
        "file": "Crush.PNG",
        "notes": "Inspired by “Crush” by Ethel Cain. The character is my original character, while the scene’s atmosphere is inspired by the song’s music video."
    },
    {
        "id": "art-30",
        "catalogIndex": "Work #30",
        "title": "The God-forsaken Pearl",
        "room": "room-5",
        "roomName": "Room V · Aug 2026 – Sep 2026",
        "period": "Aug 2026 – Sep 2026",
        "category": "Fan Art",
        "style": "Semi-realism",
        "software": "Procreate",
        "hardware": "iPad and Apple Pencil",
        "medium": "Portrait Study · Procreate",
        "file": "God-forsaken Pearl.PNG",
        "notes": "Fan art of Pearl from Pearl (2022)."
    },
    {
        "id": "art-31",
        "catalogIndex": "Work #31",
        "title": "Long Way from Home",
        "room": "room-5",
        "roomName": "Room V · Aug 2026 – Sep 2026",
        "period": "Aug 2026 – Sep 2026",
        "category": "Narrative Scene Art",
        "style": "Semi-realism",
        "software": "Procreate",
        "hardware": "iPad and Apple Pencil",
        "medium": "Painterly Realism · Procreate",
        "file": "Long way from home.PNG",
        "notes": "A girl looking out at golden fields from a truck."
    }
]

out_records = []

for idx, item in enumerate(artworks_data, start=1):
    src_file = os.path.join(full_dir, item["file"])
    webp_name = f"art_{idx:02d}.webp"
    webp_path = os.path.join(art_dir, webp_name)

    with Image.open(src_file) as im:
        orig_w, orig_h = im.size
        aspect = round(orig_w / float(orig_h), 4)

        # Optimize for 3D wall display: max 1440px on longest side, quality=84
        im_thumb = im.copy()
        if im_thumb.mode in ("RGBA", "P"):
            bg = Image.new("RGB", im_thumb.size, (255, 255, 255))
            if im_thumb.mode == "RGBA":
                bg.paste(im_thumb, mask=im_thumb.split()[3])
            else:
                bg.paste(im_thumb)
            im_thumb = bg
        elif im_thumb.mode != "RGB":
            im_thumb = im_thumb.convert("RGB")

        im_thumb.thumbnail((1440, 1440), Image.Resampling.LANCZOS)
        im_thumb.save(webp_path, "WEBP", quality=84, method=6)
        size_kb = round(os.path.getsize(webp_path) / 1024, 1)

    record = {
        "id": item["id"],
        "catalogIndex": item["catalogIndex"],
        "title": item["title"],
        "room": item["room"],
        "roomName": item["roomName"],
        "period": item["period"],
        "category": item["category"],
        "style": item["style"],
        "software": item["software"],
        "hardware": item["hardware"],
        "medium": item["medium"],
        "year": item["period"],
        "width": orig_w,
        "height": orig_h,
        "aspectRatio": aspect,
        "textureUrl": f"/art/{webp_name}",
        "fullResUrl": f"/art/full/{item['file']}",
        "notes": item["notes"],
        "fileSizeKb": size_kb
    }
    out_records.append(record)
    print(f"[{item['id']}] {item['title']} -> {webp_name} ({orig_w}x{orig_h}, {size_kb} KB)")

with open("./src/data/artworks_generated.json", "w") as f:
    json.dump(out_records, f, indent=2)
print("Done! Generated 31 artwork records.")
