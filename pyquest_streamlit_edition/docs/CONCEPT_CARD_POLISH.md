# Beginner concept cards and Python toolkit animation

Implemented in the independent Streamlit edition. Original pyquest_v2 source remains unchanged.

All 113 cards share the new warm beige layout, with clearer code and output blocks, an interactive exploration panel, prediction prompts, mistakes, takeaways, and responsive navigation. Twenty existing beginner cards now use reviewed adaptations from the learner's `codewithharry/prctice/1.py`: printing, input conversion, f-strings, variables, floats, booleans, lists, dictionaries, sets, frozensets, arithmetic, comparisons, logical operators, conditions, loops, and slicing. The reference file was read, never executed. Corrections include unordered sets/frozensets, avoiding built-in name shadowing, and separating text concatenation from numeric addition. Curriculum IDs and lesson versions are retained.

Every concept card includes an expandable Python toolkit section and a locally generated 70-second H.264 animation explaining module, package, library/lib, and framework. The video has on-screen explanations, English captions, examples and analogies. It is silent, not a narrated video. No external API or credits were needed. The browser loads only the fixed public media asset through the existing component bridge. No arbitrary file paths or new execution capability are exposed.

Definitions were checked against [Python modules documentation](https://docs.python.org/3.12/tutorial/modules.html) and [Django's overview](https://www.djangoproject.com/start/overview/). Packages may be regular or namespace packages; libraries and frameworks describe roles rather than a strict file hierarchy.

## Verification

- Main Python regression: 97 tests, 95 passed, 2 Docker-dependent skips.
- Added media/reference checks: 2 tests passed; video access and viewing all concepts leave progress/rewards unchanged.
- Frontend: 69 passed, no failures or skips.
- All 113 worked examples were executed by the existing concept regression and matched expected output.
- Browser: reviewed beginner reference visible, video duration 70 seconds, playback advances, English caption track available, Start Challenge present, no JavaScript errors, no horizontal overflow at 390px.
- Original repository integrity: 249 files checked, no changes.

Evidence: `concept-polish-browser-results.json`; screenshots in ignored `qa-artifacts/concept-beige-desktop.png`, `concept-beige-mobile.png`, and `toolkit-framework-frame.png`. The local generator is `scripts/build_toolkit_video.py`; rebuilding needs Pillow and imageio-ffmpeg, but normal app playback needs neither encoder nor API.

Production AI question generation and Docker execution were not revalidated by the media checks. Existing provider quota and Docker environment limitations remain independent of this UI/content work. Mock gameplay verification is explicitly separate from live AI.
